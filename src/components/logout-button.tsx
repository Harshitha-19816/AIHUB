'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="text-slate-400 hover:text-white hover:bg-slate-800 gap-2"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </Button>
  )
}
