import React, { useEffect, useRef, useState } from 'react';

/**
 * Lightweight auto-cycling image crossfade — no video, no external library,
 * just two stacked <img> layers with a CSS opacity transition. Pauses on
 * hover/focus and respects prefers-reduced-motion.
 */
export default function AutoCrossfade({ images, alt, intervalMs = 3200, className = '' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    if (images.length < 2 || paused || reduceMotion.current) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [images.length, paused, intervalMs]);

  return (
    <div
      className={`relative h-full w-full ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={i === 0 ? alt : ''}
          aria-hidden={i !== index}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      {images.length > 1 ? (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
          {images.map((src, i) => (
            <span key={src + i} className={`h-1 w-1 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/35'}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
