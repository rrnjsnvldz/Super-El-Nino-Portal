"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, AlertOctagon, Flame, Droplets, Wind, Plus, MapPin, Clock } from "lucide-react";

export default function AlertsPage() {
  const alerts = [
    {
      id: "ALT-2026-041",
      type: "Drought",
      severity: "Critical",
      title: "Level 4 Drought Warning - Agricultural Sector",
      location: "Northern Palayan Districts",
      time: "2 hours ago",
      status: "Active",
      icon: Flame,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20"
    },
    {
      id: "ALT-2026-040",
      type: "Heatwave",
      severity: "Severe",
      title: "Extreme Heat Advisory (42°C+)",
      location: "Citywide",
      time: "5 hours ago",
      status: "Active",
      icon: AlertOctagon,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      id: "ALT-2026-039",
      type: "Water Supply",
      severity: "Warning",
      title: "Scheduled Water Interruption",
      location: "Districts 3, 4 & 5",
      time: "1 day ago",
      status: "Active",
      icon: Droplets,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    },
    {
      id: "ALT-2026-038",
      type: "Wind",
      severity: "Advisory",
      title: "Strong Dry Winds Expected",
      location: "Eastern Ridge",
      time: "2 days ago",
      status: "Resolved",
      icon: Wind,
      color: "text-slate-500",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/20"
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Emergency Alerts</h2>
          <p className="text-slate-500 mt-1">Manage and dispatch critical climate advisories.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            Subscribe to Alerts
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search alerts by ID, title, or location..." 
            className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none gap-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <select className="flex-1 sm:flex-none h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map((alert) => (
          <Card key={alert.id} className={`relative overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all shadow-sm hover:shadow-md group flex flex-col`}>
            {/* Status indicator bar at the top */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${alert.status === 'Active' ? alert.bgColor.replace('/10', '') : 'bg-slate-300 dark:bg-slate-700'}`} />
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${alert.bgColor} ${alert.borderColor} ${alert.color}`}>
                  <alert.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${alert.status === 'Active' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {alert.status}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">{alert.id}</span>
                </div>
              </div>

              <div className="mb-4 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs font-semibold ${alert.color}`}>{alert.type}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span className={`text-xs font-medium text-slate-500`}>{alert.severity}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {alert.title}
                </h3>
              </div>

              <div className="space-y-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{alert.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{alert.time}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800/50 flex gap-2">
              <Button variant="outline" className="w-full bg-transparent border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
