import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Cpu, 
  Wifi, 
  RefreshCw,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export default function IoTSensorTelemetry({ 
  cropName = "Grade A Produce",
  containerId = "ESP32-DHT22-NODE-04",
  tempThreshold = { min: 16, max: 28, optimal: 22 },
  humidityThreshold = { min: 55, max: 80, optimal: 68 },
  isLive = true
}) {
  const [temperature, setTemperature] = useState(23.4);
  const [humidity, setHumidity] = useState(67.2);
  const [history, setHistory] = useState([
    { time: '10:00', temp: 22.1, humidity: 65.0, status: 'safe' },
    { time: '10:15', temp: 22.8, humidity: 66.4, status: 'safe' },
    { time: '10:30', temp: 23.2, humidity: 67.0, status: 'safe' },
    { time: '10:45', temp: 23.4, humidity: 67.2, status: 'safe' },
  ]);
  const [simulatedBreach, setSimulatedBreach] = useState(false);
  const [lastSync, setLastSync] = useState('Just now');

  // Real-time telemetry simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      if (simulatedBreach) {
        // High temp breach
        const newTemp = +(31.5 + Math.random() * 2.5).toFixed(1);
        const newHum = +(84.0 + Math.random() * 3).toFixed(1);
        setTemperature(newTemp);
        setHumidity(newHum);
        setHistory(prev => [
          ...prev.slice(-7),
          { time: timeStr, temp: newTemp, humidity: newHum, status: 'breach' }
        ]);
      } else {
        // Normal fluctuations
        const deltaT = (Math.random() - 0.5) * 0.4;
        const deltaH = (Math.random() - 0.5) * 0.8;
        const newTemp = +Math.max(18, Math.min(26, temperature + deltaT)).toFixed(1);
        const newHum = +Math.max(60, Math.min(75, humidity + deltaH)).toFixed(1);
        setTemperature(newTemp);
        setHumidity(newHum);
        setHistory(prev => [
          ...prev.slice(-7),
          { time: timeStr, temp: newTemp, humidity: newHum, status: 'safe' }
        ]);
      }
      setLastSync('Just now');
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive, simulatedBreach, temperature, humidity]);

  const isTempBreached = temperature > tempThreshold.max || temperature < tempThreshold.min;
  const isHumidityBreached = humidity > humidityThreshold.max || humidity < humidityThreshold.min;
  const hasAlert = isTempBreached || isHumidityBreached;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[90px] pointer-events-none transition-colors duration-700 ${
        hasAlert ? 'bg-red-500/15' : 'bg-emerald-500/10'
      }`} />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">ESP32 + DHT22 Telemetry</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">NODE ID: {containerId} · {cropName}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSimulatedBreach(!simulatedBreach)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              simulatedBreach 
                ? 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle threshold breach to demo IoT alerting"
          >
            {simulatedBreach ? '🔴 Breach Active (Click to Normalize)' : '⚡ Test Temp Breach'}
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-300">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px]">WiFi: 98%</span>
          </div>
        </div>
      </div>

      {/* Alert Banner if breached */}
      {hasAlert && (
        <div className="mt-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 flex items-start gap-3 animate-pulse">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold uppercase tracking-wider text-red-300">
              ⚠️ Warning: Environmental Limits Exceeded!
            </p>
            <p className="text-red-200/90 leading-relaxed">
              {isTempBreached && `Temperature is ${temperature}°C (configured safe ceiling is ${tempThreshold.max}°C). `}
              {isHumidityBreached && `Humidity is ${humidity}% (safe ceiling is ${humidityThreshold.max}%). `}
              Cooling system intervention recommended immediately.
            </p>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {/* Temperature Gauge */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isTempBreached 
            ? 'bg-red-950/40 border-red-500/40 shadow-lg shadow-red-900/20' 
            : 'bg-slate-800/60 border-slate-700/60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${isTempBreached ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                <Thermometer className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Temperature</span>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              isTempBreached 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isTempBreached ? 'CRITICAL' : 'OPTIMAL'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black font-mono tracking-tight ${isTempBreached ? 'text-red-400' : 'text-emerald-400'}`}>
              {temperature}
            </span>
            <span className="text-lg font-bold text-slate-400">°C</span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Safe Range: {tempThreshold.min}°C – {tempThreshold.max}°C</span>
            <span className="text-slate-300 font-mono">Target: {tempThreshold.optimal}°C</span>
          </div>
        </div>

        {/* Humidity Gauge */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isHumidityBreached 
            ? 'bg-amber-950/40 border-amber-500/40 shadow-lg shadow-amber-900/20' 
            : 'bg-slate-800/60 border-slate-700/60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${isHumidityBreached ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Humidity (RH)</span>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              isHumidityBreached 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              {isHumidityBreached ? 'ABOVE LIMIT' : 'STABLE'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black font-mono tracking-tight ${isHumidityBreached ? 'text-amber-400' : 'text-cyan-400'}`}>
              {humidity}
            </span>
            <span className="text-lg font-bold text-slate-400">%</span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Safe Range: {humidityThreshold.min}% – {humidityThreshold.max}%</span>
            <span className="text-slate-300 font-mono">Target: {humidityThreshold.optimal}%</span>
          </div>
        </div>
      </div>

      {/* Sensor Stream Log */}
      <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Sensor Transit Log
          </span>
          <span className="font-mono text-[11px] text-slate-400">Sync: {lastSync}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {history.slice(-4).map((entry, idx) => (
            <div 
              key={idx} 
              className={`p-2.5 rounded-xl border text-center transition-all ${
                entry.status === 'breach'
                  ? 'bg-red-950/40 border-red-500/30 text-red-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <p className="text-[10px] text-slate-400 font-mono mb-1">{entry.time}</p>
              <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold">
                <span>{entry.temp}°C</span>
                <span className="text-slate-500">|</span>
                <span>{entry.humidity}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
