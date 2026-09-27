import React from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import EleganciaPage from './pages/EleganciaPage';
import AboutPage from './pages/AboutPage';
import GeoMarketAdminPage from './pages/GeoMarketAdminPage';
import WooSyncAdminPage from './pages/WooSyncAdminPage';
import ChinaBoutiquePage from './pages/ChinaBoutiquePage';
import LegalPage from './pages/LegalPage';
import RegionalBoutiquePage from './pages/RegionalBoutiquePage';
import { CartProvider } from './hooks/useCart';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import ShoppingCart from './components/ShoppingCart';
import CookieConsent from './components/CookieConsent';
import ProtectedRoute from './components/extranet/ProtectedRoute';
import ExtranetLayout from './components/extranet/ExtranetLayout';
import LoginPage from './pages/extranet/LoginPage';
import DashboardPage from './pages/extranet/DashboardPage';
import UnauthorizedPage from './pages/extranet/UnauthorizedPage';

const EXTRANET_PATHS = ['/login', '/403', '/dashboard'];

/** Storefront-only chrome (cart, cookie banner) — never rendered over the Extranet. */
function StorefrontChrome() {
    const location = useLocation();
    const isExtranet = EXTRANET_PATHS.some(
        (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    );

    if (isExtranet) return null;

    return (
        <>
            <ShoppingCart />
            <CookieConsent />
        </>
    );
}

function App() {
    return (
        <CurrencyProvider>
            <CartProvider>
                <Router>
                    <AuthProvider>
                        <ScrollToTop />
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/store" element={<StorePage />} />
                            <Route path="/elegancia" element={<EleganciaPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/a-propos" element={<AboutPage />} />
                            <Route path="/product/:id" element={<ProductDetailPage />} />
                            <Route path="/admin/geo-market" element={<GeoMarketAdminPage />} />
                            <Route path="/admin/sync" element={<WooSyncAdminPage />} />
                            <Route path="/cn" element={<ChinaBoutiquePage />} />
                            <Route path="/us" element={<RegionalBoutiquePage marketId="US" />} />
                            <Route path="/co" element={<RegionalBoutiquePage marketId="CO" />} />
                            <Route path="/hk" element={<RegionalBoutiquePage marketId="HK" />} />
                            <Route path="/legal" element={<LegalPage />} />

                            {/* SWU-VISION Extranet */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/403" element={<UnauthorizedPage />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <ExtranetLayout>
                                            <DashboardPage />
                                        </ExtranetLayout>
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                        <StorefrontChrome />
                    </AuthProvider>
                </Router>
            </CartProvider>
        </CurrencyProvider>
    );
}

export default App;
