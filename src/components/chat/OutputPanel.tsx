'use client';

import React, { useState, useEffect } from 'react';
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

type DownloadFormat = 'txt' | 'pdf' | 'docx';

export default function OutputPanel({ 
  documents, 
  isVisible, 
  onClose,
  selectedDocId: externalSelectedDocId,
  onSelectDocument
}: OutputPanelProps) {
  const [internalSelectedDocId, setInternalSelectedDocId] = useState<string | null>(null);
  const [showDocumentList, setShowDocumentList] = useState(true);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('docx');

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
    const filename = doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document';
    
    switch (downloadFormat) {
      case 'pdf':
        try {
          // Add jsPDF dynamic import for PDF generation
          import('jspdf').then(({ default: jsPDF }) => {
            // Create new PDF
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4'
            });
            
            // Configure PDF
            pdf.setFont('helvetica');
            
            // Add title with proper positioning
            pdf.setFontSize(16);
            pdf.text(doc.title, 20, 20);
            
            // Format and add content with proper line breaks
            pdf.setFontSize(11);
            const contentLines = pdf.splitTextToSize(doc.content, 170);
            
            // Check if content fits on one page, add multiple pages if needed
            const linesPerPage = 60;
            let currentPage = 0;
            
            for (let i = 0; i < contentLines.length; i++) {
              if (i > 0 && i % linesPerPage === 0) {
                pdf.addPage();
                currentPage++;
              }
              
              const yPos = 30 + (i % linesPerPage) * 5;
              pdf.text(contentLines[i], 20, yPos);
            }
            
            // Direct download
            pdf.save(`${filename}.pdf`);
          }).catch(err => {
            console.error('PDF generation error:', err);
            alert('Error generating PDF. Trying alternative method...');
            
            // Fallback to basic text download if PDF generation fails
            const textBlob = new Blob([doc.content], { type: 'text/plain' });
            const textUrl = URL.createObjectURL(textBlob);
            const textLink = document.createElement('a');
            textLink.href = textUrl;
            textLink.download = `${filename}.txt`;
            textLink.click();
            URL.revokeObjectURL(textUrl);
          });
        } catch (error) {
          console.error('PDF generation failed:', error);
          alert('Could not generate PDF. Downloading as text instead.');
          
          // Fallback to text if all else fails
          const blob = new Blob([doc.content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.txt`;
          link.click();
          URL.revokeObjectURL(url);
        }
        break;

      case 'docx':
        try {
          // Use docx library for proper Word document creation
          import('docx').then(({ Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType }) => {
            // Create proper Word document structure
            const paragraphs = [];
            
            // Add title as heading
            paragraphs.push(
              new Paragraph({
                text: doc.title,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: {
                  after: 200
                }
              })
            );
            
            // Process content paragraphs with proper spacing and formatting
            const contentParagraphs = doc.content.split(/\n\n+/);
            contentParagraphs.forEach(para => {
              if (para.trim()) {
                paragraphs.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: para.trim(),
                        size: 24 // 12pt font
                      })
                    ],
                    spacing: {
                      after: 200
                    }
                  })
                );
              }
            });
            
            const docxDoc = new Document({
              sections: [{
                properties: {},
                children: paragraphs
              }]
            });
            
            // Generate and download
            Packer.toBlob(docxDoc).then((blob: Blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${filename}.docx`;
              link.click();
              URL.revokeObjectURL(url);
            }).catch(err => {
              console.error('DOCX generation error:', err);
              alert('Error generating DOCX. Downloading as text instead.');
              
              // Fallback to text download if DOCX generation fails
              const textBlob = new Blob([doc.content], { type: 'text/plain' });
              const textUrl = URL.createObjectURL(textBlob);
              const textLink = document.createElement('a');
              textLink.href = textUrl;
              textLink.download = `${filename}.txt`;
              textLink.click();
              URL.revokeObjectURL(textUrl);
            });
          });
        } catch (error) {
          console.error('DOCX generation failed:', error);
          alert('Could not generate DOCX. Downloading as text instead.');
          
          // Fallback to text if all else fails
          const blob = new Blob([doc.content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.txt`;
          link.click();
          URL.revokeObjectURL(url);
        }
        break;

      case 'txt':
      default:
        // Plain text download
        const textBlob = new Blob([doc.content], { type: 'text/plain' });
        const textUrl = URL.createObjectURL(textBlob);
        const textLink = document.createElement('a');
        textLink.href = textUrl;
        textLink.download = `${filename}.txt`;
        textLink.click();
        URL.revokeObjectURL(textUrl);
    }
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

  // Format date with time
  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div
      className={`fixed right-0 top-0 bottom-0 w-80 bg-[#252525] border-l border-gray-800/50 z-20 flex flex-col shadow-xl transform transition-transform duration-200 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <div className="border-b border-gray-800/50 p-3 flex justify-between items-center">
        <h2 className="font-medium text-sm text-gray-200">
          {showDocumentList ? "Documents" : selectedDoc?.title || "Document"}
        </h2>
        <div className="flex items-center space-x-2">
          {!showDocumentList && (
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
                    {formatDateTime(doc.createdAt)}
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
          
          <div className="flex flex-col space-y-2 mt-auto">
            <div className="mb-1 text-xs text-gray-400">
              Created: {selectedDoc ? formatDateTime(selectedDoc.createdAt) : ''}
            </div>
            <div className="flex space-x-2">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as DownloadFormat)}
                className="bg-[#333] text-white border border-gray-700 rounded px-2 py-1 text-sm flex-1"
              >
                <option value="docx">Word (.docx)</option>
                <option value="pdf">PDF (Print)</option>
                <option value="txt">Text (.txt)</option>
              </select>
              <Button 
                variant="outline"
                className="py-1"
                onClick={() => selectedDoc && downloadDocument(selectedDoc)}
              >
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </Button>
            </div>
            <Button 
              variant="outline"
              className="py-1"
              onClick={() => selectedDoc && copyToClipboard(selectedDoc.content)}
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy to Clipboard
            </Button>
            <Button 
              variant="ghost"
              className="py-1 mt-2"
              onClick={handleBackToList}
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to document list
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 