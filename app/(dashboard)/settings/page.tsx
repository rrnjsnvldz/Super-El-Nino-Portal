"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Shield, Smartphone, Globe, Moon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 mt-1">Manage portal preferences and notification channels.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Settings */}
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
            <Shield className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Account Preferences</h3>
          </div>
          
          <div className="space-y-5 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" defaultValue="Public User" className="bg-white dark:bg-slate-950 focus-visible:ring-orange-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="user@example.com" className="bg-white dark:bg-slate-950 focus-visible:ring-orange-500" />
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
            <Bell className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Alert Subscriptions</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Smartphone className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">SMS Alerts</h4>
                  <p className="text-sm text-slate-500">Receive critical emergency warnings directly to your phone.</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-orange-500 rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Browser Push Notifications</h4>
                  <p className="text-sm text-slate-500">Get updates while using the portal.</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
