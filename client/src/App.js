import React, { Suspense, lazy, Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GoogleTranslate from './components/GoogleTranslate';
import { FarmerLayout } from './components/farmer/FarmerLayout';
import { AggregatorLayout } from './components/aggregator/AggregatorLayout';
import { RetailerLayout } from './components/retailer/RetailerLayout';
import { ConsumerLayout } from './components/consumer/ConsumerLayout';


// Core Modules
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RoleSelection from './pages/auth/RoleSelection';
import Dashboard from './pages/Dashboard';
import QRScanner from './pages/QRScanner';
import TraceProduct from './pages/TraceProduct';
import TracePage from './pages/TracePage';
import CropDetails from './pages/CropDetails';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/auth/AuthCallback';

// Dashboard Pages (Directly imported for speed)
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MyCrops from './pages/farmer/MyCrops';
import RetailerDashboard from './pages/retailer/RetailerDashboard';
import AggregatorDashboard from './pages/aggregator/AggregatorDashboard';

// Error Boundary to filter AbortError
class AppAbortErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    if (error.name === 'AbortError') {
      return { hasError: false };
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (error.name !== 'AbortError') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-4">Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy Loaded Sub-pages
const CropUpload = lazy(() => import('./pages/farmer/CropUpload'));
const FarmerOrders = lazy(() => import('./pages/farmer/Orders'));
const FarmerPayments = lazy(() => import('./pages/farmer/Payments'));
const FarmerProfile = lazy(() => import('./pages/farmer/Profile'));
const FarmerReports = lazy(() => import('./pages/farmer/Reports'));
const FarmerSettings = lazy(() => import('./pages/farmer/Settings'));
const AIInsights = lazy(() => import('./pages/farmer/AIInsights'));
const TrainedInsights = lazy(() => import('./pages/farmer/TrainedInsights'));

const RetailerMarketplace = lazy(() => import('./pages/retailer/RetailerMarketplace'));
const RetailerOrders = lazy(() => import('./pages/retailer/RetailerOrders'));
const RetailerPayments = lazy(() => import('./pages/retailer/RetailerPayments'));
const RetailerProfile = lazy(() => import('./pages/retailer/RetailerProfile'));
const RetailerDelivery = lazy(() => import('./pages/retailer/RetailerDelivery'));

const AggregatorCollections = lazy(() => import('./pages/aggregator/AggregatorCollections'));
const AggregatorProfile = lazy(() => import('./pages/aggregator/AggregatorProfile'));
const CropCollection = lazy(() => import('./pages/aggregator/CropCollection'));
const AggregatorQRScanner = lazy(() => import('./pages/aggregator/AggregatorQRScanner'));
const AggregatorRetailerMarketplace = lazy(() => import('./pages/aggregator/RetailerMarketplace'));
const AggregatorRetailerOrders = lazy(() => import('./pages/aggregator/RetailerOrders'));
const MarketPredictions = lazy(() => import('./pages/aggregator/MarketPredictions'));
const AggregatorAnalytics = lazy(() => import('./pages/aggregator/AggregatorAnalytics'));
const RetailerTraceability = lazy(() => import('./pages/retailer/RetailerTraceability'));
const RetailerSettings = lazy(() => import('./pages/retailer/RetailerSettings'));
const ConsumerDashboard = lazy(() => import('./pages/consumer/ConsumerDashboard'));
const ConsumerMarketplace = lazy(() => import('./pages/consumer/ConsumerMarketplace'));
const BlockchainDemo = lazy(() => import('./pages/consumer/BlockchainDemo'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const PublicQRScanner = lazy(() => import('./pages/PublicQRScanner'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderQRLabel = lazy(() => import('./pages/OrderQRLabel'));


const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
  </div>
);

function App() {
  return (
    <AppAbortErrorBoundary>
      {/* Global Falling Leaves Effect */}

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/select-role" element={
            <ProtectedRoute>
              <RoleSelection />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/trace" element={<TraceProduct />} />
          <Route path="/qr" element={<QRScanner />} />
          <Route path="/scan-product" element={<PublicQRScanner />} />
          <Route path="/crop/:id" element={<CropDetails />} />
          <Route path="/order-qr/:id" element={<OrderQRLabel />} />

          {/* Farmer App */}
          <Route path="/farmer" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="upload" element={<CropUpload />} />
            <Route path="crops" element={<MyCrops />} />
            <Route path="orders" element={<FarmerOrders />} />
            <Route path="payments" element={<FarmerPayments />} />
            <Route path="profile" element={<FarmerProfile />} />
            <Route path="reports" element={<FarmerReports />} />
            <Route path="settings" element={<FarmerSettings />} />
            <Route path="ai-insights" element={<AIInsights />} />
            <Route path="trained-insights" element={<TrainedInsights />} />
          </Route>

          {/* Retailer App */}
          <Route path="/retailer" element={<ProtectedRoute allowedRoles={['retailer']}><RetailerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RetailerDashboard />} />
            <Route path="marketplace" element={<RetailerMarketplace />} />
            <Route path="orders" element={<RetailerOrders />} />
            <Route path="traceability" element={<RetailerTraceability />} />
            <Route path="payments" element={<RetailerPayments />} />
            <Route path="profile" element={<RetailerProfile />} />
            <Route path="delivery" element={<RetailerDelivery />} />
            <Route path="settings" element={<RetailerSettings />} />
          </Route>

          {/* Aggregator App */}
          <Route path="/aggregator" element={<ProtectedRoute allowedRoles={['aggregator']}><AggregatorLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AggregatorDashboard />} />
            <Route path="collections" element={<AggregatorCollections />} />
            <Route path="collect" element={<CropCollection />} />
            <Route path="retailer-marketplace" element={<AggregatorRetailerMarketplace />} />
            <Route path="retailer-orders" element={<AggregatorRetailerOrders />} />
            <Route path="profile" element={<AggregatorProfile />} />
            <Route path="scan-qr" element={<AggregatorQRScanner />} />
            <Route path="predictions" element={<MarketPredictions />} />
            <Route path="analytics" element={<AggregatorAnalytics />} />
          </Route>

          {/* Consumer App */}
          <Route path="/consumer" element={<ProtectedRoute allowedRoles={['consumer', 'admin']}><ConsumerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ConsumerDashboard />} />
            <Route path="marketplace" element={<ConsumerMarketplace />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="blockchain" element={<BlockchainDemo />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppAbortErrorBoundary>
  );
}

export default App;
