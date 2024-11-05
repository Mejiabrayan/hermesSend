import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { listObjects, getPresignedUrlForDownload } from '@/utils/s3/s3Operations';

interface ImageData {
  url: string;
  key: string;
}

async function getImages(): Promise<ImageData[]> {
  try {
    const bucketName = process.env.NEXT_PUBLIC_SECRET_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('Bucket name not found');
    }

    const objects = await listObjects(bucketName);
    if (!objects?.length) return [];

    const images = await Promise.all(
      objects.map(async (obj) => {
        if (!obj.Key) return null;
        const url = await getPresignedUrlForDownload(bucketName, obj.Key);
        if (!url) return null;
        
        return {
          url,
          key: obj.Key
        };
      })
    );

    // Filter out any null values and ensure type safety
    return images.filter((img): img is ImageData => 
      img !== null && typeof img.url === 'string' && typeof img.key === 'string'
    );
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export default async function Page() {
  const images = await getImages();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Your Images</h1>
        {/* Add upload button or other actions here later */}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {images.length > 0 ? (
          images.map((image) => (
            <div 
              key={image.key}
              className='group aspect-square relative border border-white/10 rounded-lg overflow-hidden bg-black/20 hover:border-white/20 transition-all'
            >
              <Image
                src={image.url}
                alt={image.key}
                fill
                className='object-cover group-hover:scale-105 transition-transform duration-200'
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={false}
                unoptimized
              />
            </div>
          ))
        ) : (
          [...Array(8)].map((_, i) => (
            <Skeleton 
              key={i}
              className='aspect-square rounded-lg'
            />
          ))
        )}
      </div>
    </div>
  );
}