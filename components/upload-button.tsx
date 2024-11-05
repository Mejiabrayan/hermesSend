'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UploadButtonProps {
  onUploadAction: (file: File) => Promise<void>;
  isUploading?: boolean;
  accept?: string;
  className?: string;
}

export default function UploadButton({
  onUploadAction,
  isUploading = false,
  accept = 'image/*',
  className = '',
}: UploadButtonProps) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUploadAction(file);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Input
        id='image-upload'
        type='file'
        accept={accept}
        className='hidden'
        onChange={handleUpload}
        disabled={isUploading}
      />
      <Label
        htmlFor='image-upload'
        className='cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
      >
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Label>
    </div>
  );
}
