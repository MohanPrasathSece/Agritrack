import React, { useState, useEffect } from 'react';
import { Link2, CheckCircle, Loader2, AlertCircle, Activity, Wallet, Layers, ArrowRight, RefreshCw } from 'lucide-react';
import { blockchainApi } from '../../utils/api';

export default function BlockchainDemo() {
  const [status, setStatus] = useState(null);
  const [produceId, setProduceId] = useState('');
  const [produce, setProduce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingProduce, setFetchingProduce] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await blockchainApi.getDemoStatus();
      if (res.data?.success) setStatus(res.data.data);
    } catch (err) {
      setStatus({ connected: false, demoMode: true, message: 'Unable to reach blockchain node.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchProduce = async () => {
    const id = parseInt(produceId, 10);
    if (isNaN(id) || id < 1) return;
    try {
      setFetchingProduce(true);
      const res = await blockchainApi.getDemoProduce(id);
      if (res.data?.success) setProduce(res.data.data);
      else setProduce(null);
    } catch (err) {
      setProduce(null);
    } finally {
      setFetchingProduce(false);
    }
  };

  const steps = [
    { label: 'Farmer harvests crop', desc: 'Crop registered on blockchain' },
    { label: 'Aggregator collects', desc: 'Quality grade & status updated' },
    { label: 'Retailer orders', desc: 'Escrow payment processed' },
    { label: 'Delivery complete', desc: 'Funds released to farmer' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Blockchain System</h1>
        <p className="text-slate-500 mt-1">Complete transaction flow — no wallet connection required.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          {/* Status Card */}
          <div className={`rounded-2xl border p-6 ${status?.connected ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${status?.connected ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                {status?.connected ? <CheckCircle className="h-6 w-6 text-emerald-600" /> : <AlertCircle className="h-6 w-6 text-amber-600" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  {status?.connected ? 'Blockchain Connected' : 'Blockchain Node Offline'}
                </h3>
                <p className="text-sm text-slate-600 mt-1">{status?.message}</p>
                {status?.connected && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Network</p>
                      <p className="font-medium text-slate-900">{status?.network || 'Local'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Block</p>
                      <p className="font-medium text-slate-900">{status?.blockNumber ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Wallet Balance</p>
                      <p className="font-medium text-slate-900">{status?.balanceEth ?? '-'} ETH</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Produce Count</p>
                      <p className="font-medium text-slate-900">{status?.currentProduceId ?? '-'}</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={fetchStatus}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Flow */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="font-semibold text-slate-900 mb-6">Transaction Flow</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-6 relative">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-medium text-slate-900">{step.label}</p>
                      <p className="text-sm text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lookup Produce */}
          {status?.connected && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="font-semibold text-slate-900 mb-4">Lookup Produce on Blockchain</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="number"
                  min="1"
                  placeholder="Enter produce ID"
                  value={produceId}
                  onChange={(e) => setProduceId(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
                <button
                  onClick={fetchProduce}
                  disabled={fetchingProduce || !produceId}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {fetchingProduce ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                  Lookup
                </button>
              </div>
              {produce && (
                <div className="mt-6 p-6 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <p><span className="text-slate-500">Crop:</span> {produce.cropType}</p>
                  <p><span className="text-slate-500">Quantity:</span> {produce.quantity} kg</p>
                  <p><span className="text-slate-500">Grade:</span> {produce.grade}</p>
                  <p><span className="text-slate-500">Status:</span> {produce.status}</p>
                  <p className="text-xs text-slate-400 font-mono truncate">{produce.farmer}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
