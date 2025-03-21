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
        
        return NextResponse.json({
          message: data.content[0].text,
          title: title,
        });
      } catch (error) {
        console.error('Anthropic API error:', error);
        // Fall back to mock response if API call fails
        const mockResponse = generateResponse(lastUserMessage.content);
        return NextResponse.json({
          message: mockResponse,
          title: title,
        });
      }
    } else {
      // Use mock response if API key is not set
      console.log('Using mock response as ANTHROPIC_API_KEY is not set');
      const response = generateResponse(lastUserMessage.content);
      
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
    return "Hello! I'm your writing assistant powered by RAG technology. I can help you generate content that matches your writing style. What would you like to write today?";
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
  
  // Default response for other queries
  return "I understand you're asking about \"" + message.substring(0, 30) + (message.length > 30 ? "..." : "") + "\". To give you the most helpful response, I'd need to analyze your writing style first. The more writing samples you upload, the better I can match your unique voice. Would you like to upload some writing samples?";
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