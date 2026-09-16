import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/context/CurrencyContext';
import { REGION_META } from '@/i18n/regions';

const placeholderImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjdGNUYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzVBMTgyNSIgdGV4dC1hbmNvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U0FUVVJOQTwvdGV4dD48L3N2Zz4=';

const ShoppingCart = () => {
    const { toast } = useToast();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { formatFromUsdCents, market } = useCurrency();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener('saturna:open-cart', handler);
        return () => window.removeEventListener('saturna:open-cart', handler);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const checkout = params.get('checkout');
        if (!checkout) return;
        if (checkout === 'success') clearCart();
        params.delete('checkout');
        const newSearch = params.toString();
        const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}${window.location.hash}`;
        window.history.replaceState({}, '', newUrl);
    }, [clearCart]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const handleCheckout = useCallback(async () => {
        if (cartItems.length === 0) {
            toast({ title: 'El carrito está vacío', description: 'Añada piezas antes de finalizar.', variant: 'destructive' });
            return;
        }
        try {
            const items = cartItems.map((item) => ({ variant_id: item.variant.id, quantity: item.quantity }));
            const successUrl = `${window.location.origin}/?checkout=success`;
            const cancelUrl = `${window.location.href}${window.location.search ? '&' : '?'}checkout=cancel`;
            const locale = REGION_META[market?.id]?.checkoutLocale || 'en';
            const { url } = await initializeCheckout({ items, successUrl, cancelUrl, locale });
            window.location.href = url;
        } catch (error) {
            toast({ title: 'Error en el pago', description: 'No se pudo iniciar el pago. Intente de nuevo.', variant: 'destructive' });
        }
    }, [cartItems, toast, market]);

    const count = cartItems.reduce((n, i) => n + i.quantity, 0);

    return (
        <>
            {/* floating trigger */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center border border-black bg-white text-black backdrop-blur-md transition-colors hover:bg-black hover:text-white active:scale-95"
                aria-label="Abrir carrito"
            >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {count > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center bg-[#5A1825] text-[10px] font-bold text-white">
                        {count}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-black/10 bg-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-6 py-6">
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#5A1825]">Su Compra</p>
                                    <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight text-black">Carrito</h2>
                                </div>
                                <button onClick={() => setOpen(false)} className="p-2 text-neutral-500 transition-colors hover:text-black" aria-label="Cerrar">
                                    <X className="h-5 w-5" strokeWidth={1.5} />
                                </button>
                            </div>
                            <div className="h-px w-full bg-black/10" />

                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                {cartItems.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                        <ShoppingBag className="mb-5 h-10 w-10 text-neutral-300" strokeWidth={1.5} />
                                        <p className="font-display text-xl font-semibold uppercase tracking-tight text-black">Vacío</p>
                                        <p className="mt-2 max-w-xs text-sm font-light text-neutral-500">
                                            Aún no ha elegido ninguna pieza. Explore la boutique para comenzar.
                                        </p>
                                        <button
                                            onClick={() => setOpen(false)}
                                            className="mt-6 border border-black bg-black px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-neutral-800"
                                        >
                                            Explorar la Tienda
                                        </button>
                                    </div>
                                ) : (
                                    <ul className="space-y-6">
                                        {cartItems.map((item) => (
                                            <li key={item.variant.id} className="flex gap-4">
                                                <img
                                                    src={item.product.image || placeholderImage}
                                                    alt={item.product.title}
                                                    className="h-28 w-20 flex-shrink-0 border border-black/10 object-cover"
                                                    onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) return; t.dataset.fallback = '1'; t.src = placeholderImage; }}
                                                />
                                                <div className="flex flex-1 flex-col">
                                                    <h3 className="font-display text-base font-semibold uppercase tracking-tight text-black">{item.product.title}</h3>
                                                    {item.variant.title && <p className="mt-0.5 text-xs font-light text-neutral-500">{item.variant.title}</p>}
                                                    <p className="mt-1 font-display text-sm font-semibold text-[#5A1825]">
                                                        {formatFromUsdCents(
                                                            item.variant.sale_price_in_cents ?? item.variant.price_in_cents,
                                                        )}
                                                    </p>
                                                    <div className="mt-auto flex items-center justify-between pt-3">
                                                        <div className="flex items-center border border-black/15">
                                                            <button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} className="px-2.5 py-1.5 text-neutral-500 transition-colors hover:text-black" aria-label="Restar">
                                                                <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                                                            </button>
                                                            <span className="w-8 text-center text-sm text-black">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} className="px-2.5 py-1.5 text-neutral-500 transition-colors hover:text-black" aria-label="Sumar">
                                                                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                                                            </button>
                                                        </div>
                                                        <button onClick={() => removeFromCart(item.variant.id)} className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-[#5A1825]">
                                                            Quitar
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {cartItems.length > 0 && (
                                <div className="border-t border-black/10 px-6 py-6">
                                    <div className="mb-5 border border-black/10 bg-[#F7F5F0] p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#5A1825]">
                                                Mercado activo
                                            </span>
                                            <span className="font-display text-sm font-semibold uppercase tracking-tight text-black">
                                                {market.flag} {market.label} · {market.currency.code}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-[11px] font-light leading-relaxed text-neutral-500">
                                            {market.shipping}
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {market.paymentMethods.map((m) => (
                                                <span
                                                    key={m}
                                                    className="border border-black/10 bg-white px-2 py-1 text-[9px] font-medium uppercase tracking-[0.15em] text-neutral-600"
                                                >
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="mt-3 text-[9px] font-light italic leading-relaxed text-neutral-400">
                                            {market.legalNote}
                                        </p>
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-500">Total</span>
                                        <span className="font-display text-2xl font-bold text-black">{getCartTotal()}</span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className="group mt-5 flex w-full items-center justify-center gap-3 border border-black bg-black px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#5A1825] hover:border-[#5A1825] active:scale-[0.98]"
                                    >
                                        Finalizar Compra
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ShoppingCart;
