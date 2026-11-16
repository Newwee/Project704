import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter required' }, { status: 400 });
    }

    const matches = serverDb.getMatches(userId);
    return NextResponse.json({ matches });
  } catch (err) {
    if ((err as { digest?: string })?.digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw err;
    }
    console.error('Get Matches API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const matchId = req.nextUrl.searchParams.get('matchId');

    if (!matchId) {
      return NextResponse.json({ error: 'matchId required' }, { status: 400 });
    }

    serverDb.unmatch(matchId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unmatch API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Server error' }, { status: 500 });
  }
}
