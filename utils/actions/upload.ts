'use server'

import { putObject } from '@/utils/s3/s3Operations'

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File
    const bucket = process.env.NEXT_PUBLIC_SECRET_BUCKET_NAME

    if (!file || !bucket) {
      throw new Error('File and bucket are required')
    }

    const buffer = await file.arrayBuffer()
    const key = `${Date.now()}-${file.name}`
    
    await putObject(bucket, key, new Uint8Array(buffer))
    return { success: true, key }
    
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
} 