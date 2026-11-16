import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON payload with base64 dataUrl
    if (contentType.includes('application/json')) {
      const { dataUrl } = await req.json();
      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
      }

      const match = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (!match) {
        return NextResponse.json({ url: dataUrl });
      }

      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');

      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);
        return NextResponse.json({ url: `/uploads/${filename}`, fallback: dataUrl });
      } catch (writeErr) {
        console.warn('Could not write to public/uploads, falling back to dataUrl:', writeErr);
        return NextResponse.json({ url: dataUrl });
      }
    }

    // Handle Multipart Form Data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type.split('/')[1] || 'jpg';
    const filename = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('Upload API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Upload failed' }, { status: 500 });
  }
}
