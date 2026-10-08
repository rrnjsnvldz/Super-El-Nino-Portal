import Link from "next/link";
import { Flame, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-40 -left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center text-center p-6 max-w-3xl">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center shadow-2xl shadow-red-500/30 mb-8 border border-white/10">
          <Flame className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Palayan City <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            Climate Hub
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
          The centralized platform for monitoring environmental metrics, emergency alerts, and climate resilience planning for Palayan City.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/overview">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-orange-600 hover:bg-orange-500 text-white border-0 shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)] transition-all gap-2">
              Enter Dashboard <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/alerts">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-700 hover:bg-slate-800 text-slate-300 gap-2 bg-slate-900/50 backdrop-blur-sm">
              <ShieldAlert className="w-5 h-5 text-amber-500" /> View Public Alerts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
