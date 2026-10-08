'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, type LoginInput } from '@/lib/validators/auth'

export async function login(data: LoginInput) {
  // Validate input
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Invalid login data provided.' }
  }

  const supabase = await createClient()

  // Authenticate user
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    // Audit log should ideally track failed attempts, but we leave it to Supabase's built-in limits for MVP
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
