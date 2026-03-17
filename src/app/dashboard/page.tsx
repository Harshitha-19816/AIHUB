'use client'

import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StickyNote, Youtube, Briefcase, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Toaster } from 'sonner'

const tools = [
  {
    name: 'Notes Saver',
    description: 'Keep your thoughts organized in one place. Secure and private.',
    href: '/notes',
    icon: StickyNote,
    color: 'from-blue-500 to-cyan-500',
    stats: 'Cloud Synced'
  },
  {
    name: 'YouTube Summarizer',
    description: 'Paste any link to get an AI-powered summary and key insights.',
    href: '/youtube',
    icon: Youtube,
    color: 'from-rose-500 to-orange-500',
    stats: 'Powered by OpenRouter'
  },
  {
    name: 'AI Job Search',
    description: 'Find your dream job using advanced AI-powered web crawling.',
    href: '/job-search',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-500',
    stats: 'Firecrawl API'
  }
]

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Toaster position="top-center" richColors />
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto py-8 px-4 md:px-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={12} className="text-yellow-300" />
                  All-in-one Hub
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                  Welcome to AI HUB
                </h1>
                <p className="text-indigo-100 text-lg max-w-lg">
                  Empower your workflow with professional AI tools. Save notes, summarize videos, and find opportunities.
                </p>
              </div>
              <div className="shrink-0 w-48 h-48 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center rotate-6 scale-110 md:scale-125">
                 <div className="w-24 h-24 bg-gradient-to-tr from-white to-indigo-200 rounded-2xl shadow-2xl flex items-center justify-center">
                    <span className="text-5xl font-black text-indigo-600 italic">A</span>
                 </div>
              </div>
            </div>
          </section>

          {/* Tools Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Toolbox</h2>
              <span className="text-sm text-slate-500">3 tools available</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, idx) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={tool.href}>
                    <Card className="h-full border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all group relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity`}></div>
                      
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-2 shadow-lg shadow-indigo-500/10`}>
                          <tool.icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                          {tool.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                         <div className="flex items-center justify-between mt-4">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                             {tool.stats}
                           </span>
                           <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                         </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
