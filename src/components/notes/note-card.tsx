'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
}

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full bg-slate-900/40 border-slate-800 backdrop-blur-sm hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {note.title}
          </CardTitle>
          <p className="text-[10px] text-slate-500 font-mono">
            {new Date(note.created_at).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm line-clamp-4 leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(note)}
            className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(note.id)}
            className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
