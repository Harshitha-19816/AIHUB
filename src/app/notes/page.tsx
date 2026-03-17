'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { NoteCard } from '@/components/notes/note-card'
import { NoteEditor } from '@/components/notes/note-editor'
import { Button } from '@/components/ui/button'
import { Plus, Search, Loader2, StickyNote } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Toaster, toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes')
      const data = await res.json()
      if (res.ok) setNotes(data)
    } catch (err) {
      toast.error('Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleSaveNote = async (noteData: { title: string; content: string; id?: string }) => {
    const isEditing = !!noteData.id
    const method = isEditing ? 'PATCH' : 'POST'
    const url = isEditing ? `/api/notes/${noteData.id}` : '/api/notes'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      })

      if (res.ok) {
        toast.success(isEditing ? 'Note updated' : 'Note created')
        fetchNotes()
      } else {
        toast.error('Failed to save note')
      }
    } catch (err) {
      toast.error('Error saving note')
    }
  }

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Note deleted')
        setNotes(notes.filter((n) => n.id !== id))
      } else {
        toast.error('Failed to delete note')
      }
    } catch (err) {
      toast.error('Error deleting note')
    }
  }

  const filteredNotes = notes.filter((n) => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Toaster position="top-center" richColors />
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative py-8 px-4 md:px-10 overflow-y-auto custom-scrollbar">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">My Notes</h1>
            <p className="text-slate-400">Manage your thoughts and ideas with AI HUB</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..." 
                className="pl-10 w-full md:w-64 bg-slate-900/50 border-slate-800 focus:border-indigo-500/50 text-white rounded-xl h-11" 
              />
            </div>
            
            <Button 
              onClick={() => { setEditingNote(null); setEditorOpen(true); }}
              className="bg-indigo-500 hover:bg-indigo-600 text-white h-11 px-6 rounded-xl font-bold shadow-lg shadow-indigo-500/20 gap-2 shrink-0 transition-transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Note
            </Button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-2">
              <StickyNote className="w-10 h-10 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold text-white">No notes found</h3>
            <p className="text-slate-500 max-w-xs">
              {search ? "We couldn't find any notes matching your search." : "Start by creating your first note to keep track of your ideas."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onEdit={(n) => { setEditingNote(n); setEditorOpen(true); }}
                  onDelete={handleDeleteNote}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        <NoteEditor 
          open={editorOpen} 
          onOpenChange={setEditorOpen}
          initialData={editingNote}
          onSave={handleSaveNote}
        />
      </main>
    </div>
  )
}
