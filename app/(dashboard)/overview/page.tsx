"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudLightning, Droplets, Thermometer, Wind, AlertTriangle, ArrowUpRight, TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const mockWeatherData = [
  { time: "00:00", temp: 24, humidity: 85, rain: 2 },
  { time: "04:00", temp: 23, humidity: 88, rain: 5 },
  { time: "08:00", temp: 26, humidity: 80, rain: 0 },
  { time: "12:00", temp: 31, humidity: 65, rain: 0 },
  { time: "16:00", temp: 29, humidity: 70, rain: 12 },
  { time: "20:00", temp: 25, humidity: 82, rain: 4 },
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Overview</h2>
          <p className="text-slate-500 mt-1">Palayan City real-time climate & emergency metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50">
            Download Report
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/25">
            Get SMS Alerts
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4 flex items-start gap-4">
        <div className="bg-amber-500/20 p-2 rounded-full">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h4 className="font-semibold text-amber-800 dark:text-amber-400">Moderate Rain Warning</h4>
          <p className="text-sm text-amber-700/80 dark:text-amber-500/80 mt-1">Expected continuous rainfall in the next 4 hours. River monitoring stations indicate normal but rising levels.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Current Temperature" 
          value="31°C" 
          icon={<Thermometer className="w-5 h-5 text-rose-500" />} 
          trend="+2°C"
          description="from yesterday"
        />
        <MetricCard 
          title="Humidity Level" 
          value="65%" 
          icon={<Droplets className="w-5 h-5 text-blue-500" />} 
          trend="-5%"
          description="from yesterday"
        />
        <MetricCard 
          title="Wind Speed" 
          value="14 km/h" 
          icon={<Wind className="w-5 h-5 text-teal-500" />} 
          trend="Steady"
          description="NE direction"
        />
        <MetricCard 
          title="Rainfall (24h)" 
          value="23 mm" 
          icon={<CloudLightning className="w-5 h-5 text-indigo-500" />} 
          trend="High"
          description="threshold at 50mm"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Temperature & Rainfall Forecast</h3>
              <p className="text-sm text-slate-500">24-hour predictive model</p>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockWeatherData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="rain" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Active Sensors</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-orange-600"><ArrowUpRight className="w-4 h-4" /></Button>
          </div>
          
          <div className="space-y-4 flex-1">
            <SensorItem name="Pampanga River Station" status="Normal" value="2.4m" />
            <SensorItem name="City Center Air Quality" status="Good" value="42 AQI" />
            <SensorItem name="Mountain Ridge Soil Moisture" status="Warning" value="85%" />
            <SensorItem name="Atate Flood Gauge" status="Normal" value="0.5m" />
          </div>
          
          <Button variant="outline" className="w-full mt-6 bg-transparent border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800">
            View All Sensors
          </Button>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, description }: { title: string, value: string, icon: React.ReactNode, trend: string, description: string }) {
  return (
    <Card className="relative overflow-hidden border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all group">
      <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
        {icon}
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-700 z-10">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
            <span className="text-xs font-semibold text-orange-600 bg-orange-100/50 px-2 py-0.5 rounded-full">{trend}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">{description}</p>
        </div>
      </div>
    </Card>
  )
}

function SensorItem({ name, status, value }: { name: string, status: "Normal" | "Warning" | "Critical" | "Good", value: string }) {
  const statusColors = {
    Normal: "bg-orange-500",
    Good: "bg-red-500",
    Warning: "bg-amber-500",
    Critical: "bg-rose-500"
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusColors[status]}`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${statusColors[status]}`}></span>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</p>
          <p className="text-xs text-slate-400">{status}</p>
        </div>
      </div>
      <div className="font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </div>
    </div>
  )
}
