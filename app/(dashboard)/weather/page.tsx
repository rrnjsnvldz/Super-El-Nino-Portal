"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Droplets, Wind, Sun, Cloud, CloudSun, CalendarDays, RefreshCw } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const weeklyForecast = [
  { day: "Mon", max: 41, min: 28, condition: "Sunny", icon: Sun },
  { day: "Tue", max: 42, min: 29, condition: "Sunny", icon: Sun },
  { day: "Wed", max: 40, min: 28, condition: "Partly Cloudy", icon: CloudSun },
  { day: "Thu", max: 39, min: 27, condition: "Cloudy", icon: Cloud },
  { day: "Fri", max: 41, min: 28, condition: "Sunny", icon: Sun },
  { day: "Sat", max: 43, min: 30, condition: "Extreme Heat", icon: Flame },
  { day: "Sun", max: 42, min: 29, condition: "Sunny", icon: Sun },
];

const heatData = [
  { time: "06:00", temp: 28 },
  { time: "09:00", temp: 34 },
  { time: "12:00", temp: 39 },
  { time: "15:00", temp: 42 },
  { time: "18:00", temp: 38 },
  { time: "21:00", temp: 32 },
];

export default function WeatherDataPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Meteorological Data</h2>
          <p className="text-slate-500 mt-1">Deep dive into current and forecasted weather patterns.</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-400 mr-2 flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin" /> Live sync active
          </p>
          <Button variant="outline" className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50">
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Temperature Display */}
        <Card className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-700 border-0 shadow-xl shadow-red-500/20 p-8 rounded-3xl text-white">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Flame className="w-48 h-48" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              EXTREME HEAT WARNING
            </div>
            
            <div className="flex items-baseline gap-4 mb-2">
              <h1 className="text-8xl font-black tracking-tighter">42°</h1>
              <span className="text-2xl font-bold opacity-80">C</span>
            </div>
            
            <p className="text-xl font-medium opacity-90 mb-10">Feels like 46°C</p>
            
            <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
              <div>
                <p className="text-white/60 text-sm font-medium mb-1">Humidity</p>
                <p className="text-2xl font-bold flex items-center gap-2"><Droplets className="w-5 h-5 opacity-70"/> 35%</p>
              </div>
              <div>
                <p className="text-white/60 text-sm font-medium mb-1">Wind</p>
                <p className="text-2xl font-bold flex items-center gap-2"><Wind className="w-5 h-5 opacity-70"/> 12 km/h</p>
              </div>
              <div>
                <p className="text-white/60 text-sm font-medium mb-1">UV Index</p>
                <p className="text-2xl font-bold flex items-center gap-2"><Sun className="w-5 h-5 opacity-70"/> 11 (Extreme)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Heat Map Chart */}
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl flex flex-col">
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Today's Heat Curve</h3>
            <p className="text-sm text-slate-500">Hourly temperature progression</p>
          </div>
          <div className="flex-1 min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heatData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 7-Day Forecast */}
      <div>
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-orange-500" /> 7-Day Outlook
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {weeklyForecast.map((day, idx) => (
            <Card key={idx} className={`bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg ${idx === 0 ? 'ring-2 ring-orange-500' : ''}`}>
              <p className="font-medium text-slate-500 dark:text-slate-400 mb-2">{day.day}</p>
              <day.icon className={`w-8 h-8 mb-3 ${day.condition === 'Extreme Heat' ? 'text-red-500 animate-pulse' : 'text-orange-400'}`} />
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-lg text-slate-900 dark:text-slate-100">{day.max}°</span>
                <span className="text-sm font-medium text-slate-400">{day.min}°</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{day.condition}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
