import React, { useId } from 'react';

/**
 * Signature lace trim divider — a repeating scalloped lace motif
 * rendered as an SVG pattern in silver with blood-red diamond accents.
 */
export default function LaceDivider({ className = '' }) {
    const id = useId();
    const patternId = `lace-${id.replace(/:/g, '')}`;

    return (
        <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
            <svg width="100%" height="36" className="block" preserveAspectRatio="none">
                <defs>
                    <pattern id={patternId} width="72" height="36" patternUnits="userSpaceOnUse">
                        {/* scalloped edges */}
                        <path
                            d="M0 9 Q9 2 18 9 T36 9 T54 9 T72 9"
                            fill="none"
                            stroke="#C7C3CC"
                            strokeOpacity="0.4"
                            strokeWidth="1"
                        />
                        <path
                            d="M0 27 Q9 34 18 27 T36 27 T54 27 T72 27"
                            fill="none"
                            stroke="#C7C3CC"
                            strokeOpacity="0.4"
                            strokeWidth="1"
                        />
                        {/* crest beads */}
                        <circle cx="18" cy="9" r="1" fill="#C7C3CC" fillOpacity="0.35" />
                        <circle cx="54" cy="9" r="1" fill="#C7C3CC" fillOpacity="0.35" />
                        <circle cx="18" cy="27" r="1" fill="#C7C3CC" fillOpacity="0.35" />
                        <circle cx="54" cy="27" r="1" fill="#C7C3CC" fillOpacity="0.35" />
                        {/* thread dots */}
                        <circle cx="9" cy="18" r="1.1" fill="#C7C3CC" fillOpacity="0.45" />
                        <circle cx="27" cy="18" r="1.1" fill="#C7C3CC" fillOpacity="0.45" />
                        <circle cx="45" cy="18" r="1.1" fill="#C7C3CC" fillOpacity="0.45" />
                        <circle cx="63" cy="18" r="1.1" fill="#C7C3CC" fillOpacity="0.45" />
                        {/* blood-red diamonds */}
                        <path d="M18 14 L21.5 18 L18 22 L14.5 18 Z" fill="#A3182B" fillOpacity="0.85" />
                        <path d="M54 14 L57.5 18 L54 22 L50.5 18 Z" fill="#A3182B" fillOpacity="0.85" />
                    </pattern>
                </defs>
                <rect width="100%" height="36" fill={`url(#${patternId})`} />
            </svg>
        </div>
    );
}
