/**
 * Document Processing Pipeline
 * This module handles the processing of uploaded documents for RAG
 */

import { createClient } from '@supabase/supabase-js';

// Document processing types
export interface ProcessedDocument {
  id: string;
  title: string;
  content: string;
  metadata: DocumentMetadata;
  styleMetrics: StyleMetrics;
  chunks?: DocumentChunk[];
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  index: number; 
  embedding?: number[];
}

export interface DocumentMetadata {
  fileName: string;
  fileType: string;
  uploadedAt: string;
  wordCount: number;
  characterCount: number;
}

export interface StyleMetrics {
  averageSentenceLength: number;
  averageParagraphLength: number;
  vocabularyDiversity: number;
  formalityScore: number;
  complexWords: string[];
  transitionPhrases: string[];
}

/**
 * Process a raw text document
 * @param content The raw text content of the document
 * @param fileName The original filename
 * @param fileType The file type (mime type)
 * @returns A processed document with extracted metadata and style metrics
 */
export async function processTextDocument(
  content: string,
  fileName: string,
  fileType: string
): Promise<ProcessedDocument> {
  // Generate a unique ID
  const id = Math.random().toString(36).substring(2, 15);
  
  // Extract metadata
  const metadata: DocumentMetadata = {
    fileName,
    fileType,
    uploadedAt: new Date().toISOString(),
    wordCount: countWords(content),
    characterCount: content.length,
  };
  
  // Extract style metrics
  const styleMetrics = await analyzeWritingStyle(content);
  
  // Generate a title if none exists
  const title = fileName.replace(/\.[^/.]+$/, ""); // Remove file extension
  
  // Create document chunks for RAG
  const chunks = chunkDocument(content, id);
  
  return {
    id,
    title,
    content,
    metadata,
    styleMetrics,
    chunks,
  };
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

/**
 * Analyze writing style to extract key metrics
 */
async function analyzeWritingStyle(text: string): Promise<StyleMetrics> {
  // Tokenize text
  const sentences = tokenizeSentences(text);
  const paragraphs = tokenizeParagraphs(text);
  const words = tokenizeWords(text);
  
  // Calculate metrics
  const averageSentenceLength = sentences.length > 0 
    ? words.length / sentences.length 
    : 0;
  
  const averageParagraphLength = paragraphs.length > 0 
    ? words.length / paragraphs.length 
    : 0;
  
  // Calculate vocabulary diversity (unique words / total words)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const vocabularyDiversity = words.length > 0 
    ? uniqueWords.size / words.length 
    : 0;
  
  // Extract complex words (3+ syllables)
  const complexWords = findComplexWords(words);
  
  // Find transition phrases
  const transitionPhrases = findTransitionPhrases(text);
  
  // Calculate formality score (basic implementation)
  // Higher score = more formal
  const formalityScore = calculateFormality(text, words, complexWords);
  
  return {
    averageSentenceLength,
    averageParagraphLength,
    vocabularyDiversity,
    formalityScore,
    complexWords: complexWords.slice(0, 20), // Limit to top 20
    transitionPhrases: transitionPhrases.slice(0, 20), // Limit to top 20
  };
}

/**
 * Split text into sentences
 */
function tokenizeSentences(text: string): string[] {
  // Simple sentence tokenization
  return text
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .filter(s => s.trim().length > 0);
}

/**
 * Split text into paragraphs
 */
function tokenizeParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 0);
}

/**
 * Split text into words
 */
function tokenizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 0);
}

/**
 * Find complex words in text (3+ syllables is a simple heuristic)
 */
function findComplexWords(words: string[]): string[] {
  // Simple syllable counter
  const countSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    // Count vowel groups as syllables
    return word
      .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
      .replace(/^y/, '')
      .match(/[aeiouy]{1,2}/g)?.length || 1;
  };
  
  // Filter for words with 3+ syllables
  return Array.from(new Set(
    words
      .filter(word => word.length > 4 && countSyllables(word) >= 3)
  ));
}

/**
 * Find transition phrases in text
 */
function findTransitionPhrases(text: string): string[] {
  const commonTransitions = [
    "however", "therefore", "consequently", "furthermore", "moreover",
    "in addition", "nevertheless", "on the other hand", "in contrast",
    "similarly", "in conclusion", "to summarize", "for example",
    "in other words", "as a result", "in fact", "indeed", "instead",
    "meanwhile", "subsequently", "specifically", "that is"
  ];
  
  const foundTransitions: string[] = [];
  
  // Look for transitions in the text
  commonTransitions.forEach(transition => {
    const regex = new RegExp(`\\b${transition}\\b`, 'gi');
    if (regex.test(text)) {
      foundTransitions.push(transition);
    }
  });
  
  return foundTransitions;
}

/**
 * Calculate a formality score for the text
 */
function calculateFormality(text: string, words: string[], complexWords: string[]): number {
  // Basic formality heuristics:
  // 1. Percentage of complex words
  // 2. Average word length
  // 3. Presence of first-person pronouns (less formal)
  // 4. Presence of contractions (less formal)
  
  // 1. Percentage of complex words (0-1)
  const complexWordRatio = words.length > 0 ? complexWords.length / words.length : 0;
  
  // 2. Average word length (normalized to 0-1 scale)
  const avgWordLength = words.length > 0 
    ? words.reduce((sum, word) => sum + word.length, 0) / words.length 
    : 0;
  const normalizedWordLength = Math.min(avgWordLength / 10, 1); // Normalize with max of 10 chars
  
  // 3. First-person pronouns (less formal - inverted scale)
  const firstPersonPronouns = ["i", "me", "my", "mine", "we", "us", "our", "ours"];
  const firstPersonCount = words.filter(w => firstPersonPronouns.includes(w.toLowerCase())).length;
  const firstPersonRatio = words.length > 0 ? firstPersonCount / words.length : 0;
  const firstPersonScore = 1 - firstPersonRatio * 10; // Invert and scale
  
  // 4. Contractions (less formal - inverted scale)
  const contractionCount = (text.match(/\b\w+['']\w+\b/g) || []).length;
  const contractionRatio = words.length > 0 ? contractionCount / words.length : 0;
  const contractionScore = 1 - contractionRatio * 10; // Invert and scale
  
  // Weighted average of all factors (0-10 scale)
  const formalityScore = (
    (complexWordRatio * 3) + 
    (normalizedWordLength * 2) + 
    (firstPersonScore * 2.5) + 
    (contractionScore * 2.5)
  ) * 10 / 10;
  
  return Math.min(Math.max(formalityScore, 0), 10); // Clamp to 0-10
}

/**
 * Extract text from a file
 * @param file The file to extract text from
 * @returns The extracted text
 */
export async function extractTextFromFile(file: File): Promise<string> {
  // For now, just read text files directly
  // In a production app, you'd handle different file types (PDF, DOCX, etc.)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = (e) => {
      reject(new Error('Error reading file'));
    };
    reader.readAsText(file);
  });
}

/**
 * Store a processed document
 * In a production app, this would save to a database
 * Here we'll use localStorage for the demo
 */
export async function storeProcessedDocument(document: ProcessedDocument): Promise<boolean> {
  try {
    // Generate embeddings for chunks if they exist
    if (document.chunks && document.chunks.length > 0) {
      document.chunks = await generateEmbeddings(document.chunks);
    }
    
    // Check if running in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.warn('localStorage not available - document not stored');
      return false;
    }
    
    // Get existing documents
    const existingDocsJson = localStorage.getItem('processedDocuments');
    const existingDocs = existingDocsJson ? JSON.parse(existingDocsJson) : [];
    
    // Add new document
    const updatedDocs = [document, ...existingDocs];
    
    // Store back to localStorage
    localStorage.setItem('processedDocuments', JSON.stringify(updatedDocs));
    
    return true;
  } catch (error) {
    console.error('Error storing document:', error);
    return false;
  }
}

/**
 * Retrieve all processed documents
 */
export function getProcessedDocuments(): ProcessedDocument[] {
  try {
    // Check if running in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.warn('localStorage not available - cannot get documents');
      return [];
    }
    
    const docsJson = localStorage.getItem('processedDocuments');
    return docsJson ? JSON.parse(docsJson) : [];
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
}

/**
 * Get corpus statistics
 */
export function getCorpusStats() {
  const docs = getProcessedDocuments();
  
  return {
    documentCount: docs.length,
    wordCount: docs.reduce((sum, doc) => sum + doc.metadata.wordCount, 0),
    characterCount: docs.reduce((sum, doc) => sum + doc.metadata.characterCount, 0),
    averageFormality: docs.length > 0 
      ? docs.reduce((sum, doc) => sum + doc.styleMetrics.formalityScore, 0) / docs.length
      : 0,
    lastUpdated: docs.length > 0
      ? docs.reduce((latest, doc) => {
          return doc.metadata.uploadedAt > latest ? doc.metadata.uploadedAt : latest;
        }, docs[0].metadata.uploadedAt)
      : null,
  };
}

/**
 * Split a document into chunks suitable for RAG
 * @param content Document content
 * @param documentId Parent document ID
 * @param chunkSize Target size of chunks
 * @param overlap Overlap between chunks
 * @returns Array of document chunks
 */
function chunkDocument(
  content: string, 
  documentId: string,
  chunkSize: number = 1000,
  overlap: number = 200
): DocumentChunk[] {
  // Split content into paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  const chunks: DocumentChunk[] = [];
  let currentChunk = '';
  let chunkIndex = 0;
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim();
    
    // If adding this paragraph would exceed the chunk size, create a new chunk
    if (currentChunk.length > 0 && currentChunk.length + paragraph.length > chunkSize) {
      // Save current chunk
      chunks.push({
        id: `${documentId}-chunk-${chunkIndex}`,
        documentId,
        content: currentChunk,
        index: chunkIndex,
      });
      
      // For overlap, add some of the end of the previous chunk to the new chunk
      const words = currentChunk.split(' ');
      if (words.length > overlap) {
        currentChunk = words.slice(-overlap).join(' ') + ' ';
      } else {
        currentChunk = '';
      }
      
      chunkIndex++;
    }
    
    currentChunk += (currentChunk ? ' ' : '') + paragraph;
  }
  
  // Add the final chunk if not empty
  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: `${documentId}-chunk-${chunkIndex}`,
      documentId,
      content: currentChunk,
      index: chunkIndex,
    });
  }
  
  return chunks;
}

/**
 * Generate embeddings for document chunks
 * This is a placeholder for the actual embedding generation
 * In a production app, you'd use an embedding model or API
 */
export async function generateEmbeddings(chunks: DocumentChunk[]): Promise<DocumentChunk[]> {
  // In a real application, you'd call an embedding API like OpenAI's
  // For now, we'll simulate it with a placeholder
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log('No API key for embeddings, using mock embeddings');
    return chunks.map(chunk => ({
      ...chunk,
      // Mock embedding with random values (in reality would be a vector from the API)
      embedding: Array.from({ length: 1536 }, () => Math.random() * 2 - 1),
    }));
  }
  
  // In a real implementation, you would:
  // 1. Call the embedding API for each chunk
  // 2. Store the embeddings with the chunks
  // 3. Use these for semantic search later
  
  try {
    // This is where you'd actually call the API
    // For now we'll just use the mock implementation
    return chunks.map(chunk => ({
      ...chunk,
      embedding: Array.from({ length: 1536 }, () => Math.random() * 2 - 1),
    }));
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return chunks;
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Search for relevant document chunks based on a query
 * @param query The search query
 * @param topK Number of results to return
 * @returns Relevant document chunks with similarity scores
 */
export async function semanticSearch(query: string, topK: number = 5): Promise<Array<{chunk: DocumentChunk, similarity: number}>> {
  // Get all documents
  const docs = getProcessedDocuments();
  
  // Collect all chunks with embeddings
  const allChunks: DocumentChunk[] = [];
  docs.forEach(doc => {
    if (doc.chunks) {
      allChunks.push(...doc.chunks);
    }
  });
  
  // If no chunks have embeddings, return empty results
  if (allChunks.length === 0 || !allChunks[0].embedding) {
    return [];
  }
  
  // Generate embedding for the query
  // In a real implementation, this would call an embedding API
  const queryEmbedding = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
  
  // Calculate similarities
  const similarities = allChunks
    .filter(chunk => chunk.embedding) // Only use chunks with embeddings
    .map(chunk => ({
      chunk,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding!)
    }))
    .sort((a, b) => b.similarity - a.similarity) // Sort by similarity (descending)
    .slice(0, topK); // Take top K results
  
  return similarities;
}

/**
 * Get the most relevant context for a query from the user's documents
 * @param query The user's query
 * @param maxTokens Maximum number of tokens to include in the context
 * @returns Formatted context string with the most relevant document chunks
 */
export async function getRelevantContext(query: string, maxTokens: number = 6000): Promise<string> {
  // Get relevant chunks
  const relevantChunks = await semanticSearch(query, 10);
  
  if (relevantChunks.length === 0) {
    return "No relevant documents found.";
  }
  
  // Get all documents to lookup titles
  const docs = getProcessedDocuments();
  const docMap = new Map<string, ProcessedDocument>();
  docs.forEach(doc => docMap.set(doc.id, doc));
  
  // Format relevant chunks with document titles
  let context = "Relevant information from your documents:\n\n";
  let totalTokens = 0;
  const tokensPerChar = 0.25; // Rough estimate, 4 chars ≈ 1 token
  
  for (const { chunk, similarity } of relevantChunks) {
    const doc = docMap.get(chunk.documentId);
    if (!doc) continue;
    
    const docTitle = doc.title;
    const chunkText = chunk.content;
    const estimatedTokens = Math.ceil(chunkText.length * tokensPerChar);
    
    if (totalTokens + estimatedTokens > maxTokens) {
      break;
    }
    
    context += `### From "${docTitle}" (similarity: ${similarity.toFixed(2)})\n${chunkText}\n\n`;
    totalTokens += estimatedTokens;
  }
  
  return context;
}

/**
 * Extract user style data from processed documents
 */
export function extractUserStyleData() {
  // Get all processed documents
  const docs = getProcessedDocuments();
  
  // Add logging to see what documents were found
  console.log(`extractUserStyleData found ${docs.length} documents`);
  
  if (docs.length === 0) {
    console.log('No documents found in extractUserStyleData');
    return {
      hasDocuments: false,
      averageSentenceLength: 0,
      averageParagraphLength: 0,
      formalityScore: 5,
      vocabularyDiversity: 0,
      commonComplexWords: [],
      commonTransitions: [],
      sampleText: ""
    };
  }
  
  // If we have documents, log some basic info about them
  console.log('Documents found:', docs.map(doc => ({
    id: doc.id,
    title: doc.title,
    contentLength: doc.content.length,
    createdAt: doc.metadata.uploadedAt,
  })));
  
  // Calculate average metrics
  const aggregateMetrics = docs.reduce((agg, doc) => {
    return {
      sentenceLength: agg.sentenceLength + doc.styleMetrics.averageSentenceLength,
      paragraphLength: agg.paragraphLength + doc.styleMetrics.averageParagraphLength,
      formalityScore: agg.formalityScore + doc.styleMetrics.formalityScore,
      vocabularyDiversity: agg.vocabularyDiversity + doc.styleMetrics.vocabularyDiversity,
      complexWordCounts: doc.styleMetrics.complexWords.reduce((counts, word) => {
        counts[word] = (counts[word] || 0) + 1;
        return counts;
      }, agg.complexWordCounts),
      transitionCounts: doc.styleMetrics.transitionPhrases.reduce((counts, phrase) => {
        counts[phrase] = (counts[phrase] || 0) + 1;
        return counts;
      }, agg.transitionCounts)
    };
  }, {
    sentenceLength: 0,
    paragraphLength: 0,
    formalityScore: 0,
    vocabularyDiversity: 0,
    complexWordCounts: {} as Record<string, number>,
    transitionCounts: {} as Record<string, number>
  });
  
  // Get the most common complex words
  const commonComplexWords = Object.entries(aggregateMetrics.complexWordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
  
  // Get the most common transition phrases
  const commonTransitions = Object.entries(aggregateMetrics.transitionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
  
  // Get a sample of text from one of the documents
  const sampleText = docs[0].content.slice(0, 500);
  
  return {
    hasDocuments: true,
    averageSentenceLength: aggregateMetrics.sentenceLength / docs.length,
    averageParagraphLength: aggregateMetrics.paragraphLength / docs.length,
    formalityScore: aggregateMetrics.formalityScore / docs.length,
    vocabularyDiversity: aggregateMetrics.vocabularyDiversity / docs.length,
    commonComplexWords,
    commonTransitions,
    sampleText
  };
} 