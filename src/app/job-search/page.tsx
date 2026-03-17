'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Briefcase, Search, Loader2, MapPin, Building2, ExternalLink, Sparkles } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Job {
  title: string
  company: string
  location: string
  link: string
}

export default function JobSearchPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setJobs([])

    try {
      const res = await fetch('/api/ai/job-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      const data = await res.json()
      if (res.ok) {
        setJobs(data.jobs || [])
        if (data.jobs?.length === 0) toast.info('No jobs found for this query')
        else toast.success(`Found ${data.jobs.length} jobs!`)
      } else {
        toast.error(data.error || 'Failed to search for jobs')
      }
    } catch (err) {
      toast.error('An error occurred during search')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Toaster position="top-center" richColors />
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto py-8 px-4 md:px-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-4">
                <Briefcase className="w-10 h-10 text-emerald-500" />
                AI Job Search
              </h1>
              <p className="text-slate-400 text-lg">Find your next opportunity with AI-powered web crawling</p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
               <Sparkles className="w-4 h-4 text-emerald-400" />
               <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Powered by Firecrawl</span>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl p-2 rounded-3xl">
            <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                <Input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter job role or expertise (e.g., Senior React Developer)" 
                  className="pl-12 h-14 bg-slate-950 border-slate-800 focus:border-emerald-500/50 text-white rounded-2xl text-lg"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={loading || !query}
                className="h-14 px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Find Jobs"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            <AnimatePresence>
              {jobs.map((job, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all group overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors mb-2">
                           <Briefcase className="w-5 h-5 text-emerald-500" />
                        </div>
                        <a 
                          href={job.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-slate-500 hover:text-white hover:bg-slate-850 rounded-lg transition-all"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                      <CardTitle className="text-xl font-bold text-white leading-tight mb-1">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="text-emerald-400 font-medium flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.company}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          onClick={() => window.open(job.link, '_blank')}
                          className="w-full bg-slate-800 border border-slate-700 hover:bg-emerald-600 hover:border-emerald-500 text-white font-bold py-5 rounded-xl transition-all"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {!loading && jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-20 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800 shadow-xl opacity-50">
                  <Briefcase className="w-12 h-12 text-slate-700" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-xl font-bold text-slate-400">Ready to search?</h3>
                 <p className="text-slate-500 max-w-xs">Enter a job title to see listings from across the web processed by AI.</p>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
