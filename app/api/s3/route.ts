import { NextResponse } from 'next/server';
import { listBuckets, listObjects, getObject, putObject, getPresignedUrlForDownload, getPresignedUrlForUpload } from '@/utils/s3/s3Operations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const bucket = searchParams.get('bucket');
  const key = searchParams.get('key');

  switch (action) {
    case 'listBuckets':
      const buckets = await listBuckets();
      return NextResponse.json({ buckets });
    case 'listObjects':
      if (!bucket) return NextResponse.json({ error: 'Bucket name is required' }, { status: 400 });
      const objects = await listObjects(bucket);
      return NextResponse.json({ objects });
    case 'getObject':
      if (!bucket || !key) return NextResponse.json({ error: 'Bucket and key are required' }, { status: 400 });
      const object = await getObject(bucket, key);
      return new NextResponse(object as ReadableStream);
    case 'getPresignedUrlForDownload':
      if (!bucket || !key) return NextResponse.json({ error: 'Bucket and key are required' }, { status: 400 });
      const downloadUrl = await getPresignedUrlForDownload(bucket, key);
      return NextResponse.json({ downloadUrl });
    case 'getPresignedUrlForUpload':
      if (!bucket || !key) return NextResponse.json({ error: 'Bucket and key are required' }, { status: 400 });
      const uploadUrl = await getPresignedUrlForUpload(bucket, key);
      return NextResponse.json({ uploadUrl });
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const bucket = process.env.NEXT_PUBLIC_SECRET_BUCKET_NAME;

  if (!file || !bucket) {
    return NextResponse.json({ error: 'File and bucket are required' }, { status: 400 });
  }

  try {
    const buffer = await file.arrayBuffer();
    const key = `${Date.now()}-${file.name}`;
    await putObject(bucket, key, new Uint8Array(buffer));
    const downloadUrl = await getPresignedUrlForDownload(bucket, key);
    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}
