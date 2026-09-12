import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import LaceDivider from '@/components/LaceDivider';
import { CurrencySelector, useCurrency } from '@/context/CurrencyContext';
import Seo from '@/components/Seo';
import { SATURNA_LOGO, SATURNA_OG_IMAGE } from '@/lib/brand';

const placeholderImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWMxYjIwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U0FUVVJOQTwvdGV4dD48L3N2Zz4=';

function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { addToCart } = useCart();
    const { toast } = useToast();
    const { formatFromUsdCents } = useCurrency();

    const handleAddToCart = useCallback(async () => {
        if (product && selectedVariant) {
            try {
                await addToCart(product, selectedVariant, quantity, selectedVariant.inventory_quantity);
                toast({ title: 'Añadido al carrito', description: `${quantity} × ${product.title} (${selectedVariant.title}).` });
            } catch (err) {
                toast({ variant: 'destructive', title: 'No se pudo añadir', description: err.message });
            }
        }
    }, [product, selectedVariant, quantity, addToCart, toast]);

    const handleQuantityChange = useCallback((amount) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    }, []);

    const handlePrevImage = useCallback(() => {
        if (product?.images?.length > 1) {
            setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
        }
    }, [product?.images?.length]);

    const handleNextImage = useCallback(() => {
        if (product?.images?.length > 1) {
            setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
        }
    }, [product?.images?.length]);

    const handleVariantSelect = useCallback((variant) => {
        setSelectedVariant(variant);
        if (variant.image_url && product?.images?.length > 0) {
            const idx = product.images.findIndex((image) => image.url === variant.image_url);
            if (idx !== -1) setCurrentImageIndex(idx);
        }
    }, [product?.images]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedProduct = await getProduct(id);
                try {
                    const qtyRes = await getProductQuantities({ fields: 'inventory_quantity', product_ids: [fetchedProduct.id] });
                    const map = new Map();
                    qtyRes.variants.forEach((v) => map.set(v.id, v.inventory_quantity));
                    const merged = {
                        ...fetchedProduct,
                        variants: fetchedProduct.variants.map((v) => ({ ...v, inventory_quantity: map.get(v.id) ?? v.inventory_quantity })),
                    };
                    setProduct(merged);
                    if (merged.variants?.length) setSelectedVariant(merged.variants[0]);
                } catch (_) {
                    setProduct(fetchedProduct);
                    if (fetchedProduct.variants?.length) setSelectedVariant(fetchedProduct.variants[0]);
                }
            } catch (err) {
                setError(err.message || 'No se pudo cargar la pieza');
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F5F0]">
                <Loader2 className="h-8 w-8 animate-spin text-violet-bright" strokeWidth={1.5} />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#F7F5F0] px-5 py-32 text-black">
                <div className="mx-auto max-w-md text-center">
                    <XCircle className="mx-auto mb-4 h-10 w-10 text-[#5A1825]" strokeWidth={1.5} />
                    <p className="text-sm font-light text-neutral-500">{error}</p>
                    <Link to="/store" className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-black hover:text-[#5A1825]">
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const price = selectedVariant
        ? formatFromUsdCents(selectedVariant.sale_price_in_cents ?? selectedVariant.price_in_cents)
        : null;
    const originalPrice = selectedVariant ? formatFromUsdCents(selectedVariant.price_in_cents) : null;
    const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
    const isStockManaged = selectedVariant?.manage_inventory ?? false;
    const canAddToCart = !isStockManaged || quantity <= availableStock;
    const currentImage = product.images[currentImageIndex];
    const hasMultipleImages = product.images.length > 1;

    return (
        <div className="min-h-screen bg-[#F7F5F0] font-body text-black antialiased">
            <Helmet>
                <title>{product.title} — SATURNA | Shop</title>
                <meta name="description" content={product.subtitle || product.title} />
                <html lang="en" />
                <link rel="icon" type="image/png" href={SATURNA_LOGO} />
            </Helmet>
            <Seo
                title={`${product.title} — SATURNA`}
                description={product.subtitle || product.title}
                image={SATURNA_OG_IMAGE}
                siteName="SATURNA"
            />

            <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#F7F5F0]/95 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
                    <Link to="/" className="flex items-center py-1" aria-label="SATURNA">
                        <img
                            src={SATURNA_LOGO}
                            alt="SATURNA"
                            className="h-9 w-auto max-w-[12rem] object-contain md:h-11 md:max-w-[15rem]"
                            decoding="async"
                        />
                    </Link>
                    <div className="flex items-center gap-4">
                        <CurrencySelector className="hidden sm:inline-flex" />
                        <Link
                            to="/store"
                            className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/70 transition-colors hover:text-black"
                        >
                            SHOP
                        </Link>
                        <Link
                            to="/about"
                            className="hidden text-[11px] font-semibold uppercase tracking-[0.25em] text-black/70 transition-colors hover:text-black sm:inline"
                        >
                            ABOUT
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 pt-28 md:px-8 md:pt-36">
                <Link to="/store" className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500 transition-colors hover:text-black">
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back to Shop
                </Link>

                <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
                    {/* gallery */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                        <div className="relative overflow-hidden border border-black/10 bg-neutral-200">
                            <img src={currentImage?.url || product.image || placeholderImage} alt={product.title} className="aspect-[3/4] w-full object-contain p-6" onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) return; t.dataset.fallback = '1'; t.src = placeholderImage; }} />
                            {hasMultipleImages && (
                                <>
                                    <button onClick={handlePrevImage} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-border bg-ink/70 text-paper backdrop-blur-sm transition-colors hover:bg-violet" aria-label="Anterior">
                                        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                                    </button>
                                    <button onClick={handleNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-border bg-ink/70 text-paper backdrop-blur-sm transition-colors hover:bg-violet" aria-label="Siguiente">
                                        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                                    </button>
                                </>
                            )}
                            {product.ribbon_text && (
                                <span className="absolute left-4 top-4 border border-violet-bright bg-violet/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-paper">{product.ribbon_text}</span>
                            )}
                        </div>
                        {hasMultipleImages && (
                            <div className="mt-4 flex gap-3 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 h-20 w-16 overflow-hidden border transition-colors ${index === currentImageIndex ? 'border-violet-bright' : 'border-border hover:border-silver'}`}>
                                        <img src={image.url || placeholderImage} alt={`${product.title} ${index + 1}`} className="h-full w-full object-contain p-1" onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) return; t.dataset.fallback = '1'; t.src = placeholderImage; }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* info */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col">
                        <p className="mb-3 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.4em] text-[#5A1825]">
                            <span className="inline-block h-px w-10 bg-[#5A1825]" />
                            SATURNA ATELIER
                        </p>
                        <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-black md:text-5xl">{product.title}</h1>
                        {product.subtitle && <p className="mt-3 text-base font-light text-neutral-500">{product.subtitle}</p>}

                        <div className="mt-6 flex items-baseline gap-3">
                            <span className="font-display text-3xl font-bold text-black">{price}</span>
                            {selectedVariant?.sale_price_in_cents && <span className="text-lg font-light text-neutral-400 line-through">{originalPrice}</span>}
                        </div>

                        {product.description && (
                            <div className="mt-8 max-w-lg text-sm font-light leading-relaxed text-neutral-600 [&_a]:text-[#5A1825]" dangerouslySetInnerHTML={{ __html: product.description }} />
                        )}

                        {product.additional_info?.length > 0 && (
                            <div className="mt-8 space-y-5 border-l border-violet/40 pl-5">
                                {product.additional_info.slice().sort((a, b) => a.order - b.order).map((info) => (
                                    <div key={info.id}>
                                        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-paper">{info.title}</h3>
                                        <div className="mt-1.5 text-sm font-light leading-relaxed text-smoke [&_a]:text-violet-bright" dangerouslySetInnerHTML={{ __html: info.description }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {product.variants.length > 1 && (
                            <div className="mt-8">
                                <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-smoke">Estilo</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => handleVariantSelect(variant)}
                                            className={`border px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${selectedVariant?.id === variant.id ? 'border-black bg-black text-white' : 'border-black/15 text-neutral-600 hover:border-black hover:text-black'}`}
                                        >
                                            {variant.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex items-center gap-5">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-smoke">Cantidad</span>
                            <div className="flex items-center border border-border">
                                <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2.5 text-silver transition-colors hover:text-paper" aria-label="Restar"><Minus className="h-4 w-4" strokeWidth={1.5} /></button>
                                <span className="w-10 text-center font-display text-base font-semibold text-paper">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} className="px-3 py-2.5 text-silver transition-colors hover:text-paper" aria-label="Sumar"><Plus className="h-4 w-4" strokeWidth={1.5} /></button>
                            </div>
                        </div>

                        <div className="mt-10">
                            <button
                                onClick={handleAddToCart}
                                disabled={!canAddToCart || !product.purchasable}
                                className="group flex w-full items-center justify-center gap-3 border border-black bg-black px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:border-[#5A1825] hover:bg-[#5A1825] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} /> ADD TO BAG
                            </button>

                            {isStockManaged && canAddToCart && product.purchasable && (
                                <p className="mt-3 flex items-center justify-center gap-2 text-[11px] font-light uppercase tracking-[0.2em] text-silver">
                                    <CheckCircle className="h-4 w-4 text-violet-bright" strokeWidth={1.5} /> {availableStock} disponibles
                                </p>
                            )}
                            {isStockManaged && !canAddToCart && product.purchasable && (
                                <p className="mt-3 flex items-center justify-center gap-2 text-[11px] font-light uppercase tracking-[0.2em] text-smoke">
                                    <XCircle className="h-4 w-4" strokeWidth={1.5} /> Stock insuficiente — solo {availableStock}
                                </p>
                            )}
                            {!product.purchasable && (
                                <p className="mt-3 flex items-center justify-center gap-2 text-[11px] font-light uppercase tracking-[0.2em] text-smoke">
                                    <XCircle className="h-4 w-4" strokeWidth={1.5} /> No disponible
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>

                <div className="mt-24">
                    <p className="mb-6 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-violet-bright">
                        Universo SATURNA
                    </p>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        {[
                            'https://images.hostinger.com/94a542e9-f759-4102-976a-51c39043c9d6.png',
                            'https://images.hostinger.com/8b6de5fc-ae64-4969-a21e-d7b85187ba3f.png',
                            'https://images.hostinger.com/6679c5ff-6ce5-451d-8642-f60f9fb7b116.png',
                            'https://images.hostinger.com/3e66a618-ff32-4bb8-bdc7-7f11da83e8df.jpg',
                        ].map((src) => (
                            <div key={src} className="overflow-hidden border border-border bg-charcoal">
                                <img src={src} alt="Campaña SATURNA" className="aspect-[3/4] w-full object-cover" loading="lazy" />
                            </div>
                        ))}
                    </div>
                    <LaceDivider />
                    <div className="py-12 text-center">
                        <Link to="/store" className="group inline-flex items-center gap-3 border-b border-black pb-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-black transition-colors hover:text-[#5A1825]">
                            VIEW SHOP
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;
