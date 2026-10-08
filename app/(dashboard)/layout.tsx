import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex">
      {/* Absolute background effects for premium feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/10 dark:bg-red-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-orange-500/10 dark:bg-orange-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten" />
      </div>

      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
