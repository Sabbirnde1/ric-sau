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
  cropShapeOptions?: ('circle' | 'rect')[];
  optimizePreset?: 'profile' | 'content' | 'branding';
}

interface UploadMeta {
  optimized?: boolean;
  originalSize?: number;
  outputSize?: number;
  outputType?: string;
  optimizePreset?: 'profile' | 'content' | 'branding';
  cropShape?: 'circle' | 'rect';
}

interface OptimizationResult {
  blob: Blob;
  outputType: string;
  qualityUsed: number | null;
  hitTargetSize: boolean;
}

interface OptimizationConfig {
  maxBytes: number;
  startQuality: number;
  minQuality: number;
  qualityStep: number;
  preferredType: string;
  fallbackType: string;
}

export default function ImageUpload({ 
  label = 'Image', 
  value = '', 
  onChange, 
  aspectRatio = 'auto',
  maxSize = 5,
  enableCrop = false,
  cropShape = 'rect',
  cropShapeOptions = ['rect', 'circle'],
  optimizePreset = 'content'
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
  const [activeCropShape, setActiveCropShape] = useState<'circle' | 'rect'>(
    cropShapeOptions.includes(cropShape) ? cropShape : (cropShapeOptions[0] || 'rect')
  );
  const [showCropEditor, setShowCropEditor] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropViewportRef = useRef<HTMLDivElement>(null);

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const optimizationByPreset: Record<'profile' | 'content' | 'branding', OptimizationConfig> = {
    profile: {
      maxBytes: 600 * 1024,
      startQuality: 0.9,
      minQuality: 0.6,
      qualityStep: 0.08,
      preferredType: 'image/webp',
      fallbackType: 'image/jpeg'
    },
    content: {
      maxBytes: 900 * 1024,
      startQuality: 0.9,
      minQuality: 0.6,
      qualityStep: 0.08,
      preferredType: 'image/webp',
      fallbackType: 'image/jpeg'
    },
    branding: {
      maxBytes: 450 * 1024,
      startQuality: 0.92,
      minQuality: 0.7,
      qualityStep: 0.06,
      preferredType: 'image/webp',
      fallbackType: 'image/png'
    }
  };

  const uniqueTypes = (types: string[]) => Array.from(new Set(types));

  const toBlobAsync = (canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> => {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type, quality);
    });
  };

  const optimizeCanvasBlob = async (
    canvas: HTMLCanvasElement,
    sourceType: string,
    preset: 'profile' | 'content' | 'branding'
  ): Promise<OptimizationResult> => {
    const config = optimizationByPreset[preset];
    const preferredType = sourceType === 'image/webp'
      ? 'image/webp'
      : (sourceType === 'image/png' && preset === 'branding')
        ? 'image/png'
        : config.preferredType;

    const candidateTypes = uniqueTypes([
      preferredType,
      config.fallbackType,
      'image/webp',
      'image/jpeg',
      'image/png'
    ]);

    let bestBlob: Blob | null = null;
    let bestType = preferredType;
    let bestQuality: number | null = null;

    for (const candidateType of candidateTypes) {
      const isLossy = candidateType === 'image/jpeg' || candidateType === 'image/webp';
      let quality = config.startQuality;
      const attempts = isLossy ? 6 : 1;

      for (let i = 0; i < attempts; i++) {
        const blob = await toBlobAsync(canvas, candidateType, isLossy ? quality : undefined);
        if (!blob) {
          if (isLossy) {
            quality = Math.max(config.minQuality, Number((quality - config.qualityStep).toFixed(2)));
          }
          continue;
        }

        if (!bestBlob || blob.size < bestBlob.size) {
          bestBlob = blob;
          bestType = candidateType;
          bestQuality = isLossy ? quality : null;
        }

        if (blob.size <= config.maxBytes) {
          return {
            blob,
            outputType: candidateType,
            qualityUsed: isLossy ? quality : null,
            hitTargetSize: true,
          };
        }

        if (!isLossy) break;

        const nextQuality = Math.max(config.minQuality, Number((quality - config.qualityStep).toFixed(2)));
        if (nextQuality === quality) break;
        quality = nextQuality;
      }
    }

    if (!bestBlob) {
      throw new Error('Failed to optimize image output');
    }

    return {
      blob: bestBlob,
      outputType: bestType,
      qualityUsed: bestQuality,
      hitTargetSize: bestBlob.size <= optimizationByPreset[preset].maxBytes,
    };
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (file: File, meta?: UploadMeta) => {
    setError('');
    setInfo('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (meta) {
        formData.append('optimized', String(Boolean(meta.optimized)));
        if (typeof meta.originalSize === 'number') formData.append('originalSize', String(meta.originalSize));
        if (typeof meta.outputSize === 'number') formData.append('outputSize', String(meta.outputSize));
        if (meta.outputType) formData.append('outputType', meta.outputType);
        if (meta.optimizePreset) formData.append('optimizePreset', meta.optimizePreset);
        if (meta.cropShape) formData.append('cropShape', meta.cropShape);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setPreview(result.url);
        onChange(result.url);
        const messages: string[] = [];

        if (result.optimization?.optimized) {
          const beforeKb = result.optimization.originalSize ? Math.round(result.optimization.originalSize / 1024) : null;
          const afterKb = result.optimization.outputSize ? Math.round(result.optimization.outputSize / 1024) : null;
          const details = beforeKb && afterKb
            ? ` (${beforeKb}KB -> ${afterKb}KB)`
            : '';
          messages.push(`Image optimized successfully${details}.`);
        }
        if (result.storage === 'inline') {
          messages.push('Uploaded successfully using serverless inline storage. For larger images, use an external image URL.');
        } else if (result.storage === 'blob') {
          messages.push('Uploaded successfully to Vercel Blob storage.');
        } else if (result.storage === 'cloudinary') {
          messages.push('Uploaded successfully to cloud storage.');
        } else if (result.storage === 'local') {
          messages.push('Uploaded successfully to local storage.');
        }

        if (messages.length > 0) {
          setInfo(messages.join(' '));
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
      setActiveCropShape(cropShapeOptions.includes(cropShape) ? cropShape : (cropShapeOptions[0] || 'rect'));
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
    const viewportRatio =
      activeCropShape === 'circle'
        ? 1
        : ((cropViewportRef.current?.clientWidth || 1) / (cropViewportRef.current?.clientHeight || 1));

    const baseCropHeight = Math.min(sourceHeight, sourceWidth / viewportRatio);
    const sourceCropHeight = baseCropHeight / cropZoom;
    const sourceCropWidth = sourceCropHeight * viewportRatio;

    const maxOffsetX = (sourceWidth - sourceCropWidth) / 2;
    const maxOffsetY = (sourceHeight - sourceCropHeight) / 2;

    const centerX = sourceWidth / 2 + (cropX / 100) * maxOffsetX;
    const centerY = sourceHeight / 2 + (cropY / 100) * maxOffsetY;

    const sx = Math.max(0, Math.min(sourceWidth - sourceCropWidth, centerX - sourceCropWidth / 2));
    const sy = Math.max(0, Math.min(sourceHeight - sourceCropHeight, centerY - sourceCropHeight / 2));

    const outputWidth = activeCropShape === 'circle' ? 800 : 1200;
    const outputHeight = activeCropShape === 'circle' ? 800 : Math.round(outputWidth / viewportRatio);
    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('Crop is not supported in this browser');
      return;
    }

    ctx.drawImage(
      sourceImage,
      sx,
      sy,
      sourceCropWidth,
      sourceCropHeight,
      0,
      0,
      outputWidth,
      outputHeight
    );

    const optimizationResult = await optimizeCanvasBlob(canvas, pendingFile.type, optimizePreset).catch(() => null);

    if (!optimizationResult) {
      setError('Failed to create cropped image');
      return;
    }

    const extension = optimizationResult.outputType === 'image/png'
      ? 'png'
      : optimizationResult.outputType === 'image/webp'
        ? 'webp'
        : 'jpg';
    const croppedFile = new File([optimizationResult.blob], `cropped-${Date.now()}.${extension}`, { type: optimizationResult.outputType });

    if (!optimizationResult.hitTargetSize) {
      setInfo('Applied best-effort compression. File remains larger than preferred target but was uploaded.');
    }

    setShowCropEditor(false);
    setOriginalImage('');
    setPendingFile(null);

    await uploadFile(croppedFile, {
      optimized: true,
      originalSize: pendingFile.size,
      outputSize: croppedFile.size,
      outputType: croppedFile.type,
      optimizePreset,
      cropShape: activeCropShape,
    });
  };

  const resetCrop = () => {
    setCropX(0);
    setCropY(0);
    setCropZoom(1);
  };

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY, startX: cropX, startY: cropY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !dragStart || !cropViewportRef.current) return;

    const rect = cropViewportRef.current.getBoundingClientRect();
    const deltaXPct = ((clientX - dragStart.x) / rect.width) * 100;
    const deltaYPct = ((clientY - dragStart.y) / rect.height) * 100;

    setCropX(clamp(dragStart.startX + deltaXPct, -100, 100));
    setCropY(clamp(dragStart.startY + deltaYPct, -100, 100));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setCropZoom((current) => clamp(Number((current + delta).toFixed(2)), 1, 3));
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
          <div
            ref={cropViewportRef}
            className={`relative overflow-hidden border bg-black select-none ${activeCropShape === 'circle' ? 'w-64 h-64 mx-auto rounded-full' : 'w-full h-64 rounded-md'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              if (touch) handleDragStart(touch.clientX, touch.clientY);
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              if (touch) handleDragMove(touch.clientX, touch.clientY);
            }}
            onTouchEnd={handleDragEnd}
            onWheel={handleWheelZoom}
            onDoubleClick={resetCrop}
          >
            <img
              src={originalImage}
              alt="Crop preview"
              className="w-full h-full object-cover"
              style={{
                transform: `translate(${cropX}%, ${cropY}%) scale(${cropZoom})`,
                transformOrigin: 'center center',
              }}
            />
            <div className="absolute inset-0 pointer-events-none border-2 border-white/40" />
          </div>

          {cropShapeOptions.length > 1 && (
            <div>
              <Label className="text-xs">Crop Shape</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  type="button"
                  variant={activeCropShape === 'circle' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCropShape('circle')}
                >
                  Circle
                </Button>
                <Button
                  type="button"
                  variant={activeCropShape === 'rect' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCropShape('rect')}
                >
                  Rectangle
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-600">Tip: Drag image to reposition • Scroll to zoom • Double-click to reset</p>

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
            <Button type="button" variant="secondary" onClick={() => setCropZoom((z) => clamp(Number((z + 0.1).toFixed(2)), 1, 3))}>
              Zoom +
            </Button>
            <Button type="button" variant="secondary" onClick={() => setCropZoom((z) => clamp(Number((z - 0.1).toFixed(2)), 1, 3))}>
              Zoom -
            </Button>
            <Button type="button" variant="secondary" onClick={() => {
              setCropX(0);
              setCropY(0);
            }}>
              Center
            </Button>
            <Button type="button" variant="secondary" onClick={resetCrop}>
              Reset
            </Button>
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
        <div className={`relative bg-gray-100 overflow-hidden border ${activeCropShape === 'circle' ? 'w-40 h-40 mx-auto rounded-full' : 'w-full h-48 rounded-lg'}`}>
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
