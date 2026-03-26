'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: string;
  maxSize?: number; // in MB
}

export default function ImageUpload({ 
  label = 'Image', 
  value = '', 
  onChange, 
  aspectRatio = 'auto',
  maxSize = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [useUrl, setUseUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, GIF, and WebP images are allowed');
      return;
    }

    setError('');
    setInfo('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setPreview(result.url);
        onChange(result.url);
        if (result.storage === 'inline') {
          setInfo('Uploaded successfully using serverless inline storage. For larger images, use an external image URL.');
        } else if (result.storage === 'blob') {
          setInfo('Uploaded successfully to Vercel Blob storage.');
        } else if (result.storage === 'cloudinary') {
          setInfo('Uploaded successfully to cloud storage.');
        }
      } else {
        const errorMessage = result.error || 'Upload failed';
        setError(errorMessage);
      }
    } catch (err) {
      setError('Failed to upload image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
    setInfo('');
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            setUseUrl(!useUrl);
            setError(''); // Clear error when switching modes
            setInfo('');
          }}
          className="text-xs"
        >
          {useUrl ? 'Upload File' : 'Use URL Instead'}
        </Button>
      </div>

      {useUrl ? (
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter image URL (e.g., https://example.com/image.png)"
            value={preview}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label}`}
          />
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Choose File'}
            </Button>
            
            {preview && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {error && !useUrl && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {info && !useUrl && (
        <p className="text-sm text-blue-700">{info}</p>
      )}

      {preview && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        Max size: {maxSize}MB • Formats: JPEG, PNG, GIF, WebP
      </p>
    </div>
  );
}
