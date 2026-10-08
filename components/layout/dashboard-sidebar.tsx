import Link from "next/link";
import { CloudRain, Home, Map, Activity, Users, Settings, Lock, ShieldAlert } from "lucide-react";

export function DashboardSidebar() {
  const navItems = [
    { icon: Home, label: "Overview", href: "/overview" },
    { icon: CloudRain, label: "Weather Data", href: "/weather" },
    { icon: ShieldAlert, label: "Emergency Alerts", href: "/alerts" },
    { icon: Map, label: "Evacuation Map", href: "/map" },
    { icon: Activity, label: "Sensors & Metrics", href: "/metrics" },
    { icon: Users, label: "Personnel", href: "/personnel" },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl hidden md:flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
            <CloudRain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-800 dark:from-orange-400 dark:to-red-600">Palayan Hub</h1>
            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Climate Resilience</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 flex-1">
        <div className="text-xs font-medium text-slate-400 mb-4 px-2 tracking-wider">MENU</div>
        <nav className="space-y-1.5">
          {navItems.map((item, idx) => {
            const isActive = idx === 0; // Just for mockup purposes
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? "text-orange-700 dark:text-orange-400 bg-orange-50/80 dark:bg-orange-950/40 font-medium" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
                )}
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
        <nav className="space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all duration-300">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </Link>
          <Link href="/login" className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all duration-300">
            <Lock className="w-5 h-5" />
            <span className="text-sm">Official Login</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
