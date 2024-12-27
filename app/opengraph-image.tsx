import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'HermesSend - AWS SES Made Beautiful';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  const geistSans = fetch(
    new URL('./fonts/GeistVF.woff', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to right, rgba(79, 79, 79, 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(128, 128, 128, 0.04) 1px, transparent 1px)',
            backgroundSize: '14px 24px',
          }}
        />

        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: -200,
            width: '800px',
            height: '800px',
            background: 'linear-gradient(to tr, #ff80b5, #9089fc)',
            opacity: 0.2,
            filter: 'blur(100px)',
            borderRadius: '100%',
            transform: 'translate(20%, 20%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            position: 'relative',
            padding: '40px',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              fontSize: 32,
              color: 'white',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            HermesSend
          </div>

          <div
            style={{
              background: 'linear-gradient(to bottom, #f0f0f0, #a0a0a0)',
              backgroundClip: 'text',
              color: 'transparent',
              fontSize: 72,
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: 1.1,
              marginBottom: '20px',
              maxWidth: '900px',
            }}
          >
            AWS SES Made Beautiful
          </div>

          <div
            style={{
              color: '#a0a0a0',
              fontSize: 32,
              textAlign: 'center',
              maxWidth: '700px',
            }}
          >
            Email infrastructure without the headaches
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Geist',
          data: await geistSans,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
} 