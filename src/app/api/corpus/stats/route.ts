import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with actual database query
  const mockStats = {
    documentCount: 35,
    categoryCount: 4,
  };

  return NextResponse.json(mockStats);
} 