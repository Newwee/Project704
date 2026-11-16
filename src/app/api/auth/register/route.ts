import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';
import { UserProfile } from '@/types';

export async function POST(req: Request) {
  try {
    const user: UserProfile = await req.json();
    if (!user || !user.id || !user.display_name) {
      return NextResponse.json({ error: 'Missing required profile fields' }, { status: 400 });
    }

    const saved = serverDb.saveUser(user);
    return NextResponse.json({ success: true, user: saved });
  } catch (err) {
    console.error('Registration API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Server error' }, { status: 500 });
  }
}
