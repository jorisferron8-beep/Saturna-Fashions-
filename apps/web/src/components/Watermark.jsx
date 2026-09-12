import React from 'react';

/**
 * SATURNA watermark overlay for editorial / model photography.
 * Renders a crisp, consistent "SATURNA" brand mark on top of any image
 * container (the parent must be `relative` + `overflow-hidden`).
 *
 * Props:
 *  - position: 'top-right' | 'bottom-right' | 'bottom-left' (default 'top-right')
 *  - className: extra classes for the wrapper
 *  - size: 'sm' | 'md' | 'lg' (default 'md')
 */
export default function Watermark({ position = 'top-right', className = '', size = 'md' }) {
    const posClass =
        position === 'bottom-right'
            ? 'right-2 bottom-2 md:right-3 md:bottom-3'
            : position === 'bottom-left'
              ? 'left-2 bottom-2 md:left-3 md:bottom-3'
              : 'right-2 top-2 md:right-3 md:top-3';

    const sizeClass =
        size === 'lg'
            ? 'text-[11px] tracking-[0.35em] px-2.5 py-1'
            : size === 'sm'
              ? 'text-[7px] tracking-[0.3em] px-1.5 py-0.5'
              : 'text-[8px] tracking-[0.32em] px-2 py-1';

    return (
        <span
            aria-hidden="true"
            className={`pointer-events-none absolute z-20 inline-flex items-center border border-[#5A1825]/40 bg-ink/45 font-display font-semibold uppercase text-paper/85 backdrop-blur-[2px] ${sizeClass} ${posClass} ${className}`}
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
        >
            SATURNA
        </span>
    );
}
