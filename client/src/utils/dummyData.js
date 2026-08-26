// Dummy data utility for Agritrack
import { t } from './translation';

export const dummyProfiles = {
  farmer: {
    id: 'farmer-001',
    name: t('unknown'),
    email: 'farmer@agritrack.com',
    phone: t('notAvailable'),
    address: t('location') + ': ' + t('unknown'),
    role: 'farmer',
    is_active: true,
    created_at: new Date().toISOString()
  },
  aggregator: {
    id: 'aggregator-001',
    name: t('unknown'),
    email: 'aggregator@agritrack.com',
    phone: t('notAvailable'),
    address: t('location') + ': ' + t('unknown'),
    role: 'aggregator',
    is_active: true,
    created_at: new Date().toISOString()
  },
  retailer: {
    id: 'retailer-001',
    name: t('unknown'),
    email: 'retailer@agritrack.com',
    phone: t('notAvailable'),
    address: t('location') + ': ' + t('unknown'),
    role: 'retailer',
    is_active: true,
    created_at: new Date().toISOString()
  }
};

export const dummyCrops = [
  {
    id: 'crop-001',
    name: 'Basmati Rice',
    variety: 'Premium Basmati',
    category: 'Grains',
    quantity: 500,
    unit: 'kg',
    price_per_unit: 120,
    status: 'listed',
    is_active: true,
    is_organic: true,
    farm_location: { city: t('unknown'), state: t('unknown'), country: t('unknown') },
    images: [
      'https://images.unsplash.com/photo-1586201375761-8386502374a3?w=400'
    ],
    farmer: dummyProfiles.farmer,
    ai_analysis: {
      overallGrade: 'A',
      qualityScore: 92,
      summary: 'Premium quality basmati rice with excellent grain quality'
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'crop-002',
    name: 'Durum Wheat',
    variety: 'Hard Wheat',
    category: 'Grains',
    quantity: 750,
    unit: 'kg',
    price_per_unit: 85,
    status: 'listed',
    is_active: true,
    is_organic: false,
    farm_location: { city: t('unknown'), state: t('unknown'), country: t('unknown') },
    images: [
      'https://images.unsplash.com/photo-1598301166524-05359c4e5e0b?w=400'
    ],
    farmer: dummyProfiles.farmer,
    ai_analysis: {
      overallGrade: 'B+',
      qualityScore: 85,
      summary: 'Good quality durum wheat suitable for pasta making'
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'crop-003',
    name: 'Yellow Maize',
    variety: 'Sweet Corn',
    category: 'Vegetables',
    quantity: 300,
    unit: 'kg',
    price_per_unit: 45,
    status: 'listed',
    is_active: true,
    is_organic: true,
    farm_location: { city: t('unknown'), state: t('unknown'), country: t('unknown') },
    images: [
      'https://images.unsplash.com/photo-1586201375761-8386502374a3?w=400'
    ],
    farmer: dummyProfiles.farmer,
    ai_analysis: {
      overallGrade: 'A-',
      qualityScore: 88,
      summary: 'High quality sweet maize with good kernel development'
    },
    created_at: new Date().toISOString()
  }
];

export const dummyCollections = [
  {
    id: 'collection-001',
    cropName: 'Basmati Rice',
    quantity: 500,
    unit: 'kg',
    qualityGrade: 'A',
    purchasePrice: 120,
    collectionDate: new Date().toISOString(),
    farmer: dummyProfiles.farmer,
    status: 'collected',
    qualityAssessment: 'Premium quality rice verified and approved'
  },
  {
    id: 'collection-002',
    cropName: 'Durum Wheat',
    quantity: 750,
    unit: 'kg',
    qualityGrade: 'B+',
    purchasePrice: 85,
    collectionDate: new Date().toISOString(),
    farmer: dummyProfiles.farmer,
    status: 'collected',
    qualityAssessment: 'Good quality wheat suitable for processing'
  }
];

export const dummyListings = [
  {
    id: 'listing-001',
    cropName: 'Basmati Rice',
    grade: 'A',
    quantity: 500,
    unit: 'kg',
    price: 150,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1586201375761-8386502374a3?w=400']
  },
  {
    id: 'listing-002',
    cropName: 'Durum Wheat',
    grade: 'B+',
    quantity: 750,
    unit: 'kg',
    price: 110,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1598301166524-05359c4e5e0b?w=400']
  }
];

export const dummyOrders = [
  {
    id: 'order-001',
    order_id: 'ORD-001',
    crop_id: 'crop-001',
    seller_id: 'farmer-001',
    buyer_id: 'retailer-001',
    quantity: 100,
    unit: 'kg',
    total_amount: 12000,
    status: 'pending',
    payment_status: 'pending',
    created_at: new Date().toISOString(),
    crop: dummyCrops[0],
    seller: dummyProfiles.farmer,
    buyer: dummyProfiles.retailer
  },
  {
    id: 'order-002',
    order_id: 'ORD-002',
    crop_id: 'crop-002',
    seller_id: 'farmer-001',
    buyer_id: 'retailer-001',
    quantity: 200,
    unit: 'kg',
    total_amount: 17000,
    status: 'processing',
    payment_status: 'completed',
    created_at: new Date().toISOString(),
    crop: dummyCrops[1],
    seller: dummyProfiles.farmer,
    buyer: dummyProfiles.retailer
  }
];

export const dummyStats = {
  pendingCollections: 5,
  inventoryHeld: '2,450 kg',
  activeOrders: 12,
  revenue: '₹45.2L',
  marketSentiment: 'Bullish',
  retailers: 42,
  premiumQuality: 8,
  averagePrice: 95
};

export const dummyReports = [
  {
    id: 'report-001',
    cropId: 'crop-001',
    crop: 'Basmati Rice',
    variety: 'Premium Basmati',
    type: 'ai_analysis',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 7 days ago
    grade: 'A',
    score: 92,
    image: 'https://images.unsplash.com/photo-1586201375761-8386502374a3?w=400',
    details: {
      moisture: 12.5,
      purity: 98.2,
      grainLength: 7.2,
      aroma: 'Strong',
      appearance: 'Excellent',
      defects: 0.8,
      recommendations: [
        'Maintain current storage conditions',
        'Premium quality suitable for export',
        'Optimal moisture content for long-term storage'
      ],
      marketValue: 'Premium - 15% above market rate',
      shelfLife: '18 months',
      storageConditions: 'Cool, dry place below 25°C'
    }
  },
  {
    id: 'report-002',
    cropId: 'crop-002',
    crop: 'Durum Wheat',
    variety: 'Hard Wheat',
    type: 'ai_analysis',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 14 days ago
    grade: 'B+',
    score: 85,
    image: 'https://images.unsplash.com/photo-1598301166524-05359c4e5e0b?w=400',
    details: {
      moisture: 13.8,
      protein: 12.5,
      gluten: 28.5,
      hardness: 85,
      appearance: 'Good',
      defects: 2.1,
      recommendations: [
        'Consider drying to reduce moisture content',
        'Suitable for pasta and bread making',
        'Monitor for pest activity'
      ],
      marketValue: 'Standard market rate',
      shelfLife: '12 months',
      storageConditions: 'Airtight containers, low humidity'
    }
  },
  {
    id: 'report-003',
    cropId: 'crop-003',
    crop: 'Yellow Maize',
    variety: 'Sweet Corn',
    type: 'ai_analysis',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 3 days ago
    grade: 'A-',
    score: 88,
    image: 'https://images.unsplash.com/photo-1586201375761-8386502374a3?w=400',
    details: {
      moisture: 14.2,
      sugar: 6.8,
      kernelQuality: 90.5,
      color: 'Vibrant yellow',
      appearance: 'Excellent',
      defects: 1.2,
      recommendations: [
        'Ideal for fresh market sales',
        'High sugar content makes it premium',
        'Quick turnover recommended'
      ],
      marketValue: 'Premium - 10% above market rate',
      shelfLife: '6 months (fresh)',
      storageConditions: 'Refrigerated storage recommended'
    }
  },
  {
    id: 'report-004',
    cropId: 'crop-001',
    crop: 'Basmati Rice',
    variety: 'Premium Basmati',
    type: 'manual_check',
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 21 days ago
    grade: 'A',
    score: 94,
    image: 'https://images.unsplash.com/photo-1586201375761-8386502374a3?w=400',
    details: {
      moisture: 12.1,
      purity: 99.1,
      grainLength: 7.5,
      aroma: 'Exceptional',
      appearance: 'Outstanding',
      defects: 0.5,
      recommendations: [
        'Export quality grade',
        'Maintain current handling practices',
        'Premium pricing justified'
      ],
      marketValue: 'Export Premium - 20% above market',
      shelfLife: '24 months',
      storageConditions: 'Climate-controlled storage'
    }
  },
  {
    id: 'report-005',
    cropId: 'crop-002',
    crop: 'Durum Wheat',
    variety: 'Hard Wheat',
    type: 'manual_check',
    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 28 days ago
    grade: 'B',
    score: 82,
    image: 'https://images.unsplash.com/photo-1598301166524-05359c4e5e0b?w=400',
    details: {
      moisture: 14.5,
      protein: 11.8,
      gluten: 26.8,
      hardness: 82,
      appearance: 'Fair',
      defects: 3.2,
      recommendations: [
        'Quality improvement needed',
        'Consider blending with higher grade wheat',
        'Storage conditions optimization required'
      ],
      marketValue: 'Below market rate - 5% discount',
      shelfLife: '10 months',
      storageConditions: 'Improved ventilation needed'
    }
  }
];

export const dummyReportsSummary = {
  avgGrade: 'A-',
  avgScore: 87.2,
  totalAnalyzed: 5,
  gradeDistribution: {
    'A': 2,
    'A-': 1,
    'B+': 1,
    'B': 1
  },
  topPerformingCrop: 'Basmati Rice',
  improvementNeeded: 'Durum Wheat (last batch)',
  qualityTrend: 'Stable',
  lastAnalysis: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
};

export const getDummyReports = () => dummyReports;
export const getDummyReportsSummary = () => dummyReportsSummary;

export const dummyTraceData = {
  id: 'trace-001',
  batchId: 'BATCH-001',
  cropName: 'Basmati Rice',
  farmer: dummyProfiles.farmer,
  aggregator: dummyProfiles.aggregator,
  retailer: dummyProfiles.retailer,
  qualityChecks: [
    { date: new Date().toISOString(), grade: 'A', inspector: t('unknown'), notes: 'Premium quality verified' },
    { date: new Date().toISOString(), grade: 'A', inspector: t('unknown'), notes: 'Quality maintained' }
  ],
  journey: [
    { location: t('unknown'), date: new Date().toISOString(), event: 'Harvested' },
    { location: t('unknown'), date: new Date().toISOString(), event: 'Collected by Aggregator' },
    { location: t('unknown'), date: new Date().toISOString(), event: 'Processed' },
    { location: t('unknown'), date: new Date().toISOString(), event: 'Shipped to Retailer' }
  ]
};

// Utility functions
export const getDummyProfile = (role) => {
  return dummyProfiles[role] || dummyProfiles.farmer;
};

export const getDummyCrops = () => dummyCrops;

export const getDummyCollections = () => dummyCollections;

export const getDummyListings = () => dummyListings;

export const getDummyOrders = () => dummyOrders;

export const getDummyStats = () => dummyStats;

export const getDummyTraceData = (id) => dummyTraceData;

export const createDummyResponse = (data, success = true) => ({
  success,
  data,
  message: success ? 'Operation successful' : 'Operation failed'
});

const dummyDataExports = {
  dummyProfiles,
  dummyCrops,
  dummyCollections,
  dummyListings,
  dummyOrders,
  dummyStats,
  dummyTraceData,
  dummyReports,
  dummyReportsSummary,
  getDummyProfile,
  getDummyCrops,
  getDummyCollections,
  getDummyListings,
  getDummyOrders,
  getDummyStats,
  getDummyTraceData,
  getDummyReports,
  getDummyReportsSummary,
  createDummyResponse
};

export default dummyDataExports;
