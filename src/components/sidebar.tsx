'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  StickyNote, 
  Youtube, 
  Briefcase, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { LogoutButton } from './logout-button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Notes', href: '/notes', icon: StickyNote },
  { name: 'YouTube Summary', href: '/youtube', icon: Youtube },
  {
    name: 'AI Job Search',
    description: 'Find your dream job using advanced AI-powered web crawling.',
    href: '/job-search',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-500',
    stats: 'Firecrawl API'
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shrink-0">
          <span className="font-bold text-white italic">A</span>
        </div>
        {!collapsed && <span className="font-bold text-xl tracking-tight text-white">AI HUB</span>}
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-indigo-400" : "group-hover:text-slate-200")} />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        <div className={cn("flex items-center gap-3 px-3", collapsed ? "justify-center" : "")}>
           <LogoutButton />
        </div>
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-10 bg-slate-800 border border-slate-700 rounded-full p-1 hover:bg-slate-700 transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}
