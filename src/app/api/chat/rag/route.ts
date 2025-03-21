import { NextResponse } from 'next/server';

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
    
    // Check if ANTHROPIC_API_KEY is set
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (apiKey && apiKey !== 'your_api_key_here') {
      try {
        // Prepare system prompt for RAG enhancement
        const ragSystemPrompt = "You are a writing assistant that specializes in adapting to the user's writing style. Use any context about their writing style to generate responses that match their tone, vocabulary, and sentence structure. Always aim to sound as if the user wrote the content themselves.";
        
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
            system: ragSystemPrompt,
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
        
        return NextResponse.json({
          message: data.content[0].text,
          title: title,
        });
      } catch (error) {
        console.error('Anthropic RAG API error:', error);
        // Fall back to mock response if API call fails
        const mockResponse = generateRagResponse(lastUserMessage.content);
        return NextResponse.json({
          message: mockResponse,
          title: title,
        });
      }
    } else {
      // Use mock response if API key is not set
      console.log('Using mock RAG response as ANTHROPIC_API_KEY is not set');
      const response = generateRagResponse(lastUserMessage.content);
      
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

// Helper function to generate a RAG-enhanced response
function generateRagResponse(message: string): string {
  // Simulate RAG by adding more personalized content and style markers
  
  // If the message is asking to write something
  if (/write|create|generate|draft/i.test(message)) {
    return "Based on your writing style from your uploaded samples, I've prepared a draft that matches your voice. I noticed you tend to use shorter paragraphs, conversational transitions, and specific word choices that give your writing a distinctive flow.\n\nHere's what I've created:\n\n---\n\n" + simulateContentGeneration(message) + "\n\n---\n\nWould you like me to adjust anything about this draft?";
  }
  
  // If asking for style analysis
  if (/my style|writing style|analyze/i.test(message)) {
    return "Based on the writing samples you've uploaded, I've noticed some distinctive patterns in your writing style:\n\n• You tend to use shorter, more impactful paragraphs\n• Your sentence structure varies between complex and simple sentences for rhythm\n• You use metaphors and analogies frequently\n• Your tone is conversational but authoritative\n• You have certain signature phrases and transitions\n\nWould you like me to elaborate on any of these aspects of your writing?";
  }
  
  // If asking for help with a specific type of content
  if (/email|blog post|article|report|letter/i.test(message)) {
    const contentType = /email/.test(message) ? "email" : 
                       /blog post/.test(message) ? "blog post" : 
                       /article/.test(message) ? "article" : 
                       /report/.test(message) ? "report" : "letter";
    
    return "I'd be happy to help you with your " + contentType + ". Based on your writing samples, I'll make sure to incorporate your unique style elements, such as your typical paragraph structure, sentence flow, and word choices. Can you provide a bit more information about the specific topic and the main points you'd like to cover in this " + contentType + "?";
  }
  
  // Default RAG response
  return "I've analyzed your query about \"" + message.substring(0, 30) + (message.length > 30 ? "..." : "") + "\" in the context of your writing samples. Based on the writing style I've learned from your corpus, I can help you create content that sounds authentically like you. Your writing tends to have a distinctive rhythm and flow that I can emulate. How would you like me to help you with this particular topic?";
}

// Helper function to generate a title
function generateTitle(message: string): string {
  const words = message.split(' ');
  
  if (words.length <= 3) {
    return message;
  }
  
  const shortTitle = words.slice(0, 4).join(' ');
  return shortTitle + (words.length > 4 ? '...' : '');
}

// Helper function to simulate content generation
function simulateContentGeneration(message: string): string {
  // Extract topics from the message
  const topics = message.toLowerCase().match(/about (.*?)(?:\.|$)/i);
  const topic = topics ? topics[1] : "the requested topic";
  
  return `I wanted to share some thoughts about ${topic} that have been on my mind lately. It's a subject that deserves careful consideration.

First, we need to acknowledge the complexity involved. There are multiple perspectives to consider, and each brings valuable insights to the table. What works in one context might not translate well to another.

That said, I've found that approaching ${topic} with an open mind yields the best results. Rigid thinking rarely leads to innovative solutions or deeper understanding.

The key takeaway here is that flexibility and continuous learning serve us well when dealing with ${topic}. As our understanding evolves, so too should our approaches and strategies.`;
} 