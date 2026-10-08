"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapEvents({ setCenter }: { setCenter: (c: {lat: number, lng: number}) => void }) {
  useMapEvents({
    moveend: (e) => {
      setCenter(e.target.getCenter());
    }
  });
  return null;
}

export default function Map() {
  const [center, setCenter] = useState({ lat: 15.5415, lng: 121.0872 });

  useEffect(() => {
    // Fix leaflet marker icon issue in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <>
      <MapContainer 
        center={[15.5415, 121.0872]} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        {/* Dark-themed OpenStreetMap via CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Heat Hazard Zone (Circle) */}
        <Circle 
          center={[15.5415, 121.05]} 
          pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.4 }} 
          radius={2000} 
        />
        <Circle 
          center={[15.52, 121.1]} 
          pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.4 }} 
          radius={1500} 
        />

        {/* Command Center Marker */}
        <Marker position={[15.5415, 121.0872]}>
          <Popup>
            <div className="text-slate-900">
              <h3 className="font-bold">Palayan City Command Center</h3>
              <p>Active Coordination</p>
            </div>
          </Popup>
        </Marker>

        <MapEvents setCenter={setCenter} />
      </MapContainer>

      {/* Overlay Info Panel */}
      <div className="absolute bottom-6 left-6 w-72 bg-slate-950/90 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-2xl z-[1000]">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-slate-200">Palayan City Stats</h3>
          <div className="w-4 h-4 text-slate-500 flex items-center justify-center font-bold border border-slate-500 rounded-full text-[10px]">i</div>
        </div>
        <p className="text-xs text-slate-400 mb-4">Lng: {center.lng.toFixed(4)} | Lat: {center.lat.toFixed(4)}</p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Drought Risk Area</span>
              <span className="font-semibold text-orange-500">42%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 w-[42%]"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
