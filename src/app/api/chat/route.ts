import { NextResponse } from 'next/server';
import { isRequestForContentCreation, extractDocumentTitle } from '@/lib/contentHelpers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;
    
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
    const isContentCreation = isRequestForContentCreation(lastUserMessage.content);
    
    // Check if ANTHROPIC_API_KEY is set
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (apiKey && apiKey !== 'your_api_key_here') {
      try {
        // Call Anthropic API
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
            messages: messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content
            }))
          })
        });
        
        if (!response.ok) {
          throw new Error(`Anthropic API error: ${response.status}`);
        }
        
        const data = await response.json();
        const generatedContent = data.content[0].text;
        
        // If this is a content creation request, also return as a document
        if (isContentCreation) {
          const docTitle = extractDocumentTitle(lastUserMessage.content);
          
          return NextResponse.json({
            message: "I've created the content you requested. You can view it in the document panel or continue our conversation to make revisions.",
            title: title,
            document: {
              title: docTitle,
              content: generatedContent
            }
          });
        }
        
        return NextResponse.json({
          message: generatedContent,
          title: title,
        });
      } catch (error) {
        console.error('Anthropic API error:', error);
        // Fall back to mock response if API call fails
        const mockResponse = generateResponse(lastUserMessage.content);
        
        // If this is a content creation request, also return as a document
        if (isContentCreation) {
          const docTitle = extractDocumentTitle(lastUserMessage.content);
          
          return NextResponse.json({
            message: "I've created the content you requested. You can view it in the document panel or continue our conversation to make revisions.",
            title: title,
            document: {
              title: docTitle,
              content: mockResponse
            }
          });
        }
        
        return NextResponse.json({
          message: mockResponse,
          title: title,
        });
      }
    } else {
      // Use mock response if API key is not set
      console.log('Using mock response as ANTHROPIC_API_KEY is not set');
      const response = generateResponse(lastUserMessage.content);
      
      // If this is a content creation request, also return as a document
      if (isContentCreation) {
        const docTitle = extractDocumentTitle(lastUserMessage.content);
        
        return NextResponse.json({
          message: "I've created the content you requested. You can view it in the document panel or continue our conversation to make revisions.",
          title: title,
          document: {
            title: docTitle,
            content: response
          }
        });
      }
      
      return NextResponse.json({
        message: response,
        title: title,
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate a response
function generateResponse(message: string): string {
  // If the message is a greeting or introduction
  if (/hello|hi|hey|greetings/i.test(message)) {
    return "Hi, I'm Kaku. How can I help you today?";
  }
  
  // If the message asks about RAG
  if (/what is rag|how does rag work|tell me about rag/i.test(message)) {
    return "RAG (Retrieval-Augmented Generation) is a technique that combines retrieval-based and generation-based approaches for AI text generation. I use RAG to analyze your writing samples, extract your unique style patterns, and then generate new content that matches your voice. This means the content I create for you will sound like you wrote it yourself!";
  }
  
  // If asking about capabilities
  if (/what can you do|capabilities|features/i.test(message)) {
    return "I can help you with various writing tasks while matching your personal style:\n\n• Generate emails, blog posts, or reports\n• Create content in different tones while maintaining your voice\n• Adapt to different writing contexts and audiences\n• Provide variations on your ideas\n\nThe more writing samples you upload, the better I can match your style.";
  }
  
  // If asking how to use
  if (/how to use|how do I|getting started/i.test(message)) {
    return "To get the most out of me:\n\n1. Upload diverse writing samples (more is better)\n2. Be specific about what you'd like me to write\n3. Provide context about the audience and purpose\n4. Let me know if you want a specific tone or formality level\n\nWould you like to upload some writing samples now?";
  }
  
  // If content creation is requested
  if (isRequestForContentCreation(message)) {
    return generateBasicContent(message);
  }
  
  // Default response for other queries
  return "I understand you're asking about \"" + message.substring(0, 30) + (message.length > 30 ? "..." : "") + "\". To give you the most helpful response, I'd need to analyze your writing style first. The more writing samples you upload, the better I can match your unique voice. Would you like to upload some writing samples?";
}

/**
 * Generate basic content for document creation requests
 */
function generateBasicContent(message: string): string {
  // Extract what type of content is being requested
  let contentType = "document";
  const contentTypeMatches = message.match(/(email|letter|essay|article|blog post|report|story|paragraph|document|content|text|message|post)/i);
  if (contentTypeMatches && contentTypeMatches[0]) {
    contentType = contentTypeMatches[0].toLowerCase();
  }
  
  // Try to extract a topic
  let topic = "";
  const aboutMatches = message.match(/about (.*?)($|\.|,|\?)/i);
  const onMatches = message.match(/on (.*?)($|\.|,|\?)/i);
  if (aboutMatches && aboutMatches[1]) {
    topic = aboutMatches[1];
  } else if (onMatches && onMatches[1]) {
    topic = onMatches[1];
  } else {
    topic = "the requested subject";
  }
  
  return `# Sample ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} about ${topic.charAt(0).toUpperCase() + topic.slice(1)}

This is a demonstration of the type of content I can create. In the full version with your writing samples uploaded, I would generate content that matches your personal writing style.

## Introduction
This introduction would set the context for this ${contentType} about ${topic}. It would be written in a style that matches your typical approach to introducing topics.

## Main Content
The body of this ${contentType} would develop key points about ${topic} in a logical structure. The content would be organized according to best practices for this type of writing while maintaining your personal voice.

## Conclusion
This conclusion would summarize the main points and provide closure in a way that's consistent with your writing style.

---
To get content that truly matches your voice, please upload writing samples using the sidebar menu.`;
}

// Helper function to generate a title
function generateTitle(content: string): string {
  const words = content.split(' ');
  
  if (words.length <= 3) {
    return content;
  }
  
  const shortTitle = words.slice(0, 4).join(' ');
  return shortTitle + (words.length > 4 ? '...' : '');
} 