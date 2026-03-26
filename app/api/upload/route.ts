import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Serverless providers use ephemeral/read-only file systems for deployment assets.
    // Writing to /public/uploads is not durable in production.
    if (process.env.NETLIFY || process.env.VERCEL) {
      return NextResponse.json({
        success: false,
        error: 'File upload is not supported on serverless platforms (Netlify/Vercel) due to ephemeral storage. Please use external image URLs in Settings instead. You can host images on services like Imgbb, Cloudinary, or AWS S3.'
      }, { status: 501 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: 'File size exceeds 5MB limit' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    const filepath = path.join(uploadDir, filename);

    // Write file
    await writeFile(filepath, buffer);

    // Return URL path
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url,
      filename,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload file' 
    }, { status: 500 });
  }
}

// Optional: GET endpoint to list uploaded images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // In production, you'd query a database
    // For now, we'll return a simple response
    return NextResponse.json({ 
      success: true, 
      images: [],
      message: 'Image listing functionality - implement with database in production'
    });

  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to list images' 
    }, { status: 500 });
  }
}
