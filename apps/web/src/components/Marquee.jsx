import React from 'react';

/**
 * Infinite horizontal ticker. Renders `items` twice back to back and
 * scrolls the whole strip left forever (CSS `.animate-marquee`, already
 * defined in index.css with a prefers-reduced-motion off-switch) — a
 * classic seamless-loop trick, no JS animation loop needed.
 */
export default function Marquee({ items, renderItem, className = '', itemClassName = '' }) {
  const doubled = [...items, ...items];
  return (
    <div className={`group overflow-hidden ${className}`}>
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <div key={i} className={itemClassName}>
            {renderItem(item, i % items.length)}
          </div>
        ))}
      </div>
    </div>
  );
}
