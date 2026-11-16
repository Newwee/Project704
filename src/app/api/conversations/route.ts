import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter required' }, { status: 400 });
    }

    const conversations = serverDb.getConversations(userId);
    return NextResponse.json({ conversations });
  } catch (err) {
    if ((err as { digest?: string })?.digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw err;
    }
    console.error('Get Conversations API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Server error' }, { status: 500 });
  }
}
