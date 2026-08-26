import axios from 'axios';
import { supabase } from './supabaseClient';

const API_BASE_URL = '/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    async (config) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                config.headers.Authorization = `Bearer ${session.access_token}`;
            }
        } catch (error) {
            console.error('Error getting session for API request:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle aborted requests gracefully
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't log AbortError as it's expected when components unmount
        if (error.name === 'AbortError' || error.code === 'ERR_CANCELED' || error.message === 'canceled') {
            // Silently handle aborted requests
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export const farmerApi = {
    getDashboard: (email) => api.get(`/farmer/dashboard/${email}`),
    getCrops: (email) => api.get(`/farmer/crops/${email}`),
    getOrders: (email) => api.get(`/farmer/orders/${email}`),
    getPayments: (email) => api.get(`/farmer/payments/${email}`),
    getProfile: (email) => api.get(`/farmer/profile/${email}`),
    updateProfile: (email, data) => api.put(`/farmer/profile/${email}`, data),
    updateOrderStatus: (orderId, statusData) => api.put(`/farmer/orders/${orderId}/status`, statusData),
    getReports: (email) => api.get(`/farmer/reports/${email}`),
};

export const aggregatorApi = {
    getDashboard: () => api.get('/aggregator/dashboard'),
    getAvailableCrops: () => api.get('/aggregator/available-crops'),
    getMyCollections: () => api.get('/aggregator/my-collections'),
    getRetailerListings: () => api.get('/aggregator/retailer-listings'),
    getCollections: (params) => api.get('/aggregator/collections', { params }),
    getCollectionDetails: (id) => api.get(`/aggregator/collections/${id}`),
    scanQR: (data) => api.post('/aggregator/scan-qr', data),
    collectCrop: (data) => api.post('/aggregator/collect-crop', data),
    getAnalytics: () => api.get('/aggregator/analytics'),
    getTrace: (id) => api.get(`/aggregator/trace/${id}`),
    listCollection: (data) => api.post('/aggregator/list-collection', data),
    placeOrder: (data) => api.post('/orders/aggregator/place-order', data),
};

export const blockchainApi = {
    linkWallet: (address) => api.post('/blockchain/link-wallet', { walletAddress: address }),
    getStatus: (produceId) => api.get(`/blockchain/status/${produceId}`),
    getJourney: (produceId) => api.get(`/blockchain/journey/${produceId}`),
    startJourney: (data) => api.post('/blockchain/journey/start', data),
    updateJourney: (data) => api.post('/blockchain/journey/update', data),
    releaseEscrow: (produceId, receiverAddress) => api.post('/blockchain/escrow/release', { produceId, receiverAddress }),
    getDemoStatus: () => api.get('/blockchain/demo-status'),
    getDemoProduce: (produceId) => api.get(`/blockchain/demo/produce/${produceId}`),
};



export const retailerApi = {
    getDashboard: () => api.get('/retailer/dashboard'),
    getMarketplace: (params) => api.get('/retailer/marketplace', { params }),
    placeOrder: (data) => api.post('/retailer/order', data),
    getOrders: () => api.get('/retailer/orders'),
    traceProduct: (id) => api.get(`/retailer/trace/${id}`),
};

export const cropApi = {
    upload: (data) => api.post('/crops/upload', data),
    update: (id, data) => api.put(`/crops/${id}`, data),
    delete: (id) => api.delete(`/crops/${id}`),
    getMarketplace: (params) => api.get('/crops/marketplace', { params }),
    getDetails: (id) => api.get(`/crops/${id}`),
};

export const orderApi = {
    create: (data) => api.post('/orders', data),
    getFarmerOrders: (email) => api.get(`/orders/farmer/${email}`),
    getFarmerStats: (email) => api.get(`/orders/farmer/${email}/stats`),
    updateStatus: (orderId, data) => api.put(`/orders/${orderId}/status`, data),
    getDetails: (id) => api.get(`/orders/${id}`),
};

export const aiQualityApi = {
    analyze: (formData) => api.post('/ai-quality/analyze-quality', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
};

export const mlApi = {
    predictPrice: (data) => api.post('/ml/predict-price', data),
    getAdvisory: (data) => api.post('/ml/advisory', data),
    getTrainedPrediction: (data) => api.post('/ml/trained-predict', data),
    getTrainedQuality: (data) => api.post('/ml/trained-quality', data),
    getTrainedSignals: (data) => api.post('/ml/trained-signals', data),
    analyzeImageQuality: (formData) => api.post('/ml/image-quality', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const uploadApi = {
    uploadImage: (formData) => api.post('/upload/crop-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
};

export const pricingApi = {
    getRealTimePrice: (crop, location) => api.get(`/pricing/real-time/${crop}?location=${encodeURIComponent(location)}`),
    getMarketData: (location) => api.get(`/pricing/market-data?location=${encodeURIComponent(location)}`),
    getHistoricalData: (crop, days) => api.get(`/pricing/historical/${crop}?days=${days}`),
    trainModel: () => api.post('/pricing/train-model'),
};

export default api;
