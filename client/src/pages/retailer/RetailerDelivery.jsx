import React, { useState } from "react";
import { RetailerLayout } from "../../components/retailer/RetailerLayout";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { 
  MapPin, Package, Truck, CheckCircle2, 
  ChevronLeft, ShieldCheck, Sparkles
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import IoTSensorTelemetry from "../../components/common/IoTSensorTelemetry";

export default function RetailerDelivery() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order') || 'ORD-9824';

  const [loading, setLoading] = useState(false);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

  const order = {
    id: orderId,
    order_id: orderId,
    crop: { name: 'Grade A Farm Tomatoes', variety: 'Hybrid Table', category: 'Vegetables' },
    quantity: 500,
    unit: 'KG',
    price_per_unit: 34,
    buyer_name: 'Kavitha Agro Traders (Coimbatore)',
    retailer_name: 'FreshMart Supermarkets (R.S. Puram)',
    farmer_origin: 'Kinathukadavu Mandi, Coimbatore',
    status: deliveryConfirmed ? 'delivered' : 'in_transit',
    created_at: new Date().toISOString(),
    delivery_address: 'No. 42, Cross Cut Road, Gandhipuram, Coimbatore - 641012'
  };

  const steps = [
    { label: "AI Quality & Price Auction Won", detail: `Won by ${order.buyer_name} at ₹${order.price_per_unit}/KG`, icon: Sparkles, done: true },
    { label: "Produce Dispatched from Mandi", detail: `Origin: ${order.farmer_origin}`, icon: Package, done: true },
    { label: "IoT ESP32 Cold-Chain Transit", detail: "Active DHT22 Temp & Humidity monitoring", icon: Truck, done: true },
    { label: "Terminal Receipt & Verification", detail: `Destination: ${order.delivery_address}`, icon: MapPin, done: deliveryConfirmed },
  ];

  const handleConfirmArrival = () => {
    setDeliveryConfirmed(true);
  };

  return (
    <RetailerLayout>
      <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/retailer/orders')} 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-600 transition"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Orders
            </button>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              IoT Shipment & Cold-Chain Audit
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              Live ESP32 + DHT22 environmental condition telemetry between buyer and retailer terminal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={deliveryConfirmed ? 'Delivered' : 'In Transit'} />
          </div>
        </div>

        {/* Order Identifier Banner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consignment Code</span>
            <h3 className="text-xl font-black text-slate-900">{order.order_id}</h3>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              Cargo: {order.crop.name} · Payload: {order.quantity} {order.unit}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono font-bold text-slate-700">IoT GPS: 10.9982° N, 76.9628° E (Coimbatore Bypass)</span>
          </div>
        </div>

        {/* Live ESP32 + DHT22 Telemetry Module */}
        <IoTSensorTelemetry
          cropName={order.crop.name}
          containerId="ESP32-DHT22-LOGISTICS-01"
          tempThreshold={{ min: 16, max: 28, optimal: 22 }}
          humidityThreshold={{ min: 55, max: 78, optimal: 65 }}
          isLive={true}
        />

        {/* Transit Timeline & Terminal Receipt Console */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Audit Sequence */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Transit Audit Sequence
            </h4>

            <div className="space-y-6 relative pl-6 border-l-2 border-slate-100 ml-3">
              {steps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[31px] top-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    step.done ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div className="pl-3">
                    <p className={`text-sm font-bold uppercase tracking-tight ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal Protocol & Delivery Confirmation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Retailer Terminal Protocol
              </h4>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600 mb-6">
                <p className="font-bold text-slate-900">Delivery Address:</p>
                <p>{order.delivery_address}</p>
                <div className="pt-2 border-t border-slate-200/60 flex justify-between font-semibold text-slate-700">
                  <span>Logistics Carrier:</span>
                  <span className="text-emerald-700">AgriLink Express (TR-99-AF-2026)</span>
                </div>
              </div>
            </div>

            {deliveryConfirmed ? (
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-emerald-900">Consignment Confirmed Received!</h4>
                <p className="text-xs text-emerald-700">
                  Temperature & humidity compliance verified. Transaction marked as completed.
                </p>
              </div>
            ) : (
              <button
                onClick={handleConfirmArrival}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Confirm Terminal Arrival & Quality Verification
              </button>
            )}

          </div>

        </div>

      </div>
    </RetailerLayout>
  );
}
