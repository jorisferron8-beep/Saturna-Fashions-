import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { REGION_META, REGIONS, getStrings } from '@/i18n/regions';
import { useGeoMarket } from '@/context/CurrencyContext';

/**
 * RegionSwitcher — discrete market + language selector.
 *
 * Navigates between the four regional routes (/us, /co, /hk, /cn) so each
 * market gets its own language, currency and checkout locale, while keeping
 * the shared SATURNA identity and catalogue. Compact and keyboard-accessible.
 */
export default function RegionSwitcher({ light = false, className = '' }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { marketId, selectMarket } = useGeoMarket();
    const ref = useRef(null);

    // Derive the active region from the current path when on a regional route.
    const activeFromPath = REGIONS.find((r) => location.pathname === REGION_META[r].route);
    const activeId = activeFromPath || marketId;
    const active = REGION_META[activeId] || REGION_META.US;
    const t = getStrings(activeId);

    useEffect(() => {
        if (!open) return;
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const choose = (regionId) => {
        const meta = REGION_META[regionId];
        setOpen(false);
        selectMarket(regionId); // keep currency/market context in sync
        navigate(meta.route);
    };

    const triggerCls = light
        ? 'text-neutral-600 hover:text-black'
        : 'text-neutral-400 hover:text-white';

    return (
        <div ref={ref} className={`relative inline-block ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Select market and language"
                className={`inline-flex items-center gap-1.5 border-0 bg-transparent py-1 text-[10px] font-medium uppercase tracking-[0.16em] outline-none transition-colors ${triggerCls}`}
            >
                <Globe className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                <span>{active.flag} {active.nameLocal} · {active.lang.split(' ')[0]}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.5} aria-hidden="true" />
            </button>

            {open ? (
                <div
                    role="listbox"
                    aria-label="Markets and languages"
                    className="absolute right-0 z-[90] mt-2 w-64 border border-black/10 bg-white p-1.5 shadow-xl"
                >
                    <p className="px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                        Market · Language
                    </p>
                    {REGIONS.map((id) => {
                        const m = REGION_META[id];
                        const ts = getStrings(id);
                        const isActive = id === activeId;
                        return (
                            <button
                                key={id}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                onClick={() => choose(id)}
                                className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#F7F5F0] ${isActive ? 'bg-[#F7F5F0]' : ''}`}
                            >
                                <span className="flex min-w-0 items-center gap-2.5">
                                    <span className="text-base leading-none" aria-hidden="true">{m.flag}</span>
                                    <span className="min-w-0">
                                        <span className="block text-[12px] font-semibold uppercase tracking-wide text-black">
                                            {m.nameLocal}
                                        </span>
                                        <span className="block truncate text-[10px] font-light tracking-wide text-neutral-500">
                                            {m.lang} · {m.marketId === 'US' ? 'USD' : m.marketId === 'CO' ? 'COP' : m.marketId === 'HK' ? 'HKD' : 'CNY'}
                                        </span>
                                    </span>
                                </span>
                                {isActive ? (
                                    <Check className="h-4 w-4 flex-shrink-0 text-[#5A1825]" strokeWidth={1.5} aria-hidden="true" />
                                ) : null}
                            </button>
                        );
                    })}
                    <p className="mt-1 border-t border-black/5 px-3 py-2 text-[9px] font-light leading-relaxed text-neutral-400">
                        {t.marketLine}
                    </p>
                </div>
            ) : null}
        </div>
    );
}
