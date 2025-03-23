'use client';

import React, { useState, useRef } from 'react';
import { useCorpus } from '@/contexts/corpus-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Helper function to format word counts
const formatWordCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k words`;
  }
  return `${count} words`;
};

export default function SampleManager() {
  const { documents, corpusStats, uploadDocuments, deleteDocument } = useCorpus();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handler for file selection via traditional file input
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    await handleUpload(Array.from(files));
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handler for drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    
    await handleUpload(files);
  };

  // Shared upload function
  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    
    try {
      // Filter for text and document files
      const validFiles = files.filter(file => 
        file.type.includes('text') || 
        file.name.endsWith('.doc') || 
        file.name.endsWith('.docx') || 
        file.name.endsWith('.pdf') ||
        file.name.endsWith('.rtf') ||
        file.name.endsWith('.txt')
      );
      
      if (validFiles.length === 0) {
        setUploadError('Please upload text, doc, docx, pdf, or rtf files.');
        setIsUploading(false);
        return;
      }
      
      const result = await uploadDocuments(validFiles);
      if (result) {
        setUploadSuccess(true);
        setSuccessMessage(`Successfully uploaded ${validFiles.length} ${validFiles.length === 1 ? 'sample' : 'samples'}! Kaku can now write in your style.`);
      } else {
        setUploadError('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handler for deleting a document
  const handleDeleteClick = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteDocument(id);
    setShowDeleteConfirm(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  // Handler for triggering file input click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handler for going to chat
  const handleTalkToKaku = () => {
    router.push('/dashboard');
  };

  return (
    <div className="bg-[#252525] rounded-lg border border-gray-800 p-6">
      <div className="flex items-start mb-8">
        <div className="flex-shrink-0 mr-4">
          <img 
            src="/kaku/kaku-avatar.png" 
            alt="Kaku" 
            className="w-20 h-20"
          />
        </div>
        <div className="bg-[#2e2e2e] rounded-lg p-4 border border-gray-700 relative">
          <div className="absolute left-[-12px] top-6 w-0 h-0 border-t-[12px] border-t-transparent border-r-[12px] border-r-[#2e2e2e] border-b-[12px] border-b-transparent"></div>
          <h2 className="text-xl font-medium text-white mb-2">Upload Your Writing Samples</h2>
          <p className="text-gray-300 mb-2">
            The more samples you provide, the better I can match your unique writing style. I'll analyze your vocabulary, sentence structure, and tone to create content that sounds authentically like you wrote it!
          </p>
          <p className="text-sm text-gray-400">
            Your samples are stored securely and used only to improve your writing experience.
          </p>
        </div>
      </div>
      
      {/* Success message */}
      {uploadSuccess && (
        <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-3 sm:mb-0">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-gray-200">{successMessage}</p>
          </div>
          <Button 
            onClick={handleTalkToKaku}
            className="bg-blue-600 hover:bg-blue-500"
          >
            Talk to Kaku
          </Button>
        </div>
      )}
      
      <h2 className="text-xl font-medium text-white mb-6">Your Writing Samples</h2>
      
      {/* Corpus Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#2e2e2e] rounded-lg p-4">
          <p className="text-sm text-gray-400">Total Samples</p>
          <p className="text-2xl font-semibold text-white">{corpusStats.documentCount}</p>
        </div>
        <div className="bg-[#2e2e2e] rounded-lg p-4">
          <p className="text-sm text-gray-400">Total Words</p>
          <p className="text-2xl font-semibold text-white">{formatWordCount(corpusStats.wordCount)}</p>
        </div>
        <div className="bg-[#2e2e2e] rounded-lg p-4">
          <p className="text-sm text-gray-400">Last Updated</p>
          <p className="text-lg font-semibold text-white">
            {corpusStats.lastUpdated ? formatDate(corpusStats.lastUpdated) : 'Never'}
          </p>
        </div>
      </div>
      
      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center ${
          isDragging 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".txt,.doc,.docx,.pdf,.rtf,text/*"
        />
        
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          <p className="text-lg text-gray-300 mb-2">
            {isDragging ? 'Drop files here' : 'Drag and drop your writing samples'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supported files: .txt, .doc, .docx, .pdf, .rtf
          </p>
          
          <Button
            onClick={handleBrowseClick}
            className="bg-blue-600 hover:bg-blue-500"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Browse Files'}
          </Button>
          
          {uploadError && (
            <p className="mt-4 text-sm text-red-400">{uploadError}</p>
          )}
        </div>
      </div>
      
      {/* Document List */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Uploaded Samples</h3>
        
        {documents.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No samples uploaded yet. Upload your writing to get started.</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-[#2e2e2e] border border-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-medium">{doc.title}</h4>
                    <div className="flex text-xs text-gray-400 mt-1 space-x-4">
                      <span>{formatDate(doc.createdAt)}</span>
                      <span>{formatWordCount(doc.wordCount)}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                      {doc.content.substring(0, 150)}...
                    </p>
                  </div>
                  
                  {showDeleteConfirm === doc.id ? (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteConfirm(doc.id)}
                        className="bg-red-600 hover:bg-red-500 text-xs"
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteCancel}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(doc.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 