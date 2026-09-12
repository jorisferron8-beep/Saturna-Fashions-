import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
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
import CollectionPage from './pages/CollectionPage';
import LookbookPage from './pages/LookbookPage';
import LookDetailPage from './pages/LookDetailPage';
import PiecePage from './pages/PiecePage';
import ChristmasPage from './pages/ChristmasPage';
import { CartProvider } from './hooks/useCart';
import { CurrencyProvider } from './context/CurrencyContext';
import ShoppingCart from './components/ShoppingCart';
import CookieConsent from './components/CookieConsent';

function App() {
    return (
        <CurrencyProvider>
            <CartProvider>
                <Router>
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
                        <Route path="/collections/:slug" element={<CollectionPage />} />
                        <Route path="/looks" element={<LookbookPage />} />
                        <Route path="/looks/:slug" element={<LookDetailPage />} />
                        <Route path="/piece/:sku" element={<PiecePage />} />
                        <Route path="/christmas" element={<ChristmasPage />} />
                    </Routes>
                    <ShoppingCart />
                    <CookieConsent />
                </Router>
            </CartProvider>
        </CurrencyProvider>
    );
}

export default App;
