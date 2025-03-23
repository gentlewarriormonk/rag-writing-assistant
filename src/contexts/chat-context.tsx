'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCorpus } from './corpus-context';
import { useRouter } from 'next/navigation';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  documents?: DocumentOutput[];
}

interface DocumentOutput {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface ChatContextType {
  conversation: Conversation | null;
  conversations: Conversation[];
  isLoading: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  newConversation: () => void;
  sendMessage: (content: string) => Promise<void>;
  loadConversation: (id: string) => void;
  deleteConversation: (id: string) => Promise<void>;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  selectedPurpose: string;
  setSelectedPurpose: (purpose: string) => void;
  navigateToSamples: () => void;
}

const ChatContext = createContext<ChatContextType>({
  conversation: null,
  conversations: [],
  isLoading: false,
  sendMessage: async () => {},
  newConversation: () => {},
  loadConversation: () => {},
  deleteConversation: async () => {},
  isSidebarOpen: false,
  toggleSidebar: () => {},
  setConversations: () => {},
  selectedStyle: "Original",
  setSelectedStyle: () => {},
  selectedPurpose: "General",
  setSelectedPurpose: () => {},
  navigateToSamples: () => {},
});

export const useChat = () => useContext(ChatContext);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isCorpusReady } = useCorpus();
  const router = useRouter();
  
  // Add style and purpose state
  const [selectedStyle, setSelectedStyle] = useState<string>("Original");
  const [selectedPurpose, setSelectedPurpose] = useState<string>("General");

  // Create a new empty conversation
  const newConversation = () => {
    // Check if user has had previous conversations
    const hasHadConversations = conversations.length > 0;
    
    const newConvo: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [{
        id: '1',
        role: 'assistant',
        content: hasHadConversations 
          ? "Hi again! What would you like to work on today?" 
          : "Hi there! I'm Kaku, your friendly AI writing assistant. I can help you create content that sounds just like you wrote it! To get started, upload some of your writing samples using the sidebar menu, then tell me what you'd like to write today. I'm excited to help you craft amazing content in your unique voice!",
        timestamp: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [],
    };
    
    // Update state with new conversation
    setConversation(newConvo);
    setConversations(prev => {
      const updated = [newConvo, ...prev];
      // Save to localStorage
      localStorage.setItem('conversations', JSON.stringify(updated));
      return updated;
    });
    
    // Navigate to dashboard to show the new conversation
    if (window.location.pathname !== '/dashboard') {
      router.push('/dashboard');
    }
  };

  // Load conversations on mount
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    const loadConversations = async () => {
      try {
        // In a real app, fetch from API
        const savedConversations = localStorage.getItem('conversations');
        if (savedConversations) {
          const parsed = JSON.parse(savedConversations);
          
          // Check for and correct old greeting message in existing conversations
          const updatedConversations = parsed.map((convo: Conversation) => {
            // If the first message is from the assistant and has the old greeting, update it
            if (convo.messages && convo.messages.length > 0 && 
                convo.messages[0].role === 'assistant' && 
                (convo.messages[0].content === "Hello! I'm your AI writing assistant. How can I help you today?" ||
                 convo.messages[0].content === "Hi, I'm Kaku. How can I help you today?")) {
              
              // Replace with the new greeting
              convo.messages[0].content = "Hi there! I'm Kaku, your friendly AI writing assistant. I can help you create content that sounds just like you wrote it! To get started, upload some of your writing samples using the sidebar menu, then tell me what you'd like to write today. I'm excited to help you craft amazing content in your unique voice!";
            }
            return convo;
          });
          
          // Save the corrected conversations
          localStorage.setItem('conversations', JSON.stringify(updatedConversations));
          
          setConversations(updatedConversations);
          
          // Load most recent conversation if available
          if (updatedConversations.length > 0) {
            setConversation(updatedConversations[0]);
          } else {
            // Create a new conversation if none exist
            newConversation();
          }
        } else {
          // Create a new conversation if none exist
          newConversation();
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
        newConversation();
      }
    };
    
    loadConversations();
  }, []);

  // Save conversations when they change
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    if (conversations.length === 0) return;
    
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Helper to generate unique IDs
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Helper to generate a title from user content
  const generateTitle = (content: string): string => {
    // Clean up the content - remove newlines and extra spaces
    const cleanContent = content
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Get first sentence or first N characters
    const title = cleanContent.split(/[.!?]/, 1)[0] || cleanContent;
    return title.length > 40 ? title.substring(0, 40) + '...' : title;
  };

  // Send a new message
  const sendMessage = async (content: string) => {
    if (!conversation) return;
    if (!content.trim()) return;
    
    // Create user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    // Create placeholder for assistant response
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isLoading: true,
    };
    
    // Check if this is the first user message and update the title if it is
    const isFirstUserMessage = conversation.messages.filter(msg => msg.role === 'user').length === 0;
    let updatedTitle = conversation.title;
    
    if (isFirstUserMessage && conversation.title === 'New Conversation') {
      updatedTitle = generateTitle(content);
    }
    
    // Update conversation with user message and loading placeholder
    const updatedMessages = [...conversation.messages, userMessage, assistantMessage];
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      title: updatedTitle,
      updatedAt: new Date().toISOString(),
    };
    
    // Update state
    setConversation(updatedConversation);
    setConversations(prev => 
      prev.map(c => c.id === conversation.id ? updatedConversation : c)
    );
    
    // Generate assistant response
    setIsLoading(true);
    try {
      let endpoint = '/api/chat';
      if (isCorpusReady) {
        // Use RAG endpoint if corpus is available
        endpoint = '/api/chat/rag';
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.slice(0, -1), // Exclude loading message
          style: selectedStyle,
          purpose: selectedPurpose,
          hasCorpus: isCorpusReady // Tell the API if corpus is available
        }),
      });
      
      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      
      // Update the assistant message with the actual response
      const finalMessages = updatedMessages.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: data.message, isLoading: false } 
          : msg
      );

      // Generate a better title for the conversation
      let conversationTitle = 'New Conversation';
      if (conversation.messages.length <= 2 && data.title) {
        conversationTitle = data.title;
      } else if (updatedConversation.title === 'New Conversation') {
        // Generate a better title based on first user message
        const firstUserMessage = updatedConversation.messages.find(m => m.role === 'user');
        if (firstUserMessage) {
          const titleContent = firstUserMessage.content;
          
          // Check for content creation requests
          if (/write|create|draft|generate/i.test(titleContent)) {
            // Extract what's being created
            const match = titleContent.match(/(about|on|regarding)\s+([^,.!?]+)/i);
            if (match && match[2]) {
              conversationTitle = match[2].trim();
            } else {
              // Try to extract the topic in other ways
              const topicMatch = titleContent.match(/(?:write|create|draft|generate)[^]*?(about|on|regarding|for|titled|called)[^]*?([^,.!?]+)/i);
              if (topicMatch && topicMatch[2]) {
                conversationTitle = topicMatch[2].trim();
              } else {
                // Default to cleaned first user message
                const words = titleContent.split(/\s+/);
                conversationTitle = words.slice(0, Math.min(8, words.length)).join(' ');
              }
            }
          } else {
            // For non-content queries, use first 5-8 words
            const words = titleContent.split(/\s+/);
            conversationTitle = words.slice(0, Math.min(8, words.length)).join(' ');
          }
          
          // Trim and limit length
          conversationTitle = conversationTitle.trim();
          if (conversationTitle.length > 50) {
            conversationTitle = conversationTitle.substring(0, 50) + '...';
          }
        }
      } else {
        // Keep existing title
        conversationTitle = updatedConversation.title;
      }
      
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        title: conversationTitle,
      };
      
      // Update state with final conversation
      setConversation(finalConversation);
      setConversations(prev => 
        prev.map(c => c.id === conversation.id ? finalConversation : c)
      );
    } catch (error) {
      console.error('Failed to get assistant response:', error);
      
      // Update with error message
      const errorMessages = updatedMessages.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: "I'm sorry, I encountered an error while generating a response. Please try again.", isLoading: false } 
          : msg
      );
      
      const errorConversation = {
        ...updatedConversation,
        messages: errorMessages,
      };
      
      setConversation(errorConversation);
      setConversations(prev => 
        prev.map(c => c.id === conversation.id ? errorConversation : c)
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load a specific conversation
  const loadConversation = async (id: string) => {
    const convo = conversations.find(c => c.id === id);
    if (convo) {
      setConversation(convo);
    }
  };

  // Delete a conversation
  const deleteConversation = async (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    
    // If the current conversation is deleted, load another one or create new
    if (conversation?.id === id) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setConversation(remaining[0]);
      } else {
        newConversation();
      }
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Add navigateToSamples function
  const navigateToSamples = () => {
    console.log('Navigating to samples page');
    window.location.href = '/samples';
  };

  return (
    <ChatContext.Provider
      value={{
        conversation,
        conversations,
        isLoading,
        sendMessage,
        newConversation,
        loadConversation,
        deleteConversation,
        isSidebarOpen,
        toggleSidebar,
        setConversations,
        selectedStyle,
        setSelectedStyle,
        selectedPurpose,
        setSelectedPurpose,
        navigateToSamples,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
} 