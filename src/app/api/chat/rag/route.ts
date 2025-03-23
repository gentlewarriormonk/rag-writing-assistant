import { NextResponse } from 'next/server';
import { getProcessedDocuments, extractUserStyleData, getRelevantContext } from '@/lib/documentProcessor';
import { 
  isRequestForContentCreation, 
  extractDocumentTitle, 
  extractContentTopic,
  needsInteractiveFollowUp,
  generateFollowUpPrompt
} from '@/lib/contentHelpers';

/**
 * Generates improvement suggestions for written content
 */
function generateSuggestions(content: string, userStyleData: any): string[] {
  const suggestions: string[] = [];

  // Style improvement suggestions
  if (content.split('.').some(s => s.trim().split(' ').length > 30)) {
    suggestions.push("Consider breaking up some of the longer sentences for better readability");
  }

  if (content.split('\n\n').some(p => p.split(' ').length > 100)) {
    suggestions.push("Some paragraphs are quite long - consider dividing them for improved readability");
  }

  // Word choice suggestions
  const overusedWords = ['very', 'really', 'just', 'quite', 'simply', 'that', 'actually', 'basically'];
  const overusedWordsCount = overusedWords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = content.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);

  if (overusedWordsCount > 5) {
    suggestions.push("Consider replacing some intensifiers and filler words (like 'very', 'really', 'just') with more precise language");
  }

  // Consistency suggestions
  if (userStyleData.hasDocuments) {
    const usesContractions = /\b(can't|don't|won't|isn't|aren't|wouldn't|couldn't|shouldn't|didn't)\b/i.test(content);
    
    if (userStyleData.formalityScore > 7 && usesContractions) {
      suggestions.push("For a more formal tone consistent with your writing style, consider using non-contracted forms (e.g., 'cannot' instead of 'can't')");
    } else if (userStyleData.formalityScore < 4 && !usesContractions) {
      suggestions.push("For a more conversational tone matching your style, consider using more contractions");
    }
  }

  // Structure suggestions
  const paragraphCount = content.split('\n\n').filter(p => p.trim().length > 0).length;
  if (paragraphCount < 3 && content.length > 500) {
    suggestions.push("Consider adding more paragraph breaks to improve readability");
  }

  // Add voice/tone suggestions if we have enough data
  if (userStyleData.hasDocuments && userStyleData.activeVoice !== undefined) {
    const hasPassiveVoice = /\b(is|are|was|were|be|being|been) [a-z]+ed\b/i.test(content);
    if (userStyleData.activeVoice > 0.8 && hasPassiveVoice) {
      suggestions.push("Your writing typically uses active voice. Consider revising some passive constructions for consistency with your style");
    }
  }

  return suggestions;
}

/**
 * Sanitizes generated content by removing meta text like "Here's a draft..." and sign-offs
 */
function sanitizeGeneratedContent(content: string): string {
  // Remove meta text and all sign-offs/commentary
  return content
    // Remove opening lines that introduce the content
    .replace(/^(Here\'s a draft|I\'ve created|Here is|Here is a draft of|I've drafted a|Here's your)[^]*?(:\s*\n+|\.)/i, '')
    .replace(/^.*?(word |titled ["']?|about |on ["']?)/i, '')
    
    // Remove "letter for your girlfriend Eszter" type text
    .replace(/^.*?(letter|email|document|content|message) (to|for|about) your [^]*?(?::\s*\n+|\.)/i, '')
    
    // Remove all closing commentary, including feedback requests, "How's that?" etc.
    .replace(/\n*(?:I hope (?:you|this)|Let me know|Feel free|How's that|What do you think|Hope this helps)[^]*$/i, '')
    .replace(/\n*(?:I aimed to|I've tried to|I wanted to|I hope I've captured)[^]*$/i, '')
    
    // Remove any requests for writing samples or similar comments
    .replace(/\n*If you have[^]*?writing samples[^]*$/i, '')
    .replace(/\n*Wishing you[^]*$/i, '')
    
    // Clean up any trailing signatures
    .replace(/\n*(?:Best regards|Sincerely|Regards|Best|Yours)[^,\n]*(?:,|\n).*$/i, '')
    
    // Trim extra whitespace
    .trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, style = 'Original', purpose = 'General', hasCorpus = false } = body;
    
    // Log style and purpose settings
    console.log('⭐️ RAG API Request:', { 
      style, 
      purpose, 
      hasCorpus,
      messageCount: messages.length 
    });
    
    // Get the last user message
    const lastUserMessage = messages
      .filter((msg: any) => msg.role === 'user')
      .pop();
      
    if (!lastUserMessage) {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 });
    }
    
    // Generate a title if this is the first message in the conversation
    let title = '';
    if (messages.length <= 2) {
      title = generateTitle(lastUserMessage.content);
    }
    
    // Check if this is a content creation request
    const isContentCreationRequest = isRequestForContentCreation(lastUserMessage.content);
    
    // Enhanced check for follow-up needs:
    // 1. Check standard conditions for interactive follow-up
    // 2. For very short initial requests, almost always ask for more details
    // 3. For love letters, emails, and reports, always require a follow-up conversation
    
    let shouldUseFollowUp = false;
    
    if (isContentCreationRequest) {
      // For very short first-time requests, always ask for details
      if (messages.length <= 2 && lastUserMessage.content.split(/\s+/).length < 15) {
        shouldUseFollowUp = true;
      }
      // For specific content types that need personalization, always ask
      else if (
        lastUserMessage.content.match(/love\s*letter/i) || 
        lastUserMessage.content.match(/email/i) ||
        lastUserMessage.content.match(/report/i)
      ) {
        // Check if we already asked for details about this specific type
        const previousAIQuestions = messages
          .filter((msg: any) => msg.role === 'assistant')
          .map((msg: any) => msg.content.toLowerCase());
          
        const alreadyAskedAboutLoveLetters = previousAIQuestions.some((q: string) => 
          q.includes("love letter") && q.includes("recipient")
        );
        
        const alreadyAskedAboutEmails = previousAIQuestions.some((q: string) => 
          q.includes("email") && q.includes("recipient")
        );
        
        const alreadyAskedAboutReports = previousAIQuestions.some((q: string) => 
          q.includes("report") && q.includes("findings")
        );
        
        if (
          (lastUserMessage.content.match(/love\s*letter/i) && !alreadyAskedAboutLoveLetters) ||
          (lastUserMessage.content.match(/email/i) && !alreadyAskedAboutEmails) ||
          (lastUserMessage.content.match(/report/i) && !alreadyAskedAboutReports)
        ) {
          shouldUseFollowUp = true;
        }
      }
      // Otherwise use the standard check
      else {
        shouldUseFollowUp = needsInteractiveFollowUp(lastUserMessage.content, messages);
      }
    }
    
    // If we should use a follow-up question, return that instead of generating content
    if (isContentCreationRequest && shouldUseFollowUp) {
      const followUpPrompt = generateFollowUpPrompt(lastUserMessage.content);
      console.log('🔄 Using interactive follow-up for content request');
      return NextResponse.json({ 
        message: followUpPrompt,
        title: title || undefined
      });
    }
    
    // Get user's writing style from processed documents only if hasCorpus is true
    let userStyleData;
    let userHasActualDocuments = false;
    if (hasCorpus) {
      console.log('hasCorpus flag is true, extracting user style data');
      userStyleData = extractUserStyleData();
      
      // Double-check that documents are actually available
      userHasActualDocuments = userStyleData.hasDocuments;
      
      console.log('User style data obtained:', {
        hasDocuments: userStyleData.hasDocuments,
        wordCount: userStyleData.hasDocuments ? userStyleData.sampleText?.length || 0 : 0,
        documentDetails: userHasActualDocuments ? 'Documents found' : 'No documents found despite hasCorpus=true'
      });
    } else {
      console.log('hasCorpus flag is false, using default style');
      userStyleData = { hasDocuments: false };
    }
    
    // Get relevant context from the user's documents using semantic search only if hasCorpus is true AND documents are available
    const relevantContext = (hasCorpus && userHasActualDocuments) 
      ? await getRelevantContext(lastUserMessage.content) 
      : "No relevant documents found.";
    
    // Check if ANTHROPIC_API_KEY is set
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (apiKey && apiKey !== 'your_api_key_here') {
      try {
        // Prepare system prompt with user's writing style and relevant context
        const ragSystemPrompt = generateRagSystemPrompt(userStyleData, style, purpose, relevantContext);
        
        // Prepare any additional instructions for content creation
        let finalSystemPrompt = ragSystemPrompt;
        if (isContentCreationRequest) {
          finalSystemPrompt += "\n\nThe user is asking you to create content. Generate a complete, polished piece of writing that matches their request. Focus on quality and coherence.";
        }
        
        // Add explicit style/purpose summary at the beginning
        const styleDirective = getStyleDirective(style);
        const purposeDirective = getPurposeDirective(purpose);
        
        finalSystemPrompt = `CRITICAL INSTRUCTION: You are writing as Kaku, in ${style} style with a ${purpose} focus.\n\n${styleDirective}\n\n${purposeDirective}\n\n${finalSystemPrompt}`;
        
        console.log(`⭐️ Applying style=${style} and purpose=${purpose} explicitly in system prompt`);
        
        // Call Anthropic API with RAG-specific system prompt
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-opus-20240229',
            max_tokens: 4000,
            system: finalSystemPrompt,
            messages: [
              // Add a system message as the first message to reinforce style
              {
                role: 'system',
                content: `IMPORTANT: Write in ${style} style with a ${purpose} purpose. ${styleDirective} ${purposeDirective}`
              },
              ...messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content
              }))
            ]
          })
        });
        
        if (!response.ok) {
          throw new Error(`Anthropic API error: ${response.status}`);
        }
        
        const data = await response.json();
        const generatedContent = data.content[0].text;
        
        // If this was a content creation request, also return as a document
        if (isContentCreationRequest) {
          // Extract a title from the user's request
          const docTitle = extractDocumentTitle(lastUserMessage.content);
          
          // Clean the generated content before returning it
          const cleanedContent = sanitizeGeneratedContent(generatedContent);
          
          // Generate improvement suggestions
          const suggestions = generateSuggestions(cleanedContent, userStyleData);
          
          // Extract content type
          const contentTypeMatches = lastUserMessage.content.match(/(email|letter|essay|article|blog post|report|story|paragraph|document|content|text|message|post)/i);
          const contentType = contentTypeMatches && contentTypeMatches[0] ? contentTypeMatches[0].toLowerCase() : 'content';
          
          return NextResponse.json({
            message: `I've drafted your ${contentType}. Would you like me to save this as a document? You can say "yes" or ask for revisions first.`,
            title: title,
            draftContent: {
              title: docTitle,
              content: cleanedContent
            },
            suggestions: suggestions.length > 0 ? suggestions : undefined
          });
        }
        
        return NextResponse.json({
          message: generatedContent,
          title: title,
        });
      } catch (error) {
        console.error('Anthropic RAG API error:', error);
        // Fall back to mock response if API call fails
        const mockResponse = generateRagResponse(lastUserMessage.content, userStyleData, relevantContext);
        return NextResponse.json({
          message: mockResponse,
          title: title,
        });
      }
    } else {
      // Use mock response if API key is not set
      console.log('Using mock RAG response as ANTHROPIC_API_KEY is not set');
      const response = generateRagResponse(lastUserMessage.content, userStyleData, relevantContext);
      
      // If this is a content creation request, also return a document
      if (isContentCreationRequest) {
        const docTitle = extractDocumentTitle(lastUserMessage.content);
        
        // Clean the generated content before returning it
        const cleanedContent = sanitizeGeneratedContent(response);
        
        // Generate improvement suggestions
        const suggestions = generateSuggestions(cleanedContent, userStyleData);
        
        // Extract content type
        const contentTypeMatches = lastUserMessage.content.match(/(email|letter|essay|article|blog post|report|story|paragraph|document|content|text|message|post)/i);
        const contentType = contentTypeMatches && contentTypeMatches[0] ? contentTypeMatches[0].toLowerCase() : 'content';
        
        // For mock response, also ask for confirmation
        return NextResponse.json({
          message: `I've drafted your ${contentType}. Would you like me to save this as a document? You can say "yes" or ask for revisions first.`,
          title: title,
          draftContent: {
            title: docTitle,
            content: cleanedContent
          },
          suggestions: suggestions.length > 0 ? suggestions : undefined
        });
      }
      
      return NextResponse.json({
        message: response,
        title: title,
      });
    }
  } catch (error) {
    console.error('RAG Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate a dynamic system prompt based on the user's writing style
 */
function generateRagSystemPrompt(
  userStyleData: any, 
  style: string = 'Original', 
  purpose: string = 'General',
  relevantContext: string = ''
): string {
  console.log('⭐️ Generating RAG prompt with:', { style, purpose, hasUserDocs: userStyleData.hasDocuments });
  
  if (!userStyleData.hasDocuments) {
    return "You are a writing assistant that helps users craft content in their preferred style. Since the user hasn't uploaded any writing samples yet, use a natural, conversational tone. Encourage the user to upload samples to better match their style.";
  }
  
  // Format formality level in words
  let formalityLevel = "moderate";
  if (userStyleData.formalityScore >= 8) formalityLevel = "very formal";
  else if (userStyleData.formalityScore >= 6) formalityLevel = "formal";
  else if (userStyleData.formalityScore <= 3) formalityLevel = "casual";
  else if (userStyleData.formalityScore <= 2) formalityLevel = "very casual";
  
  // Format sentence structure
  let sentenceStructure = "moderate length";
  if (userStyleData.averageSentenceLength >= 20) sentenceStructure = "long, complex";
  else if (userStyleData.averageSentenceLength <= 10) sentenceStructure = "short, concise";
  
  // Format paragraph structure
  let paragraphStructure = "moderate";
  if (userStyleData.averageParagraphLength >= 5) paragraphStructure = "longer";
  else if (userStyleData.averageParagraphLength <= 2) paragraphStructure = "brief";
  
  // Adjust based on selected style
  let styleAdjustment = "";
  if (style !== 'Original') {
    switch(style) {
      case 'Professional':
        styleAdjustment = "While maintaining the user's core writing patterns, make the tone more professional, formal, and precise. Use industry-appropriate terminology and maintain a respectful, authoritative voice.";
        break;
      case 'Casual':
        styleAdjustment = "While preserving the user's signature writing elements, make the tone more conversational and approachable. Use contractions, simpler vocabulary, and a friendly voice.";
        break;
      case 'Academic':
        styleAdjustment = "While keeping the user's core writing style, adopt a more scholarly tone with precise terminology, thorough explanations, and formal structure. Include more complex vocabulary and analytical framing.";
        break;
      case 'Creative':
        styleAdjustment = "While maintaining the user's voice, enhance the creative aspects with more vivid descriptions, metaphors, and engaging narrative elements. Vary sentence structure for rhythm.";
        break;
      case 'Technical':
        styleAdjustment = "While preserving the user's writing style, emphasize technical precision, clarity, and structured explanations. Use appropriate terminology and logical organization.";
        break;
      case 'Persuasive':
        styleAdjustment = "While keeping the user's voice, incorporate persuasive elements like stronger claims, compelling evidence, and rhetorical techniques to make the content more convincing.";
        break;
    }
  }
  
  // Adjust based on selected purpose
  let purposeGuidance = "";
  if (purpose !== 'General') {
    switch(purpose) {
      case 'Business':
        purposeGuidance = "This content is for business contexts. Focus on clarity, professionalism, and actionable insights. Structure content logically with clear takeaways.";
        break;
      case 'Academic':
        purposeGuidance = "This content is for academic purposes. Emphasize rigorous analysis, evidence-based reasoning, and proper citation practices. Maintain scholarly objectivity.";
        break;
      case 'Creative':
        purposeGuidance = "This content is for creative purposes. Prioritize engaging storytelling, emotional resonance, and memorable phrasing. Appeal to the imagination and senses.";
        break;
      case 'Social Media':
        purposeGuidance = "This content is for social media. Keep it concise, engaging, and shareable. Use a conversational tone while maintaining the user's voice.";
        break;
      case 'Personal':
        purposeGuidance = "This content is for personal use. Focus on authentic expression and personal connection while maintaining the user's style preferences.";
        break;
      case 'Technical':
        purposeGuidance = "This content is for technical audiences. Focus on accuracy, specific terminology, and structured explanation. Ensure content is precise and informative.";
        break;
    }
  }
  
  // Compile the system prompt
  let prompt = `You are a writing assistant that precisely matches the user's personal writing style. Based on the analysis of their writing samples, adopt these specific style characteristics:

1. Formality Level: ${formalityLevel}
2. Sentence Structure: Tend to use ${sentenceStructure} sentences
3. Paragraph Structure: Prefer ${paragraphStructure} paragraphs
4. Vocabulary: ${userStyleData.vocabularyDiversity > 0.4 ? "Diverse and rich" : "Clear and straightforward"}
5. Complex Words: Occasionally use words like ${userStyleData.commonComplexWords.join(', ')}
6. Transitions: Use phrases like ${userStyleData.commonTransitions.join(', ')} when appropriate

Your goal is to craft content that sounds exactly like the user wrote it themselves. Maintain their voice, tone, and rhythm throughout your responses.`;

  // Add style adjustment if specified
  if (styleAdjustment) {
    prompt += `\n\nIMPORTANT STYLE ADJUSTMENT - You MUST STRICTLY FOLLOW these adjustments to the user's base style:\n${styleAdjustment}`;
    console.log(`⭐️ Applied style adjustment: ${style}`);
  } else {
    console.log(`⭐️ Using original style (no adjustment)`);
  }
  
  // Add purpose guidance if specified
  if (purposeGuidance) {
    prompt += `\n\nIMPORTANT PURPOSE GUIDANCE - You MUST STRICTLY FOLLOW these content objectives:\n${purposeGuidance}`;
    console.log(`⭐️ Applied purpose guidance: ${purpose}`);
  } else {
    console.log(`⭐️ Using general purpose (no specific guidance)`);
  }

  // Add relevant context if available
  if (relevantContext && relevantContext !== "No relevant documents found.") {
    prompt += `\n\nHere is relevant information from the user's documents that you can use to inform your response:\n\n${relevantContext}\n\nUse this information to provide more personalized responses that reflect not just the user's writing style but also reference their knowledge and content when relevant.`;
  }
  
  // Final instruction
  prompt += `\n\nAlways introduce yourself as "Kaku" and adapt all your responses to match these specifications while addressing the user's specific query.`;
  
  return prompt;
}

/**
 * Generate a mock RAG response for demo purposes
 */
function generateRagResponse(
  userQuery: string, 
  styleData: any, 
  relevantContext: string = ''
): string {
  // Check if this is a content creation request
  if (isRequestForContentCreation(userQuery)) {
    // Extract what type of content is being requested
    let contentType = "document";
    const contentTypeMatches = userQuery.match(/(email|letter|essay|article|blog post|report|story|paragraph|document|content|text|message|post)/i);
    if (contentTypeMatches && contentTypeMatches[0]) {
      contentType = contentTypeMatches[0].toLowerCase();
    }
    
    // Extract topic if available
    let topic = extractContentTopic(userQuery);
    if (!topic) {
      topic = "the requested subject";
    }
    
    // Generate a more detailed mock document based on content type
    switch (contentType) {
      case 'email':
        return generateMockEmail(topic, styleData);
      case 'blog post':
      case 'article':
        return generateMockBlogPost(topic, styleData);
      case 'report':
        return generateMockReport(topic, styleData);
      case 'story':
        return generateMockStory(topic, styleData);
      default:
        return generateGenericContent(contentType, topic, styleData);
    }
  }
  
  // Simple response templates based on query type
  if (userQuery.toLowerCase().includes('write') || userQuery.toLowerCase().includes('create')) {
    return `I'd be happy to write that for you based on your unique style! I notice you typically use ${styleData.hasDocuments ? `${styleData.commonComplexWords.slice(0, 3).join(', ')} and tend toward ${styleData.averageSentenceLength > 15 ? 'longer' : 'concise'} sentences` : 'a natural, conversational tone'}. 

${relevantContext.includes("No relevant documents found") ? '' : 'I found some relevant content from your documents that might help with this:'}

${relevantContext.includes("No relevant documents found") ? '' : relevantContext.split('\n\n')[1] || ''}

Would you like me to write this with a specific purpose or style in mind? I can adjust the tone while keeping your core writing patterns.`;
  } else if (userQuery.toLowerCase().includes('help') || userQuery.toLowerCase().includes('how')) {
    return `I'm here to help with that! Based on your writing style, which tends to be ${styleData.hasDocuments ? (styleData.formalityScore > 6 ? 'quite formal' : styleData.formalityScore > 4 ? 'balanced' : 'conversational') : 'natural and clear'}, I can guide you through this.

${relevantContext.includes("No relevant documents found") ? '' : 'I found some useful information in your documents:'}

${relevantContext.includes("No relevant documents found") ? '' : relevantContext.split('\n\n')[1] || ''}

Let me know if you'd like me to elaborate on any part of this explanation!`;
  } else {
    return `Thanks for your message! I understand you're asking about "${userQuery.substring(0, 30)}${userQuery.length > 30 ? '...' : ''}". 

${relevantContext.includes("No relevant documents found") ? '' : 'Based on your documents, I found some relevant information:'}

${relevantContext.includes("No relevant documents found") ? '' : relevantContext.split('\n\n')[1] || ''}

${styleData.hasDocuments ? 'I\'ve analyzed your writing style and notice you often use phrases like ' + styleData.commonTransitions.slice(0, 2).join(', ') + '. I\'ll make sure my responses match your style preferences.' : 'To give you the most personalized response, consider uploading some writing samples so I can match your unique style.'}

How else can I assist you today?`;
  }
}

/**
 * Generate a mock email based on topic
 */
function generateMockEmail(topic: string, styleData: any): string {
  const formality = styleData.formalityScore > 5 ? 'formal' : 'casual';
  const greeting = formality === 'formal' ? 'Dear Recipient,' : 'Hi there,';
  const closing = formality === 'formal' ? 'Sincerely,' : 'Best,';
  
  return `${greeting}

I'm writing regarding ${topic}. This is a sample email that would be written in your personal style using RAG technology. In the actual application, this text would be much more detailed and would accurately reflect your writing patterns, tone, and vocabulary choices.

The content would be well-structured and would include all the necessary components of a professional email, with proper formatting and organization of ideas.

${closing}
Your Name`;
}

/**
 * Generate a mock blog post based on topic
 */
function generateMockBlogPost(topic: string, styleData: any): string {
  return `# ${topic.charAt(0).toUpperCase() + topic.slice(1)}

## Introduction
This is a sample blog post about ${topic}. In the actual application, Kaku would analyze your writing samples to create content that matches your authentic voice. The post would include proper formatting, engaging headers, and a consistent tone throughout.

## Main Points
- First key insight about ${topic}
- Second important aspect to consider
- Analysis of trends and patterns related to ${topic}
- Practical applications or takeaways

## Detailed Analysis
This section would contain a thorough examination of ${topic}, with evidence, examples, and insights that reflect your typical writing style. The depth and complexity would match your usual approach to content.

## Conclusion
This final section would wrap up the main points in a way that feels natural to your writing style, with appropriate closing thoughts and possibly a call to action.

---
This blog post is generated as a sample of what Kaku can create when provided with your writing samples. The actual content would be much more tailored to your specific voice and expertise.`;
}

/**
 * Generate a mock report based on topic
 */
function generateMockReport(topic: string, styleData: any): string {
  return `# ${topic.charAt(0).toUpperCase() + topic.slice(1)} Report

## Executive Summary
This report provides an overview of key findings related to ${topic}. This is a demonstration of how Kaku would generate a report in your personal writing style, with appropriate structure and content organization.

## Background
In this section, the report would establish context about ${topic}, including relevant history and current situation. This would be written to match your typical approach to setting up background information.

## Findings
1. **Primary Finding**: This would detail the most significant discovery about ${topic}.
2. **Secondary Finding**: This would explore additional important aspects.
3. **Trends and Patterns**: This would analyze observable trends related to ${topic}.

## Analysis
This section would provide deeper analysis of the findings, exploring implications and connections. The complexity of analysis would match your typical writing approach.

## Recommendations
Based on the findings, this section would offer practical, actionable recommendations related to ${topic}. The tone and framing would match your typical persuasive style.

## Conclusion
This would summarize the key points and reinforce the main message of the report in a style consistent with your writing.

## Appendices
Any additional information, data, or references would be included here.

---
This report is generated as a sample of what Kaku can create when provided with your writing samples. The actual content would be much more detailed and precisely matched to your style.`;
}

/**
 * Generate a mock story based on topic
 */
function generateMockStory(topic: string, styleData: any): string {
  return `# The Tale of ${topic.charAt(0).toUpperCase() + topic.slice(1)}

In a world where ${topic} was central to everyday life, the unexpected happened.

This opening paragraph would establish the setting and main characters, written in a style that matches your typical narrative approach. The pacing, detail level, and tone would reflect your unique voice.

The second paragraph would begin developing the main conflict of the story, introducing tension and stakes in a way that's consistent with your storytelling style.

"Dialogue would be written to capture the authentic voices of characters," said the protagonist, "while maintaining your particular approach to writing conversation."

As the story progressed, the plot would unfold with your characteristic pacing and attention to detail. Key moments would be emphasized in ways that match your typical narrative focus.

In the climactic scene, the resolution of the conflict around ${topic} would be presented with appropriate emotional weight and significance.

The conclusion would wrap up the story in a satisfying way that aligns with your typical ending style, whether that tends toward clear resolution or thoughtful ambiguity.

---
This story is generated as a sample of what Kaku can create when provided with your writing samples. The actual narrative would be much more detailed and precisely matched to your unique storytelling style.`;
}

/**
 * Generate generic content based on type and topic
 */
function generateGenericContent(contentType: string, topic: string, styleData: any): string {
  return `# ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} About ${topic.charAt(0).toUpperCase() + topic.slice(1)}

This is a sample ${contentType} about ${topic}. In a fully functioning version of Kaku with your writing samples, this content would be generated to closely match your authentic writing style and voice.

The structure would follow appropriate conventions for this type of content, with organization and formatting that serves the purpose while maintaining your unique approach.

Key points would be presented with your typical level of detail and explanation. The vocabulary choices would reflect your common word usage patterns, and sentence structures would mirror your usual writing rhythm.

If you typically use data or examples to support your points, they would be incorporated here in a way that feels natural to your style. The transitions between ideas would flow in a manner consistent with your writing.

The conclusion would wrap up the main ideas in a way that's characteristic of your writing style, leaving the reader with a clear understanding of the key message.

---
This content is generated as a sample of what Kaku can create when provided with your writing samples. The actual ${contentType} would be much more detailed and precisely matched to your unique voice.`;
}

/**
 * Generate a simple title from the first user message
 */
function generateTitle(content: string): string {
  // Get first 5 words or first 30 characters
  const words = content.trim().split(/\s+/);
  if (words.length <= 5) {
    return content.trim();
  }
  
  const firstFiveWords = words.slice(0, 5).join(' ');
  return firstFiveWords + (content.length > firstFiveWords.length ? '...' : '');
}

// Add helper functions for style and purpose directives
function getStyleDirective(style: string): string {
  switch(style) {
    case 'Professional':
      return "Use formal language, industry terminology, and maintain a respectful, authoritative tone throughout.";
    case 'Casual':
      return "Use conversational language with contractions, simpler vocabulary, and a friendly, approachable tone.";
    case 'Academic':
      return "Use scholarly language with precise terminology, proper citations, complex sentence structures, and formal organization.";
    case 'Creative':
      return "Use vivid descriptions, metaphors, varied sentence structure, and engaging narrative elements.";
    case 'Technical':
      return "Use precise technical terminology, clear explanations, logical structure, and factual accuracy.";
    case 'Persuasive':
      return "Use compelling language, rhetorical techniques, strong claims supported by evidence, and persuasive organization.";
    case 'Original':
    default:
      return "Maintain the user's natural writing style without additional style adjustments.";
  }
}

function getPurposeDirective(purpose: string): string {
  switch(purpose) {
    case 'Business':
      return "Structure content with clear takeaways, actionable insights, and professional formatting suitable for business contexts.";
    case 'Academic':
      return "Include rigorous analysis with evidence-based reasoning, proper citations, and maintain scholarly objectivity.";
    case 'Marketing':
      return "Focus on engaging the audience, highlighting benefits, using persuasive calls to action, and creating compelling messaging.";
    case 'Social Media':
      return "Keep content concise, engaging, and shareable with conversational tone and audience-appropriate language.";
    case 'Personal':
      return "Focus on authentic expression, personal connection, and relatable content that reflects individual perspective.";
    case 'Technical':
      return "Emphasize accuracy, specific terminology, clear explanations, and structured presentation of technical information.";
    case 'General':
    default:
      return "Balance clarity, engagement, and informativeness for general purpose communication.";
  }
} 