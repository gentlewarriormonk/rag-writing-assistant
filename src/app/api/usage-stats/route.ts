import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with actual database query
  const mockUsageStats = {
    wordsGenerated: 12450,
    totalWords: 15000,
    apiCredits: 189,
    totalCredits: 500,
    storageUsed: 0.45,
    totalStorage: 5,
  };

  return NextResponse.json(mockUsageStats);
} 