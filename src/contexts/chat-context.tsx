'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCorpus } from './corpus-context';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatContextType {
  conversation: Conversation | null;
  conversations: Conversation[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  newConversation: () => void;
  loadConversation: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const ChatContext = createContext<ChatContextType>({
  conversation: null,
  conversations: [],
  isLoading: false,
  sendMessage: async () => {},
  newConversation: () => {},
  loadConversation: async () => {},
  deleteConversation: async () => {},
  isSidebarOpen: false,
  toggleSidebar: () => {},
});

export const useChat = () => useContext(ChatContext);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isCorpusReady } = useCorpus();

  // Create a new empty conversation
  const newConversation = () => {
    const newConvo: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setConversation(newConvo);
    setConversations(prev => [newConvo, ...prev]);
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
          setConversations(parsed);
          
          // Load most recent conversation if available
          if (parsed.length > 0) {
            setConversation(parsed[0]);
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
    
    // Update conversation with user message and loading placeholder
    const updatedMessages = [...conversation.messages, userMessage, assistantMessage];
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
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
      
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        title: updatedConversation.messages.length <= 2 ? data.title || 'New Conversation' : updatedConversation.title,
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
} 