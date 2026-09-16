import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

/**
 * SATURNA — Cookie consent banner.
 *
 * Functional consent layer: appears once on first visit, persists the visitor's
 * choice in localStorage, and never re-shows after a decision. Offers "Accept
 * all" (technical + analytics) and "Essential only" (reject non-essential).
 * Links to the full Cookies policy in the Legal center.
 */
const STORAGE_KEY = 'saturna-cookie-consent';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let choice = null;
        try {
            choice = localStorage.getItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
        if (!choice) {
            const t = setTimeout(() => setVisible(true), 900);
            return () => clearTimeout(t);
        }
        return undefined;
    }, []);

    const choose = (value) => {
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch {
            /* ignore */
        }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-live="polite"
            aria-label="Consentimiento de cookies"
            className="fixed inset-x-0 bottom-0 z-[95] px-4 pb-4 md:px-6 md:pb-6"
        >
            <div className="mx-auto max-w-3xl border border-white/10 bg-[#0A0A0A] text-[#F7F5F0] shadow-2xl">
                <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6 md:p-6">
                    <div className="flex items-start gap-3 md:flex-1">
                        <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center border border-white/15 bg-white/5">
                            <Cookie className="h-4 w-4 text-[#A3182B]" strokeWidth={1.5} />
                        </span>
                        <div>
                            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
                                Cookies &amp; Privacidad
                            </p>
                            <p className="mt-1.5 text-[12px] font-light leading-relaxed text-white/70">
                                Usamos cookies técnicas (esenciales) y analíticas para mejorar su
                                experiencia en SATURNA™. Puede aceptar todas o conservar solo las
                                esenciales.
                                <span className="mt-0.5 block text-white/45">
                                    我们使用必要和分析类 Cookie 以改善您的体验。您可全部接受或仅保留必要 Cookie。
                                </span>
                            </p>
                            <Link
                                to="/legal"
                                className="mt-2 inline-block border-b border-white/40 pb-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-white hover:text-white"
                            >
                                Política de Cookies
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
                        <button
                            type="button"
                            onClick={() => choose('all')}
                            className="bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#F7F5F0] active:scale-[0.98]"
                        >
                            Aceptar todas
                        </button>
                        <button
                            type="button"
                            onClick={() => choose('essential')}
                            className="border border-white/30 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 transition-colors hover:border-white hover:text-white active:scale-[0.98]"
                        >
                            Solo esenciales
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => choose('essential')}
                        aria-label="Cerrar y conservar solo esenciales"
                        className="absolute right-3 top-3 text-white/40 transition-colors hover:text-white md:right-4 md:top-4"
                    >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}
