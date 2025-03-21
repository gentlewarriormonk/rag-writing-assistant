import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyJWT } from '@/lib/jwt';

// Path to the env file
const envFilePath = path.resolve(process.cwd(), '.env.local');

// Helper function to read the API key from .env.local
function readApiKey(): string | null {
  try {
    if (fs.existsSync(envFilePath)) {
      const envContent = fs.readFileSync(envFilePath, 'utf-8');
      const matches = envContent.match(/ANTHROPIC_API_KEY=(.+?)(\r?\n|$)/);
      if (matches && matches[1] && matches[1] !== 'your_api_key_here') {
        return matches[1];
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading API key:', error);
    return null;
  }
}

// Helper function to update the API key in .env.local
function updateApiKey(apiKey: string): boolean {
  try {
    let envContent = '';
    
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, 'utf-8');
      
      // Check if ANTHROPIC_API_KEY already exists
      if (envContent.includes('ANTHROPIC_API_KEY=')) {
        // Replace existing API key
        envContent = envContent.replace(
          /ANTHROPIC_API_KEY=(.+?)(\r?\n|$)/,
          `ANTHROPIC_API_KEY=${apiKey}$2`
        );
      } else {
        // Add API key to the file
        envContent += `\nANTHROPIC_API_KEY=${apiKey}`;
      }
    } else {
      // Create new .env.local file
      envContent = `ANTHROPIC_API_KEY=${apiKey}`;
    }
    
    fs.writeFileSync(envFilePath, envContent);
    return true;
  } catch (error) {
    console.error('Error updating API key:', error);
    return false;
  }
}

// Helper function to delete the API key from .env.local
function deleteApiKey(): boolean {
  try {
    if (fs.existsSync(envFilePath)) {
      let envContent = fs.readFileSync(envFilePath, 'utf-8');
      
      // Remove the API key line
      envContent = envContent.replace(/ANTHROPIC_API_KEY=.+?(\r?\n|$)/, '$1');
      
      // Clean up any empty lines
      envContent = envContent.replace(/^\s*[\r\n]/gm, '');
      
      fs.writeFileSync(envFilePath, envContent);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting API key:', error);
    return false;
  }
}

// GET: Check if API key is set or retrieve it if reveal=true
export async function GET(request: NextRequest) {
  // Verify authentication
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try {
    await verifyJWT(token);
    
    const url = new URL(request.url);
    const revealKey = url.searchParams.get('reveal') === 'true';
    
    const apiKey = readApiKey();
    const isSet = !!apiKey;
    
    if (revealKey && isSet) {
      // Only return the actual API key if reveal=true
      return NextResponse.json({ isSet, apiKey });
    } else {
      // Otherwise just return if it's set or not
      return NextResponse.json({ isSet });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

// POST: Save new API key
export async function POST(request: NextRequest) {
  // Verify authentication
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try {
    await verifyJWT(token);
    
    const body = await request.json();
    const { apiKey } = body;
    
    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 400 }
      );
    }
    
    const success = updateApiKey(apiKey);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to save API key' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving API key:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE: Remove API key
export async function DELETE(request: NextRequest) {
  // Verify authentication
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try {
    await verifyJWT(token);
    
    const success = deleteApiKey();
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to remove API key or API key not set' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error removing API key:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 