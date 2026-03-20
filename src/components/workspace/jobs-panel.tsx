'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Briefcase, Loader2, MapPin, Building2, Sparkles, Code, CheckCircle2, ExternalLink, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Job {
  title: string
  company: string
  location: string
  link: string
  description?: string
}

function SegmentedControl({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (val: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block w-full pl-2">{label}</label>
      <div className="flex items-center justify-between frosted-crystal rounded-2xl p-1.5 border border-white/5 bg-white/5">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-1.5 sm:py-2.5 rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
              value === opt 
                ? 'bg-white/15 text-white shadow-xl border border-white/10 text-glow scale-100' 
                : 'text-white/40 hover:text-white/70 hover:bg-white/5 scale-95 hover:scale-100'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export function JobsPanel({ logActivity }: { logActivity: (type: string, msg: string) => void }) {
  const [role, setRole] = useState('')
  const [skills, setSkills] = useState('')
  const [location, setLocation] = useState('')
  const [workMode, setWorkMode] = useState('Any')
  const [experience, setExperience] = useState('Any')
  const [jobType, setJobType] = useState('Any')

  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!role.trim()) {
      toast.error('Target Role is required to initiate search')
      return
    }
    
    setLoading(true)
    setHasSearched(true)
    setJobs([])

    try {
      const res = await fetch('/api/ai/job-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, skills, location, workMode, experience, jobType }),
      })

      const data = await res.json()
      if (res.ok) {
        setJobs(data.jobs || [])
        logActivity('Market', `Found ${data.jobs?.length || 0} ${role} opportunities`)
        if (data.jobs?.length === 0) toast.info('No jobs found for these criteria')
        else toast.success(`Found ${data.jobs.length} high-match jobs!`)
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
    <div className="flex-1 flex flex-col min-h-0">
      {/* Panel Header */}
      <div className="flex-none flex items-center justify-between mb-4 sm:mb-8">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
              <Sparkles className="text-white/60" size={24} />
           </div>
           <div>
             <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tighter uppercase text-glow">AI Recruiter</h2>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Suggestions Enabled</p>
           </div>
        </div>
      </div>

      {/* Two Column Layout on Desktop */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Form */}
        <div className="flex-none lg:w-[380px] overflow-y-auto custom-scrollbar pr-2 pb-10 space-y-6 sm:space-y-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-orange-500/60 ml-2">Target Role</label>
              <div className="relative frosted-crystal p-2 rounded-2xl border border-white/10 flex items-center gap-2 sm:gap-3 h-12 sm:h-14 bg-white/5 transition-all focus-within:border-white/30 focus-within:bg-white/10">
                <div className="pl-3"><Briefcase size={16} className="text-white/40" /></div>
                <Input 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="bg-transparent border-none focus-visible:ring-0 text-sm sm:text-base h-full w-full placeholder:text-white/20 font-medium tracking-tight text-white !pr-4"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-orange-500/60 ml-2">Required Skills</label>
              <div className="relative frosted-crystal p-2 rounded-2xl border border-white/10 flex items-center gap-2 sm:gap-3 h-12 sm:h-14 bg-white/5 transition-all focus-within:border-white/30 focus-within:bg-white/10">
                <div className="pl-3"><Code size={16} className="text-white/40" /></div>
                <Input 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, Next.js, Tailwind"
                  className="bg-transparent border-none focus-visible:ring-0 text-sm sm:text-base h-full w-full placeholder:text-white/20 font-medium tracking-tight text-white !pr-4"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-orange-500/60 ml-2">Location</label>
              <div className="relative frosted-crystal p-2 rounded-2xl border border-white/10 flex items-center gap-2 sm:gap-3 h-12 sm:h-14 bg-white/5 transition-all focus-within:border-white/30 focus-within:bg-white/10">
                <div className="pl-3"><MapPin size={16} className="text-white/40" /></div>
                <Input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York, Remote"
                  className="bg-transparent border-none focus-visible:ring-0 text-sm sm:text-base h-full w-full placeholder:text-white/20 font-medium tracking-tight text-white !pr-4"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-white/5">
            <SegmentedControl label="Work Mode" options={['Any', 'Onsite', 'Hybrid', 'Remote']} value={workMode} onChange={setWorkMode} />
            <SegmentedControl label="Experience" options={['Any', 'Junior', 'Mid', 'Senior', 'Executive']} value={experience} onChange={setExperience} />
            <SegmentedControl label="Job Type" options={['Any', 'Full', 'Contract', 'Intern']} value={jobType} onChange={setJobType} />
          </div>

          <Button 
            onClick={handleSearch}
            disabled={loading || !role.trim()}
            className="w-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-30 shadow-2xl shadow-emerald-500/10"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <span className="flex items-center gap-2"><Sparkles size={16} /> Start AI Search</span>}
          </Button>

          {/* Recent Searches Header (Visual Only) */}
          <div className="pt-8 border-t border-white/5">
             <div className="flex items-center gap-2 text-white/40">
               <Loader2 size={14} className="text-white/20" />
               <h3 className="text-[10px] font-black uppercase tracking-widest">Recent Searches</h3>
             </div>
             <p className="text-xs text-white/20 mt-4 italic">No recent searches yet.</p>
          </div>
        </div>

        {/* Right Column: Results / Empty States */}
        <div className="flex-1 overflow-y-auto custom-scrollbar lg:bg-white/5 lg:border border-white/5 rounded-[32px] lg:p-6 relative">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative w-20 h-20">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                     className="absolute inset-0 border-2 border-emerald-500/20 rounded-full"
                   />
                   <motion.div 
                     animate={{ rotate: -360 }}
                     transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                     className="absolute inset-2 border-2 border-transparent border-t-emerald-400/80 rounded-full"
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <Sparkles size={24} className="text-emerald-400/60 animate-pulse" />
                   </div>
                </div>
                <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.4em] animate-pulse italic text-center">AI Agents Scouring Market...</p>
              </motion.div>
            ) : hasSearched && jobs.length > 0 ? (
              <motion.div
                key="results"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="flex flex-col gap-4 pb-8"
              >
                <div className="flex items-center justify-between mb-2 px-2 sticky top-0 bg-transparent backdrop-blur-md z-10 py-2">
                  <h3 className="text-xs font-black text-white/40 uppercase tracking-widest">Top Opportunities</h3>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full">{jobs.length} Matches</span>
                </div>
                
                {jobs.map((job, i) => (
                  <motion.div 
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  >
                    <div className="frosted-crystal bg-white/5 border border-white/10 rounded-3xl p-6 transition-all hover:bg-white/10 hover:border-white/20 shadow-lg group">
                      
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div className="space-y-1">
                          <h4 
                            onClick={() => typeof window !== 'undefined' && window.open(job.link, '_blank')}
                            className="font-black text-white text-lg sm:text-xl italic tracking-tight uppercase group-hover:text-emerald-400 transition-colors cursor-pointer hover:underline"
                          >
                            {job.title}
                          </h4>
                          <div className="flex items-center gap-3 flex-wrap pt-1">
                            <span className="text-[10px] text-white/60 font-black uppercase tracking-widest flex items-center gap-1.5"><Building2 size={12}/>{job.company}</span>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest flex items-center gap-1">
                              <MapPin size={10} /> {job.location}
                            </span>
                            {jobType !== 'Any' && (
                              <>
                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">{jobType}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <Button 
                          onClick={() => typeof window !== 'undefined' && window.open(job.link, '_blank')}
                          className="w-full sm:w-auto bg-white/10 border border-white/20 text-white font-black text-[10px] uppercase tracking-widest hover:border-emerald-500/40 hover:bg-emerald-500/20 hover:text-emerald-400 h-10 sm:h-12 rounded-xl sm:rounded-2xl px-8 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                          Apply <ExternalLink size={14} />
                        </Button>
                      </div>

                      {/* Card Meta Filter tags */}
                      <div className="flex items-center gap-2 mb-4">
                        <Filter size={12} className="text-white/30" />
                        <span className="text-[10px] text-white/40 italic">
                          {experience !== 'Any' ? experience : 'Entry/Mid'} Level • {workMode !== 'Any' ? workMode : 'Hybrid/Remote'}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="bg-black/20 rounded-2xl p-4 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20" />
                        <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-medium">
                          <Sparkles size={14} className="inline mr-2 text-emerald-400/60 mb-1" />
                          {job.description}
                        </p>
                      </div>
                      
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : !hasSearched ? (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
              >
                 <div className="w-20 h-20 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                   <Briefcase size={32} className="text-white/20 relative z-10" />
                 </div>
                 <h3 className="text-xl sm:text-3xl font-black text-white italic tracking-tighter mb-4 text-glow">Your Next Career Move</h3>
                 <p className="text-sm text-white/40 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                   Tell us your role and skills. Our AI will scan job boards and rank the best openings for your specific profile and experience level.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                   <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">
                     <CheckCircle2 size={16} /> Real-time search
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">
                     <CheckCircle2 size={16} /> AI Ranked
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">
                     <CheckCircle2 size={16} /> Direct Links
                   </div>
                 </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
