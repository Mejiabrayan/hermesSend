'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import UploadButton from '@/components/upload-button'
import { uploadFile } from '@/utils/actions/upload'

export function ImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true)
      
      const formData = new FormData()
      formData.append('file', file)
      
      const result = await uploadFile(formData)
      
      if (!result.success) throw new Error('Upload failed')

      router.refresh()
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <UploadButton 
      onUploadAction={handleUpload}
      isUploading={isUploading}
    />
  )
} 