import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';
import { SwipeAction } from '@/types';

export async function POST(req: Request) {
  try {
    const { fromUserId, toUserId, action } = (await req.json()) as {
      fromUserId: string;
      toUserId: string;
      action: SwipeAction;
    };

    if (!fromUserId || !toUserId || !action) {
      return NextResponse.json({ error: 'Missing required swipe parameters' }, { status: 400 });
    }

    const result = serverDb.recordSwipe(fromUserId, toUserId, action);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('Swipe API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Server error' }, { status: 500 });
  }
}
