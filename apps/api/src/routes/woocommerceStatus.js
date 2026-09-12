import { isIntegrationConfigured } from "../utils/integrationConfig.js";

/**
 * GET /woocommerce/status
 *
 * Devuelve el estado de configuración de la integración con WooCommerce
 * SIN exponer ninguna clave. El panel de administración del sitio lo usa
 * para mostrar si la sincronización está lista o pendiente de configurar.
 *
 * Las claves (WC_STORE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET) son
 * secretos que aporta el usuario en apps/api/.env. Si faltan, se reporta
 * un estado "no configurado" (503 con marcador INTEGRATION_NOT_CONFIGURED)
 * para que la UI muestre un estado de repliegue claro, no un error 500.
 */

function maskStoreUrl(url) {
    if (!url) return null;
    try {
        const u = new URL(url);
        return `${u.protocol}//${u.host}`;
    } catch {
        return null;
    }
}

export default (req, res) => {
    const configured = isIntegrationConfigured(
        "WC_STORE_URL",
        "WC_CONSUMER_KEY",
        "WC_CONSUMER_SECRET",
    );

    if (!configured) {
        return res.status(503).json({
            configured: false,
            storeUrl: null,
            apiVersion: process.env.WC_API_VERSION || "wc/v3",
            message:
                "WooCommerce no está configurado. Añade WC_STORE_URL, WC_CONSUMER_KEY y WC_CONSUMER_SECRET en apps/api/.env para habilitar la sincronización.",
        });
    }

    return res.json({
        configured: true,
        storeUrl: maskStoreUrl(process.env.WC_STORE_URL),
        apiVersion: process.env.WC_API_VERSION || "wc/v3",
    });
};
