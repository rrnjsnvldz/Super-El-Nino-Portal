"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Download, Filter, Radio, Wifi, Battery, AlertTriangle } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const sensorData = [
  { name: "North Station", airQuality: 45, soilMoisture: 32 },
  { name: "East Ridge", airQuality: 68, soilMoisture: 18 },
  { name: "City Center", airQuality: 112, soilMoisture: 10 },
  { name: "South Dam", airQuality: 55, soilMoisture: 45 },
  { name: "West Valley", airQuality: 82, soilMoisture: 22 },
];

export default function MetricsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Sensors & Metrics</h2>
          <p className="text-slate-500 mt-1">Detailed telemetry from all active city sensors.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50 gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/25 gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl">
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Regional Air Quality vs. Soil Moisture</h3>
            <p className="text-sm text-slate-500">Comparative analysis across monitoring stations</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sensorData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#334155', opacity: 0.1 }}
                />
                <Bar dataKey="airQuality" name="Air Quality Index" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="soilMoisture" name="Soil Moisture (%)" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Network Status */}
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl flex flex-col">
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Radio className="w-5 h-5 text-orange-500" /> Network Status
            </h3>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Active Sensors</p>
                  <p className="text-xs text-slate-500">Total operational</p>
                </div>
              </div>
              <span className="font-bold text-xl">142</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Offline Nodes</p>
                  <p className="text-xs text-slate-500">Requires maintenance</p>
                </div>
              </div>
              <span className="font-bold text-xl text-red-500">3</span>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-medium text-slate-500">Critical Node Alerts</h4>
              
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 flex items-start gap-3">
                <Battery className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Station E-4 Low Power</p>
                  <p className="text-xs text-slate-500">Battery at 12%, solar panel obscured.</p>
                </div>
              </div>
              
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 flex items-start gap-3">
                <Wifi className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Station N-2 Disconnected</p>
                  <p className="text-xs text-slate-500">No signal received for 4 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
