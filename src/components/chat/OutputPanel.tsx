'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface DocumentOutput {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface OutputPanelProps {
  documents: DocumentOutput[];
  isVisible: boolean;
  onClose?: () => void;
  selectedDocId?: string | null;
  onSelectDocument?: (docId: string | null) => void;
}

export default function OutputPanel({ 
  documents, 
  isVisible, 
  onClose,
  selectedDocId: externalSelectedDocId,
  onSelectDocument
}: OutputPanelProps) {
  const [internalSelectedDocId, setInternalSelectedDocId] = useState<string | null>(null);
  const [showDocumentList, setShowDocumentList] = useState(true);

  // Use external or internal selected doc ID
  const selectedDocId = externalSelectedDocId ?? internalSelectedDocId;
  const setSelectedDocId = (docId: string | null) => {
    if (onSelectDocument) {
      onSelectDocument(docId);
    } else {
      setInternalSelectedDocId(docId);
    }
  };

  // Auto-select the first document when panel becomes visible and there's only one document
  useEffect(() => {
    if (isVisible && documents.length > 0) {
      if (documents.length === 1 || !selectedDocId) {
        setSelectedDocId(documents[0].id);
        setShowDocumentList(documents.length > 1);
      }
    }
    
    // Reset selection when panel closes
    if (!isVisible) {
      setSelectedDocId(null);
      setShowDocumentList(true);
    }
  }, [isVisible, documents, selectedDocId]);

  // When a new document is added, select it automatically
  useEffect(() => {
    if (documents.length > 0) {
      const lastDoc = documents[documents.length - 1];
      if (lastDoc && (!selectedDocId || !documents.find(d => d.id === selectedDocId))) {
        setSelectedDocId(lastDoc.id);
        setShowDocumentList(documents.length > 1);
      }
    }
  }, [documents, selectedDocId]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
      alert('Content copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadDocument = (doc: DocumentOutput) => {
    const element = document.createElement('a');
    const file = new Blob([doc.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.title || 'document'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handler for closing the panel
  const handleClose = () => {
    if (onClose) onClose();
  };
  
  // Handler for going back to document list
  const handleBackToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDocId(null);
    setShowDocumentList(true);
  };

  const selectedDoc = documents.find(doc => doc.id === selectedDocId);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ 
        x: isVisible ? 0 : 400,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed right-0 top-0 bottom-0 w-80 bg-[#252525] border-l border-gray-800/50 z-20 flex flex-col shadow-xl"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <div className="border-b border-gray-800/50 p-3 flex justify-between items-center">
        <h2 className="font-medium text-sm text-gray-200">
          {showDocumentList ? "Documents" : selectedDoc?.title || "Document"}
        </h2>
        <div className="flex items-center space-x-2">
          {!showDocumentList && documents.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleBackToList}
              aria-label="Back to document list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          )}
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/30"
            aria-label="Close panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {showDocumentList ? (
        // Document cards view in a grid layout
        <div className="flex-1 p-3 overflow-y-auto">
          {documents.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm text-center">
                No documents available yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {documents.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setShowDocumentList(false);
                  }}
                  className="bg-[#2e2e2e] rounded-lg border border-gray-800 p-3 cursor-pointer hover:border-blue-500/50 transition-colors"
                >
                  <h3 className="font-medium text-sm mb-1">{doc.title || 'Untitled'}</h3>
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                  <div className="bg-[#252525] rounded p-2 mb-2 text-xs text-gray-300 max-h-20 overflow-hidden">
                    {doc.content.substring(0, 100)}
                    {doc.content.length > 100 ? '...' : ''}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDocId(doc.id);
                        setShowDocumentList(false);
                      }}
                    >
                      Open
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Selected document view
        <div className="flex-1 flex flex-col p-3 overflow-hidden">
          <div className="flex-1 overflow-auto mb-3 bg-[#2e2e2e] rounded border border-gray-800 p-4">
            <pre className="font-['Georgia',serif] text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
              {selectedDoc?.content}
            </pre>
          </div>
          
          <div className="flex space-x-2 mt-auto">
            <Button 
              variant="outline"
              className="flex-1 py-1"
              onClick={() => selectedDoc && copyToClipboard(selectedDoc.content)}
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy
            </Button>
            <Button 
              variant="outline"
              className="flex-1 py-1"
              onClick={() => selectedDoc && downloadDocument(selectedDoc)}
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
} 