'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Note {
  id?: string
  title: string
  content: string
}

interface NoteEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (note: { title: string; content: string; id?: string }) => void
  initialData?: Note | null
}

export function NoteEditor({ open, onOpenChange, onSave, initialData }: NoteEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setContent(initialData.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [initialData, open])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title, content, id: initialData?.id })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-slate-900 border-slate-800 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {initialData ? 'Edit Note' : 'Create New Note'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-slate-400 font-medium ml-1">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your note a title..."
              className="bg-slate-950 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-white h-12 text-lg px-4 rounded-xl transition-all"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content" className="text-slate-400 font-medium ml-1">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[200px] bg-slate-950 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-white text-base p-4 rounded-xl resize-none transition-all leading-relaxed"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold px-8 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
