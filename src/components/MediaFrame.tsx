import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface MediaFrameProps {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  fallbackTitle?: string;
}

export function MediaFrame({
  src,
  alt,
  className = '',
  imgClassName = '',
  eager = false,
  fallbackTitle,
}: MediaFrameProps) {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex flex-col items-center justify-center bg-[#F4F4F5] border border-[#E4E4E7] text-[#52525B] overflow-hidden ${className}`}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(29,78,216,0.08), transparent 55%), linear-gradient(to right, rgba(17,17,19,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,19,0.04) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 32px 32px, 32px 32px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-2 px-6 text-center">
          <ImageIcon className="w-7 h-7 text-[#1D4ED8]" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-xs font-medium tracking-tight text-[#111113]">
            {fallbackTitle || alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F4F4F5] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager ? 'sync' : 'async'}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
