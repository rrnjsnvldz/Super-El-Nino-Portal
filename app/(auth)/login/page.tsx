"use client";

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '../actions'
import { loginSchema, type LoginInput } from '@/lib/validators/auth'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)
    const result = await login(data)
    
    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Super El Nino Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10 relative">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Public Portal
        </Link>
        
        <Card className="shadow-2xl shadow-black/50 border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-red-600"></div>
          <CardHeader className="space-y-3 text-center pt-8">
            <div className="flex justify-center mb-2">
              <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 p-4 ring-1 ring-white/10">
                <Lock className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">Official Login</CardTitle>
            <CardDescription className="text-slate-400 text-base">
              Enter your credentials to access restricted management modules.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="official@palayancity.gov.ph" 
                          className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-12"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-slate-300">Password</FormLabel>
                        <Link href="/forgot-password" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-12"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all mt-4" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Authenticating...' : 'Sign In Securely'}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex justify-center bg-black/20 p-5 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-500 text-center">
              <ShieldAlert className="w-4 h-4 text-slate-400" />
              <span>Authorized personnel only. All access is logged and monitored.</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
