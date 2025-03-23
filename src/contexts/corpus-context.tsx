'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProcessedDocument,
  DocumentMetadata,
  StyleMetrics,
  processTextDocument,
  extractTextFromFile,
  storeProcessedDocument,
  getProcessedDocuments,
  getCorpusStats as getStats
} from '@/lib/documentProcessor';

// Simplified Document interface for compatibility
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
  processedDocuments: ProcessedDocument[];
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
  processedDocuments: [],
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
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>([]);
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
        
        // Load processed documents from local storage
        const processedDocs = getProcessedDocuments();
        setProcessedDocuments(processedDocs);
        
        // Convert to simpler document format for compatibility
        const simpleDocs: Document[] = processedDocs.map(doc => ({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          createdAt: doc.metadata.uploadedAt,
          wordCount: doc.metadata.wordCount
        }));
        
        setDocuments(simpleDocs);
        
        // Get corpus stats
        const stats = getStats();
        setCorpusStats({
          documentCount: stats.documentCount,
          wordCount: stats.wordCount,
          lastUpdated: stats.lastUpdated
        });
        
        setIsCorpusReady(simpleDocs.length > 0);
        
        // Debug log for corpus state
        console.log('Corpus initialization completed:', {
          documentsCount: simpleDocs.length,
          isCorpusReady: simpleDocs.length > 0,
          stats
        });
      } catch (error) {
        console.error('Failed to load corpus:', error);
      }
    };

    fetchCorpusData();
  }, []);

  // Upload documents to corpus
  const uploadDocuments = async (files: File[]): Promise<boolean> => {
    try {
      // Process each file
      const processedDocs: ProcessedDocument[] = [];
      
      for (const file of files) {
        try {
          // Extract text from file
          const text = await extractTextFromFile(file);
          
          // Process the document
          const processedDoc = await processTextDocument(
            text,
            file.name,
            file.type
          );
          
          // Store the processed document (now an async function)
          const storeSuccess = await storeProcessedDocument(processedDoc);
          
          if (storeSuccess) {
            processedDocs.push(processedDoc);
          } else {
            console.error(`Failed to store document: ${file.name}`);
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
        }
      }
      
      if (processedDocs.length === 0) {
        return false;
      }
      
      // Update processed documents state
      setProcessedDocuments(prev => [...processedDocs, ...prev]);
      
      // Convert to simpler document format for compatibility
      const newDocs: Document[] = processedDocs.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        createdAt: doc.metadata.uploadedAt,
        wordCount: doc.metadata.wordCount
      }));
      
      // Update documents state
      setDocuments(prev => [...newDocs, ...prev]);
      
      // Get updated corpus stats
      const stats = getStats();
      setCorpusStats({
        documentCount: stats.documentCount,
        wordCount: stats.wordCount,
        lastUpdated: stats.lastUpdated
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
      // Remove from local state
      const updatedProcessedDocs = processedDocuments.filter(doc => doc.id !== id);
      setProcessedDocuments(updatedProcessedDocs);
      
      const updatedDocs = documents.filter(doc => doc.id !== id);
      setDocuments(updatedDocs);
      
      // Update localStorage
      localStorage.setItem('processedDocuments', JSON.stringify(updatedProcessedDocs));
      
      // Get updated corpus stats
      const stats = getStats();
      setCorpusStats({
        documentCount: stats.documentCount,
        wordCount: stats.wordCount,
        lastUpdated: stats.lastUpdated
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
      // Clear localStorage
      localStorage.removeItem('processedDocuments');
      
      // Reset local state
      setProcessedDocuments([]);
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
        processedDocuments,
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