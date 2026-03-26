import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
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

    // Serverless providers have ephemeral local disk.
    // Use Cloudinary if configured, otherwise inline fallback.
    if (process.env.NETLIFY || process.env.VERCEL) {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
      let cloudinaryError: string | null = null;

      if (cloudName && uploadPreset) {
        const cloudinaryFormData = new FormData();
        const blob = new Blob([bytes], { type: file.type });
        cloudinaryFormData.append('file', blob, file.name);
        cloudinaryFormData.append('upload_preset', uploadPreset);

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: cloudinaryFormData,
          }
        );

        if (cloudinaryResponse.ok) {
          const cloudinaryResult = await cloudinaryResponse.json();
          return NextResponse.json({
            success: true,
            url: cloudinaryResult.secure_url,
            filename: file.name,
            size: file.size,
            type: file.type,
            storage: 'cloudinary'
          });
        }

        const cloudinaryResult = await cloudinaryResponse.json().catch(() => ({}));
        cloudinaryError =
          cloudinaryResult?.error?.message ||
          `Cloudinary upload failed with status ${cloudinaryResponse.status}`;
      }

      const inlineMaxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > inlineMaxSize) {
        const message = cloudinaryError
          ? `Cloudinary upload failed: ${cloudinaryError}. Please fix CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET, then retry.`
          : 'Upload failed on serverless storage for files above 1MB. Configure CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET for persistent uploads, or use an external image URL.';

        return NextResponse.json({
          success: false,
          error: message
        }, { status: 400 });
      }

      const base64 = Buffer.from(bytes).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        storage: 'inline'
      });
    }

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
