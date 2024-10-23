'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface FoodMemory {
  file: File | null;
  emotion: string;
  description: string;
}

interface UploadState extends FoodMemory {
  isUploading: boolean;
  uploadedUrl: string | null;
  error: string | null;
}

export default function FoodMemoryCapture() {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    emotion: '',
    description: '',
    isUploading: false,
    uploadedUrl: null,
    error: null,
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadState(prev => ({ ...prev, file: e.target.files![0], error: null }));
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadState(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleUpload = useCallback(async () => {
    if (!uploadState.file || !uploadState.emotion || !uploadState.description) {
      setUploadState(prev => ({ ...prev, error: 'Please fill in all fields' }));
      return;
    }

    setUploadState(prev => ({ ...prev, isUploading: true, error: null }));
    try {
      const formData = new FormData();
      formData.append('file', uploadState.file);
      formData.append('emotion', uploadState.emotion);
      formData.append('description', uploadState.description);

      const response = await fetch('/api/food-memory', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { downloadUrl } = await response.json();
      setUploadState(prev => ({ 
        ...prev, 
        uploadedUrl: downloadUrl, 
        isUploading: false,
        file: null,
        emotion: '',
        description: ''
      }));
    } catch (error) {
      console.error('Error uploading food memory:', error);
      setUploadState(prev => ({ ...prev, error: 'Failed to upload food memory', isUploading: false }));
    }
  }, [uploadState.file, uploadState.emotion, uploadState.description]);

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Capture Your Food Memory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*" 
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
          />
          <Input
            name="emotion"
            value={uploadState.emotion}
            onChange={handleInputChange}
            placeholder="How did this food make you feel?"
            className="w-full"
          />
          <Textarea
            name="description"
            value={uploadState.description}
            onChange={handleInputChange}
            placeholder="Describe your food memory..."
            className="w-full"
          />
          <Button 
            onClick={handleUpload} 
            disabled={!uploadState.file || uploadState.isUploading}
            className="w-full"
          >
            {uploadState.isUploading ? 'Uploading...' : 'Capture Memory'}
          </Button>
          {uploadState.error && (
            <p className="text-red-500 text-sm">{uploadState.error}</p>
          )}
          {uploadState.uploadedUrl && (
            <div className="mt-4">
              <p className="mb-2">Captured Food Memory:</p>
              <Image 
                src={uploadState.uploadedUrl} 
                alt="Food Memory" 
                width={300} 
                height={300} 
                className="w-full h-auto object-cover rounded-md"
                loading="lazy"
              />
              <p className="mt-2 font-semibold">{uploadState.emotion}</p>
              <p className="mt-1">{uploadState.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
