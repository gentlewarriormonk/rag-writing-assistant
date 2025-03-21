'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
  multiple?: boolean;
}

export function FileUpload({
  onUpload,
  acceptedFileTypes = '.txt,.md,.pdf,.docx',
  maxSizeInMB = 10,
  multiple = true
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    await processFiles(Array.from(files));
    
    // Reset the input value so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateFiles = (files: File[]): { valid: boolean; message?: string } => {
    // Check file types
    for (const file of files) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const fileTypeIsValid = acceptedFileTypes
        .split(',')
        .some(type => type.includes(fileExtension || ''));
      
      if (!fileTypeIsValid) {
        return { 
          valid: false, 
          message: `File type not allowed: ${file.name}. Accepted types: ${acceptedFileTypes}` 
        };
      }
      
      // Check file size
      if (file.size > maxSizeInBytes) {
        return { 
          valid: false, 
          message: `File too large: ${file.name}. Maximum size is ${maxSizeInMB}MB` 
        };
      }
    }
    
    return { valid: true };
  };

  const processFiles = async (files: File[]) => {
    setError(null);
    
    const validation = validateFiles(files);
    if (!validation.valid) {
      setError(validation.message || 'Invalid files');
      return;
    }
    
    setIsUploading(true);
    try {
      await onUpload(files);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error uploading files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (!event.dataTransfer.files || event.dataTransfer.files.length === 0) return;
    
    const droppedFiles = Array.from(event.dataTransfer.files);
    await processFiles(droppedFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={`border-2 border-dashed ${isDragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-700'} transition-colors`}>
      <CardContent className="p-6">
        <div
          className="flex flex-col items-center justify-center py-8 px-4 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mb-4 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          
          <h3 className="text-lg font-medium mb-2">Upload your writing samples</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Supported formats: {acceptedFileTypes} (Max: {maxSizeInMB}MB)
          </p>
          
          {isUploading && (
            <div className="mt-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">Uploading files...</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={acceptedFileTypes}
            multiple={multiple}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
} 