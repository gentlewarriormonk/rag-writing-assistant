'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  wordCount: number;
}

interface CorpusStats {
  documentCount: number;
  wordCount: number;
  lastUpdated: string | null;
}

interface CorpusContextType {
  documents: Document[];
  corpusStats: CorpusStats;
  isCorpusReady: boolean;
  isFirstTimeUser: boolean;
  uploadDocuments: (files: File[]) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;
  clearCorpus: () => Promise<boolean>;
}

const defaultStats: CorpusStats = {
  documentCount: 0,
  wordCount: 0,
  lastUpdated: null
};

const CorpusContext = createContext<CorpusContextType>({
  documents: [],
  corpusStats: defaultStats,
  isCorpusReady: false,
  isFirstTimeUser: true,
  uploadDocuments: async () => false,
  deleteDocument: async () => false,
  clearCorpus: async () => false
});

export const useCorpus = () => useContext(CorpusContext);

export function CorpusProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [corpusStats, setCorpusStats] = useState<CorpusStats>(defaultStats);
  const [isCorpusReady, setIsCorpusReady] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);

  // Load corpus data on mount
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    const fetchCorpusData = async () => {
      try {
        // Check for first-time user
        const hasUsedBefore = localStorage.getItem('hasUploadedCorpus');
        setIsFirstTimeUser(!hasUsedBefore);
        
        // Load corpus data from API
        const response = await fetch('/api/corpus');
        if (!response.ok) throw new Error('Failed to fetch corpus');
        
        const data = await response.json();
        setDocuments(data.documents || []);
        
        // Calculate corpus stats
        const stats: CorpusStats = {
          documentCount: data.documents?.length || 0,
          wordCount: data.documents?.reduce((sum: number, doc: Document) => sum + doc.wordCount, 0) || 0,
          lastUpdated: data.documents?.length ? new Date().toISOString() : null
        };
        
        setCorpusStats(stats);
        setIsCorpusReady(stats.documentCount > 0);
      } catch (error) {
        console.error('Failed to load corpus:', error);
      }
    };

    fetchCorpusData();
  }, []);

  // Upload documents to corpus
  const uploadDocuments = async (files: File[]): Promise<boolean> => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('documents', file);
      });

      const response = await fetch('/api/corpus/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      
      // Update local state
      setDocuments(prev => [...prev, ...result.documents]);
      
      // Update stats
      setCorpusStats({
        documentCount: documents.length + result.documents.length,
        wordCount: corpusStats.wordCount + result.documents.reduce((sum: number, doc: Document) => sum + doc.wordCount, 0),
        lastUpdated: new Date().toISOString()
      });
      
      setIsCorpusReady(true);
      setIsFirstTimeUser(false);
      
      // Mark user as having uploaded corpus
      localStorage.setItem('hasUploadedCorpus', 'true');
      
      return true;
    } catch (error) {
      console.error('Failed to upload documents:', error);
      return false;
    }
  };

  // Delete document from corpus
  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/corpus/document/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');
      
      // Update local state
      const updatedDocs = documents.filter(doc => doc.id !== id);
      setDocuments(updatedDocs);
      
      // Update stats
      const deletedDoc = documents.find(doc => doc.id === id);
      setCorpusStats({
        documentCount: corpusStats.documentCount - 1,
        wordCount: corpusStats.wordCount - (deletedDoc?.wordCount || 0),
        lastUpdated: new Date().toISOString()
      });
      
      setIsCorpusReady(updatedDocs.length > 0);
      
      return true;
    } catch (error) {
      console.error('Failed to delete document:', error);
      return false;
    }
  };

  // Clear entire corpus
  const clearCorpus = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/corpus', {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Clearing corpus failed');
      
      // Reset local state
      setDocuments([]);
      setCorpusStats(defaultStats);
      setIsCorpusReady(false);
      
      return true;
    } catch (error) {
      console.error('Failed to clear corpus:', error);
      return false;
    }
  };

  return (
    <CorpusContext.Provider
      value={{
        documents,
        corpusStats,
        isCorpusReady,
        isFirstTimeUser,
        uploadDocuments,
        deleteDocument,
        clearCorpus
      }}
    >
      {children}
    </CorpusContext.Provider>
  );
} 