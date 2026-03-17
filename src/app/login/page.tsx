'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome } from 'lucide-react'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-4">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-2">
            <span className="text-3xl font-bold text-white italic">A</span>
          </div>
          <CardTitle className="text-4xl font-extrabold tracking-tight text-white">
            AI HUB
          </CardTitle>
          <CardDescription className="text-slate-400 text-lg">
            Your all-in-one AI productivity suite
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-4 pb-8">
          <Button 
            onClick={handleLogin}
            className="w-full h-14 bg-white hover:bg-slate-100 text-black font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 rounded-xl shadow-xl shadow-white/5"
          >
            <Chrome className="w-6 h-6" />
            Continue with Google
          </Button>
          
          <div className="text-center text-sm text-slate-500">
            Secure authentication powered by Supabase Auth
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
