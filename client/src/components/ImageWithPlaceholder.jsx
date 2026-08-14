// src/components/ImageWithPlaceholder.jsx
import { useState } from 'react';

const ImageWithPlaceholder = ({ src, alt, className, placeholderText }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`${className} bg-[#1a1a1a] flex flex-col items-center justify-center gap-3`}>
        {/* Geometric placeholder icon */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="32" height="32" rx="4" stroke="#2a2a2a" strokeWidth="1.5"/>
          <circle cx="14" cy="15" r="3" stroke="#3a3a3a" strokeWidth="1.5"/>
          <path d="M4 28l9-9 6 6 5-5 12 12" stroke="#3a3a3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {placeholderText && (
          <span className="font-body text-[#3a3a3a] text-[12px] tracking-wider uppercase">
            {placeholderText}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default ImageWithPlaceholder;
