import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function GET(req: NextRequest) {
  try {
    const conversationId = req.nextUrl.searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId parameter required' }, { status: 400 });
    }

    const messages = serverDb.getMessages(conversationId);
    return NextResponse.json({ messages });
  } catch (err) {
    if ((err as { digest?: string })?.digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw err;
    }
    console.error('Get Messages API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const conversationId = body.conversationId;
    const senderId = body.senderId;
    const text = (body.text || body.content || '').trim();
    const imageUrl = body.imageUrl || body.image_url;

    if (!conversationId || !senderId || (!text && !imageUrl)) {
      return NextResponse.json({ error: 'Missing required message parameters' }, { status: 400 });
    }

    const message = serverDb.sendMessage(conversationId, senderId, text, imageUrl);
    return NextResponse.json({ success: true, message });
  } catch (err) {
    console.error('Send Message API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Server error' }, { status: 500 });
  }
}
