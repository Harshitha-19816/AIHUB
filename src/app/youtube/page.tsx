'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Youtube, Search, Loader2, ListChecks, Info, Lightbulb, Copy, Check } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Summary {
  explanation: string
  key_points: string[]
  bullet_summary: string[]
}

export default function YoutubePage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSummarize = async () => {
    if (!url.trim()) return
    setLoading(true)
    setSummary(null)

    try {
      const res = await fetch('/api/ai/youtube-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()
      if (res.ok) {
        setSummary(data)
        toast.success('Summary generated!')
      } else {
        toast.error(data.error || 'Failed to generate summary')
      }
    } catch (err) {
      toast.error('An error occurred during summarization')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!summary) return
    const text = `
Explanation: ${summary.explanation}

Key Points:
${summary.key_points.map(p => `- ${p}`).join('\n')}

Detailed Summary:
${summary.bullet_summary.map(p => `- ${p}`).join('\n')}
    `.trim()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Toaster position="top-center" richColors />
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto py-8 px-4 md:px-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/5">
              <Youtube className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">AI YouTube Summarizer</h1>
            <p className="text-slate-400 text-lg">Turn long videos into concise, actionable insights in seconds</p>
          </div>

          {/* Input Area */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl p-2 rounded-3xl">
            <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                <Input 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube Video URL (e.g., https://www.youtube.com/watch?v=...)" 
                  className="pl-12 h-14 bg-slate-950 border-slate-800 focus:border-red-500/50 text-white rounded-2xl text-lg"
                />
              </div>
              <Button 
                onClick={handleSummarize}
                disabled={loading || !url}
                className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Summarize"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Area */}
          <AnimatePresence>
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pb-12"
              >
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white gap-2 rounded-xl"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy All'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Quick Insight */}
                  <Card className="md:col-span-1 border-slate-800 bg-slate-900/40 backdrop-blur-sm p-2 rounded-3xl">
                    <CardHeader className="pb-2">
                       <div className="flex items-center gap-2 text-indigo-400 mb-1">
                          <Lightbulb className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Quick Insight</span>
                       </div>
                       <CardTitle className="text-lg font-bold text-white">Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {summary.explanation}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Key Takeaways */}
                  <Card className="md:col-span-2 border-slate-800 bg-slate-900/40 backdrop-blur-sm p-2 rounded-3xl">
                    <CardHeader className="pb-2">
                       <div className="flex items-center gap-2 text-amber-400 mb-1">
                          <Info className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Major Takeaways</span>
                       </div>
                       <CardTitle className="text-lg font-bold text-white">Key Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {summary.key_points.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-300 text-sm bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                            <span className="text-indigo-500 font-bold shrink-0">{i + 1}.</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Detailed Breakdown */}
                  <Card className="md:col-span-3 border-slate-800 bg-slate-900/40 backdrop-blur-sm p-2 rounded-3xl">
                    <CardHeader className="pb-2">
                       <div className="flex items-center gap-2 text-emerald-400 mb-1">
                          <ListChecks className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Step-by-Step Breakdown</span>
                       </div>
                       <CardTitle className="text-lg font-bold text-white">Detailed Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {summary.bullet_summary.map((pt, i) => (
                          <div key={i} className="flex gap-4 group">
                             <div className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                                <div className="w-[1px] h-full bg-slate-800 group-last:bg-transparent mt-2"></div>
                             </div>
                             <p className="text-slate-400 text-base leading-relaxed pb-4">
                               {pt}
                             </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!summary && !loading && (
            <div className="flex flex-col items-center justify-center pt-20 text-center space-y-6">
               <div className="relative">
                 <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
                 <div className="relative w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 shadow-2xl">
                    <Youtube className="w-16 h-16 text-slate-800" />
                 </div>
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-bold text-white">No summary yet</h3>
                 <p className="text-slate-500 max-w-sm">Enter a YouTube link above to extract key insights and a detailed breakdown of the content.</p>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
