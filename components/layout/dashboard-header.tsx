import { Bell, Search, Menu, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search alerts, locations..." 
            className="w-72 pl-9 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-full focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
          </Button>
        </div>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
        
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" className="hidden sm:flex items-center gap-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all rounded-full">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Official Login</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
