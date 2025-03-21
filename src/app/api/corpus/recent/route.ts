import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with actual database query
  const mockRecentDocs = [
    {
      id: '1',
      title: 'Marketing Email',
      timeAgo: '2 hours ago',
    },
    {
      id: '2',
      title: 'Q1 Report Draft',
      timeAgo: 'Yesterday',
    },
    {
      id: '3',
      title: 'Team Announcement',
      timeAgo: 'Yesterday',
    },
  ];

  return NextResponse.json(mockRecentDocs);
} 