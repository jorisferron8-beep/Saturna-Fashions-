import { Router } from 'express';
import healthCheck from './health-check.js';
import woocommerceStatus from './woocommerceStatus.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.get('/woocommerce/status', woocommerceStatus);

    return router;
};

