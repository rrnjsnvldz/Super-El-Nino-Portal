"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, Shield, Phone, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

const personnel = [
  { id: 1, name: "Maria Santos", role: "Emergency Coordinator", status: "Active", location: "Command Center", phone: "+63 917 123 4567" },
  { id: 2, name: "Juan Dela Cruz", role: "Field Responder", status: "Deployed", location: "District 3", phone: "+63 918 234 5678" },
  { id: 3, name: "Ana Reyes", role: "Medical Lead", status: "Active", location: "Evac Center A", phone: "+63 919 345 6789" },
  { id: 4, name: "Pedro Garcia", role: "Field Responder", status: "Deployed", location: "District 5", phone: "+63 920 456 7890" },
  { id: 5, name: "Elena Bautista", role: "Logistics", status: "On Leave", location: "N/A", phone: "+63 921 567 8901" },
  { id: 6, name: "Ricardo Fernandez", role: "Field Responder", status: "Active", location: "Command Center", phone: "+63 922 678 9012" },
];

export default function PersonnelPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Personnel Directory</h2>
          <p className="text-slate-500 mt-1">Manage responders, coordinators, and emergency staff.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search personnel..." 
              className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-orange-500 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personnel.map((person) => (
          <Card key={person.id} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{person.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400">
                      <Shield className="w-3 h-3" /> {person.role}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><MapPin className="w-4 h-4"/> Location</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{person.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><Phone className="w-4 h-4"/> Contact</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{person.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><UserCheck className="w-4 h-4"/> Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    person.status === 'Deployed' ? 'bg-orange-500/10 text-orange-600' :
                    person.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' :
                    'bg-slate-500/10 text-slate-600'
                  }`}>
                    {person.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <Button variant="outline" className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100">
                <Mail className="w-4 h-4 mr-2" /> Message
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
