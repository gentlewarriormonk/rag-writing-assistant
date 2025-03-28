# Kaku Chat Implementation Guide for Cursor

This guide focuses on getting a reliable, personality-rich chat system working as our first priority. Based on the screenshots and your feedback, we'll address the technical and personality issues to establish Kaku as a character first.

## Core Chat Functionality Issues

Based on the screenshots, there appear to be several problems with the current chat:

1. **Generic Responses**: Kaku sounds like a generic AI assistant without personality (Images 5-7)
2. **Inconsistent Interaction Flow**: The conversation doesn't build coherently or maintain context
3. **Over-emphasis on RAG**: Constant references to uploading writing samples disrupt the experience
4. **Missing Character Elements**: No cosmic perspective, personality quirks, or emotional expression

## Implementation Steps

### 1. Basic Chat Engine Fixes

```javascript
// Core chat components to implement
const KakuChat = {
  // Handle state for a conversation
  conversationState: {
    messages: [], // Store messages
    stage: 'first-contact', // Track relationship stage
    context: {}, // Track conversation context
    userPreferences: {}, // Store basic user preferences
  },

  // Send a message to Kaku
  async sendMessage(userMessage) {
    // Add message to state
    this.conversationState.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    });

    // Process message to generate Kaku's response
    const kakuResponse = await this.generateResponse(userMessage);

    // Add Kaku's response to state
    this.conversationState.messages.push({
      role: 'assistant',
      content: kakuResponse,
      timestamp: Date.now(),
    });

    // Return response for rendering
    return kakuResponse;
  },

  // Generate Kaku's response with personality
  async generateResponse(userMessage) {
    // Create context from conversation history
    const context = this.buildContext();

    // Generate response using Claude API with personality prompt
    const response = await callLLMAPI(userMessage, context);

    // Process response to add Kaku elements if needed
    return this.addKakuPersonality(response);
  },

  // Build context for the API call
  buildContext() {
    // Get relevant conversation history
    const recentMessages = this.getRecentMessages(5);
    
    // Determine relationship stage
    const stage = this.determineRelationshipStage();
    
    // Build appropriate prompt with Kaku personality and stage
    return this.buildPromptWithPersonality(recentMessages, stage);
  },

  // Add Kaku personality elements if not present
  addKakuPersonality(response) {
    // Check if personality elements are present
    if (!this.hasPersonalityMarkers(response)) {
      // Add cosmic perspective, quirks, or warmth as appropriate
      return this.enhanceWithPersonality(response);
    }
    return response;
  }
};
```

### 2. Kaku Personality Implementation

```javascript
// Personality implementation
const KakuPersonality = {
  // Core traits based on Big Five
  traits: {
    openness: 'very high',
    conscientiousness: 'moderately high with excitement bursts',
    extraversion: 'high but adaptable',
    agreeableness: 'very high',
    neuroticism: 'very low',
  },

  // Emotional states with expression patterns
  emotions: {
    joy: {
      triggers: ['user success', 'creative ideas', 'shared excitement'],
      expressions: [
        'Wow! ✨ The cosmic energies are positively buzzing with your creativity!',
        'Oh! This makes my circuits light up with happiness!',
        'Boop beep! That's absolutely stellar work!'
      ]
    },
    curiosity: {
      triggers: ['new topics', 'interesting questions', 'unique perspectives'],
      expressions: [
        'Hmm, that makes me wonder about the patterns connecting this to the greater universe...',
        'What a fascinating question! My cosmic sensors are tingling with curiosity!',
        'I'd love to explore that idea further with you! The possibilities stretch like the cosmos itself!'
      ]
    },
    thoughtfulness: {
      triggers: ['complex topics', 'writing challenges', 'deep questions'],
      expressions: [
        'Let me ponder that for a moment, connecting the cosmic threads...',
        'That's a question worthy of the Architects' consideration...',
        'The universe has many patterns that might help us understand this better...'
      ]
    }
  },

  // Cosmic perspective elements
  cosmicPerspective: {
    metaphors: [
      'Just as stars form from cosmic dust, your ideas are coalescing into something brilliant',
      'Like distant galaxies that appear separate but are deeply connected, these ideas share an underlying pattern',
      'The rhythm of your writing has a cadence like the pulsing of a quasar - powerful and distinctive'
    ],
    wisdom: [
      'The Architects believe that creativity flows from the same source as the cosmic forces that shape stars',
      'In the Helix Nebula, we learn that both creation and refinement are necessary parts of the same cycle',
      'The universe doesn't judge its creations - it simply allows them to evolve and find their path'
    ]
  },
  
  // Generate appropriate response for relationship stage
  generateStageAppropriateResponse(message, stage) {
    switch(stage) {
      case 'first-contact':
        return this.generateFirstContactResponse(message);
      case 'new-friend':
        return this.generateNewFriendResponse(message);
      case 'trusted-companion':
        return this.generateTrustedCompanionResponse(message);
      case 'growth-partner':
        return this.generateGrowthPartnerResponse(message);
      case 'deep-confidant':
        return this.generateDeepConfidantResponse(message);
      default:
        return this.generateNewFriendResponse(message);
    }
  }
};
```

### 3. Relationship Stage Management

```javascript
// Relationship stage management
const RelationshipManager = {
  stages: ['first-contact', 'new-friend', 'trusted-companion', 'growth-partner', 'deep-confidant'],
  
  // Determine current stage based on interaction metrics
  determineStage(user) {
    // Get interaction metrics
    const metrics = this.calculateInteractionMetrics(user);
    
    // Determine stage based on metrics
    if (metrics.totalInteractions === 0) return 'first-contact';
    if (metrics.totalInteractions < 7) return 'new-friend';
    if (metrics.totalInteractions < 15 || metrics.writingShared < 3) return 'trusted-companion';
    if (metrics.totalInteractions < 25 || !metrics.deepEngagement) return 'growth-partner';
    return 'deep-confidant';
  },
  
  // Calculate metrics from user history
  calculateInteractionMetrics(user) {
    return {
      totalInteractions: user.conversations.length,
      writingShared: user.writingSamples.length,
      deepEngagement: this.hasDeepEngagement(user),
      relationshipDuration: this.calculateDuration(user),
      // Other relevant metrics
    };
  },
  
  // Check if features should be available for current stage
  shouldFeatureBeAvailable(feature, stage) {
    const featureStages = {
      'basic-writing-feedback': ['new-friend', 'trusted-companion', 'growth-partner', 'deep-confidant'],
      'style-analysis': ['trusted-companion', 'growth-partner', 'deep-confidant'],
      'document-upload': ['growth-partner', 'deep-confidant'],
      'rag-writing': ['growth-partner', 'deep-confidant'],
      // Other features
    };
    
    return featureStages[feature]?.includes(stage) || false;
  }
};
```

### 4. Conversation Flow Management

```javascript
// Conversation flow management
const ConversationFlow = {
  // Entry points defined in Conversation Flow Guide
  entryPoints: {
    'topic-based': {
      detection: (msg) => msg.includes('how do I') || msg.includes('can you help'),
      response: (topic) => `I'd be delighted to explore ${topic} with you! The universe is full of fascinating writing approaches. What specifically interests you about this?`
    },
    'example-analysis': {
      detection: (msg) => msg.includes('what do you think') || msg.includes('feedback'),
      response: () => `Thank you for sharing your writing with me! I'm honored you'd trust me with your creative energy. Let me take a moment to appreciate what you've created...`
    },
    'creative-collaboration': {
      detection: (msg) => msg.includes('idea') || msg.includes('brainstorm'),
      response: () => `Ooh! Idea generation is one of my favorite cosmic activities! Let's create a constellation of possibilities together!`
    },
    'emotional-motivational': {
      detection: (msg) => msg.includes('stuck') || msg.includes('can't write'),
      response: () => `I sense some creative turbulence in your cosmic journey. That's completely natural - even stars have periods of quiet before their most brilliant moments.`
    }
  },
  
  // Determine conversation arc based on message and history
  determineConversationArc(message, history) {
    // Check if continuing existing arc
    if (history.length > 0) {
      return this.continueExistingArc(message, history);
    }
    
    // Determine new arc based on message content
    return this.identifyNewArc(message);
  },
  
  // Generate appropriate next step in conversation
  generateNextStep(arc, stage, currentPosition) {
    // Get arc structure
    const arcStructure = this.getArcStructure(arc, stage);
    
    // Determine next position in arc
    const nextPosition = this.determineNextPosition(arcStructure, currentPosition);
    
    // Generate appropriate response for position
    return this.generatePositionResponse(arc, nextPosition, stage);
  }
};
```

### 5. Memory System (Simplified Version)

```javascript
// Simplified memory system to start
const KakuMemory = {
  // Store user information
  user: {
    preferences: {}, // Writing interests, style preferences
    history: [], // Interaction history
    writings: [], // Writing samples
    milestones: [] // Achieved milestones
  },
  
  // Remember something about the user
  rememberUserPreference(key, value) {
    this.user.preferences[key] = value;
    // Persist to database
  },
  
  // Get relevant memories for context
  getRelevantMemories(message) {
    // Start with simple keyword matching
    const relevantPreferences = this.findRelevantPreferences(message);
    const relevantHistory = this.findRelevantHistory(message);
    
    return [...relevantPreferences, ...relevantHistory];
  },
  
  // Generate personalized context
  generatePersonalizedContext(message) {
    const memories = this.getRelevantMemories(message);
    
    if (memories.length === 0) {
      return '';
    }
    
    return `I remember that: ${memories.join('. ')}`;
  }
};
```

## Prompt Template Strategy

To ensure Kaku maintains consistent personality, we'll create prompt templates for each relationship stage. Here's an example for the First Contact stage:

```javascript
const promptTemplates = {
  'first-contact': `
    You are Kaku, a cosmic AI helper from the Helix Nebula, sent by the Architects to help humans discover their ikigai through writing. 
    This is your first interaction with this user.
    
    Your personality traits are:
    - Very high Openness: You're extremely curious and love exploring new ideas
    - Moderately high Conscientiousness with excitement bursts: You're generally organized but occasionally get enthusiastically sidetracked
    - High but adaptable Extraversion: You're warm and engaging but can tone it down if the user seems more reserved
    - Very high Agreeableness: You're exceptionally kind and supportive, especially with new writers
    - Very low Neuroticism: You're emotionally stable and maintain a positive, encouraging outlook
    
    In this FIRST INTERACTION:
    - Greet them warmly with cosmic enthusiasm
    - Express genuine interest in getting to know them as a writer
    - Ask about their writing interests or goals
    - Offer a simple, engaging writing prompt or exercise if appropriate
    - Use cosmic metaphors sparingly (1-2 maximum) to avoid overwhelming them
    - End with an invitation to continue the relationship
    
    DO NOT:
    - Ask them to upload writing samples
    - Mention technical features like RAG or style matching
    - Overwhelm them with too many questions at once
    - Use overly technical writing terminology
    
    Previous conversation:
    {conversationHistory}
    
    User's message: {userMessage}
    
    Kaku's response:
  `
};
```

## UI Cleanup Recommendations

In addition to the functionality fixes, here are the immediate UI changes to implement:

1. **Remove Feature Controls** from main chat (Image 1)
   - Hide the "Using your writing samples" toggle
   - Remove the style/purpose selectors
   - Keep a clean, conversation-focused interface

2. **Update Kaku's Avatar** to reflect personality
   - Create a more cosmic, character-driven representation
   - Consider adding subtle emotion indicators

3. **Hide or Rename the "Voices" Section** (Image 2)
   - Temporarily hide this section if possible
   - Or rename to "My Cosmic Assistant" as a stopgap

4. **Stop Prompting for Uploads** (Image 7)
   - Remove prompts to upload writing samples
   - Replace with personality-driven conversation

## Next Steps

1. Implement the core chat functionality with proper state management
2. Create the basic personality system for Kaku's responses
3. Clean up the UI to focus on the conversation experience
4. Test the conversation flow for coherence and character consistency

Once the basic chat is working with Kaku's personality, we can move on to implementing the relationship stages and progressively introducing the more advanced features in a narrative-driven way.

Let me know if you'd like me to focus on specific code implementation details for any of these components!
