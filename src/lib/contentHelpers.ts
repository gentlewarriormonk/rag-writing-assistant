/**
 * Helper functions for content creation and document handling
 */

/**
 * Check if the user's message is requesting content creation
 */
export function isRequestForContentCreation(message: string): boolean {
  const creationPhrases = [
    /write (a|an|the)?/i,
    /create (a|an|the)?/i,
    /draft (a|an|the)?/i,
    /compose (a|an|the)?/i,
    /generate (a|an|the)?/i,
    /help me (write|create|draft)/i,
    /can you (write|create|draft)/i,
    /would you (write|create|draft)/i
  ];
  
  const contentTypes = [
    /email/i,
    /letter/i,
    /essay/i,
    /article/i,
    /blog post/i,
    /report/i,
    /story/i,
    /paragraph/i,
    /document/i,
    /content/i,
    /text/i,
    /message/i,
    /post/i
  ];
  
  // Check if the message contains both a creation phrase and a content type
  return creationPhrases.some(phrase => phrase.test(message)) && 
         contentTypes.some(type => type.test(message));
}

/**
 * Check if the user's request needs an interactive follow-up before generating content
 * This helps create a more conversational flow rather than immediately generating content
 */
export function needsInteractiveFollowUp(message: string, previousMessages: any[]): boolean {
  // If this is already a reply to a follow-up, no need for another follow-up
  const previousAIMessage = previousMessages
    .filter((msg: any) => msg.role === 'assistant')
    .pop();
    
  if (previousAIMessage && 
      (previousAIMessage.content.includes("What specific points") || 
       previousAIMessage.content.includes("What would you like") ||
       previousAIMessage.content.includes("What tone") ||
       previousAIMessage.content.includes("Could you provide more details"))) {
    return false;
  }
  
  // Check if this is a content creation request
  if (!isRequestForContentCreation(message)) {
    return false;
  }
  
  // Check if the request already has detailed instructions
  const hasDetailedInstructions = 
    message.length > 100 || // Longer requests are likely more detailed
    message.includes("include") || 
    message.includes("mention") || 
    message.includes("focus on") || 
    message.includes("highlight") ||
    message.includes("emphasize") ||
    message.split(",").length > 2 || // Multiple comma-separated points
    message.split("\n").length > 2;  // Multiple line breaks suggest detailed instructions
    
  return !hasDetailedInstructions;
}

/**
 * Generate an appropriate follow-up prompt based on the content type
 */
export function generateFollowUpPrompt(message: string): string {
  let contentType = "document";
  
  // Determine content type with more precise pattern matching
  if (message.match(/love\s*letter/i)) {
    return "I'd be happy to help you write a love letter. Could you tell me more about the recipient? What aspects of your relationship would you like to highlight, and what feelings are you hoping to express? What tone would you prefer (romantic, heartfelt, playful, poetic, etc.)?";
  } 
  else if (message.match(/email/i)) contentType = "email";
  else if (message.match(/letter/i)) contentType = "letter";
  else if (message.match(/essay/i)) contentType = "essay";
  else if (message.match(/article|blog post/i)) contentType = "article";
  else if (message.match(/report/i)) contentType = "report";
  else if (message.match(/story/i)) contentType = "story";
  
  // Generate appropriate follow-up based on content type
  switch (contentType) {
    case "email":
      return "I'd be happy to help draft that email. Could you share the following details?\n\n- Who is the recipient?\n- What's the main purpose of this email?\n- What key points need to be covered?\n- What tone would be appropriate (formal, casual, etc.)?";
    case "letter":
      return "I'd be happy to help write that letter. To make it more personal, could you tell me:\n\n- Who is the recipient?\n- What's your relationship with them?\n- What key message are you trying to convey?\n- What tone would you prefer (formal, casual, heartfelt, etc.)?";
    case "essay":
      return "I'd be glad to help with your essay. To get started, could you share:\n\n- What's the main topic or thesis?\n- Any specific points you want to include?\n- Are there any sources or examples you'd like to incorporate?\n- What's the intended audience?\n\nThis will help me craft something that matches your vision.";
    case "article":
      return "I can help with your article. To make it more effective, could you let me know:\n\n- Who is the target audience?\n- What are the key points you want to cover?\n- What's the main purpose (inform, persuade, entertain)?\n- Any specific examples or data you want to include?\n\nWith these details, I can create a more tailored article.";
    case "report":
      return "I'd be happy to help with your report. For the best results, could you provide:\n\n- What's the main subject of the report?\n- What data or findings should be highlighted?\n- Who is the intended audience?\n- What sections or structure would you prefer?\n\nThis information will help me create a comprehensive report.";
    case "story":
      return "I can help with your story. To make it engaging, could you share:\n\n- What genre or style are you looking for?\n- Any specific characters or setting you have in mind?\n- What theme or message would you like to convey?\n- Any plot elements you'd like to include?\n\nWith these details, I can craft a story that matches your vision.";
    default:
      return "I'd be happy to help write that for you. To create something that matches what you're looking for, could you provide more details about:\n\n- The specific purpose or goal\n- Key points you want to include\n- Your preferred tone or style\n- Who the intended audience is\n\nThis will help me craft content that better meets your needs.";
  }
}

/**
 * Extract a document title from the user's content request
 */
export function extractDocumentTitle(message: string): string {
  // Extract what type of content is being requested
  let contentType = "Document";
  const contentTypeMatches = message.match(/(email|letter|essay|article|blog post|report|story|paragraph|document|content|text|message|post)/i);
  if (contentTypeMatches && contentTypeMatches[0]) {
    contentType = contentTypeMatches[0].charAt(0).toUpperCase() + contentTypeMatches[0].slice(1);
  }
  
  // Try to extract a topic or subject
  let topic = "";
  const aboutMatches = message.match(/about (.*?)($|\.|,|\?)/i);
  const onMatches = message.match(/on (.*?)($|\.|,|\?)/i);
  const forMatches = message.match(/for (.*?)($|\.|,|\?)/i);
  const regardingMatches = message.match(/regarding (.*?)($|\.|,|\?)/i);

  if (aboutMatches && aboutMatches[1]) {
    topic = aboutMatches[1];
  } else if (onMatches && onMatches[1]) {
    topic = onMatches[1];
  } else if (forMatches && forMatches[1]) {
    topic = forMatches[1];
  } else if (regardingMatches && regardingMatches[1]) {
    topic = regardingMatches[1];
  }
  
  if (topic) {
    return `${contentType}: ${topic}`;
  } else {
    // If no specific topic found, use timestamp to make unique
    return `${contentType} - ${new Date().toLocaleDateString()}`;
  }
}

/**
 * Extract the topic of content from a user query
 */
export function extractContentTopic(query: string): string {
  // Try various patterns to extract the topic
  const aboutMatches = query.match(/about (.*?)($|\.|,|\?)/i);
  const onMatches = query.match(/on (.*?)($|\.|,|\?)/i);
  const forMatches = query.match(/for (.*?)($|\.|,|\?)/i);
  const regardingMatches = query.match(/regarding (.*?)($|\.|,|\?)/i);

  if (aboutMatches && aboutMatches[1]) {
    return aboutMatches[1];
  } else if (onMatches && onMatches[1]) {
    return onMatches[1];
  } else if (forMatches && forMatches[1]) {
    return forMatches[1];
  } else if (regardingMatches && regardingMatches[1]) {
    return regardingMatches[1];
  }
  
  return "";
} 