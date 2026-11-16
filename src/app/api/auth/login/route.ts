import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = serverDb.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('Login API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Server error' }, { status: 500 });
  }
}
