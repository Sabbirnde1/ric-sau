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
  enableCrop?: boolean;
  cropShape?: 'circle' | 'rect';
}

export default function ImageUpload({ 
  label = 'Image', 
  value = '', 
  onChange, 
  aspectRatio = 'auto',
  maxSize = 5,
  enableCrop = false,
  cropShape = 'rect'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [useUrl, setUseUrl] = useState(false);
  const [originalImage, setOriginalImage] = useState('');
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropZoom, setCropZoom] = useState(1);
  const [showCropEditor, setShowCropEditor] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (file: File) => {
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

        const isLegacyServerlessError =
          response.status === 501 ||
          /serverless local storage|external image url in settings/i.test(errorMessage);

        if (isLegacyServerlessError) {
          const inlineMaxBytes = 1 * 1024 * 1024;
          if (file.size <= inlineMaxBytes) {
            const dataUrl = await fileToDataUrl(file);
            setPreview(dataUrl);
            onChange(dataUrl);
            setInfo('Uploaded using client-side inline fallback. Configure latest deployment settings for persistent storage.');
            return;
          }

          setError('This deployment returned a legacy serverless upload error. Please use an image under 1MB or configure Vercel Blob token.');
          return;
        }

        setError(errorMessage);
      }
    } catch (err) {
      setError('Failed to upload image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

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

    if (enableCrop) {
      const dataUrl = await fileToDataUrl(file);
      setPendingFile(file);
      setOriginalImage(dataUrl);
      setCropX(0);
      setCropY(0);
      setCropZoom(1);
      setShowCropEditor(true);
      setError('');
      setInfo('Adjust crop and click Apply Crop');
      return;
    }

    await uploadFile(file);
  };

  const applyCropAndUpload = async () => {
    if (!originalImage || !pendingFile) return;

    const sourceImage = new window.Image();
    sourceImage.src = originalImage;

    await new Promise<void>((resolve, reject) => {
      sourceImage.onload = () => resolve();
      sourceImage.onerror = () => reject(new Error('Failed to load image for crop'));
    });

    const sourceWidth = sourceImage.naturalWidth;
    const sourceHeight = sourceImage.naturalHeight;
    const baseCropSize = Math.min(sourceWidth, sourceHeight);
    const sourceCropSize = baseCropSize / cropZoom;

    const maxOffsetX = (sourceWidth - sourceCropSize) / 2;
    const maxOffsetY = (sourceHeight - sourceCropSize) / 2;

    const centerX = sourceWidth / 2 + (cropX / 100) * maxOffsetX;
    const centerY = sourceHeight / 2 + (cropY / 100) * maxOffsetY;

    const sx = Math.max(0, Math.min(sourceWidth - sourceCropSize, centerX - sourceCropSize / 2));
    const sy = Math.max(0, Math.min(sourceHeight - sourceCropSize, centerY - sourceCropSize / 2));

    const outputSize = 800;
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('Crop is not supported in this browser');
      return;
    }

    ctx.drawImage(
      sourceImage,
      sx,
      sy,
      sourceCropSize,
      sourceCropSize,
      0,
      0,
      outputSize,
      outputSize
    );

    const outputType = pendingFile.type === 'image/png' || pendingFile.type === 'image/webp'
      ? pendingFile.type
      : 'image/jpeg';

    const croppedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, outputType, 0.92);
    });

    if (!croppedBlob) {
      setError('Failed to create cropped image');
      return;
    }

    const extension = outputType === 'image/png' ? 'png' : outputType === 'image/webp' ? 'webp' : 'jpg';
    const croppedFile = new File([croppedBlob], `cropped-${Date.now()}.${extension}`, { type: outputType });

    setShowCropEditor(false);
    setOriginalImage('');
    setPendingFile(null);

    await uploadFile(croppedFile);
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
      ) : showCropEditor && originalImage ? (
        <div className="space-y-3 border rounded-lg p-3 bg-gray-50">
          <p className="text-sm font-medium">Crop Preview</p>
          <div className={`relative w-full h-64 overflow-hidden border bg-black ${cropShape === 'circle' ? 'rounded-full max-w-64 mx-auto' : 'rounded-md'}`}>
            <img
              src={originalImage}
              alt="Crop preview"
              className="w-full h-full object-cover"
              style={{
                transform: `translate(${cropX}%, ${cropY}%) scale(${cropZoom})`,
                transformOrigin: 'center center',
              }}
            />
          </div>

          <div>
            <Label className="text-xs">Zoom: {cropZoom.toFixed(1)}x</Label>
            <input type="range" min="1" max="3" step="0.1" value={cropZoom} onChange={(e) => setCropZoom(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <Label className="text-xs">Horizontal Position</Label>
            <input type="range" min="-100" max="100" step="1" value={cropX} onChange={(e) => setCropX(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <Label className="text-xs">Vertical Position</Label>
            <input type="range" min="-100" max="100" step="1" value={cropY} onChange={(e) => setCropY(Number(e.target.value))} className="w-full" />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => {
              setShowCropEditor(false);
              setOriginalImage('');
              setPendingFile(null);
              setInfo('');
            }}>
              Cancel
            </Button>
            <Button type="button" className="flex-1" onClick={applyCropAndUpload} disabled={uploading}>
              Apply Crop
            </Button>
          </div>
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
