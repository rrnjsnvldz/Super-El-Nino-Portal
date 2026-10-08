"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Filter, Loader2 } from "lucide-react";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
    </div>
  ),
});

export default function EvacuationMapPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Evacuation Map</h2>
          <p className="text-slate-500 mt-1">Interactive hazard zones and safe routes across Palayan City.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50 gap-2">
            <Layers className="w-4 h-4" /> Map Layers
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/25 gap-2">
            <Filter className="w-4 h-4" /> Filter Zones
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <Card className="flex-1 relative overflow-hidden bg-slate-900 border-slate-800 rounded-3xl group">
        <MapComponent />
      </Card>
    </div>
  );
}
