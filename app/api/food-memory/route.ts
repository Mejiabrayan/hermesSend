import { NextResponse } from 'next/server';
import { putObject, getPresignedUrlForDownload } from '@/utils/s3/s3Operations';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const emotion = formData.get('emotion') as string;
  const description = formData.get('description') as string;
  const bucket = process.env.NEXT_PUBLIC_SECRET_BUCKET_NAME;

  if (!file || !emotion || !description || !bucket) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const buffer = await file.arrayBuffer();
    const key = `${Date.now()}-${file.name}`;
    await putObject(bucket, key, new Uint8Array(buffer));
    
    const downloadUrl = await getPresignedUrlForDownload(bucket, key);
    
    // Here you would typically save the emotion and description to a database
    // along with the S3 key for the image

    return NextResponse.json({ downloadUrl, emotion, description });
  } catch (error) {
    console.error('Error uploading food memory:', error);
    return NextResponse.json({ error: 'Error uploading food memory' }, { status: 500 });
  }
}
