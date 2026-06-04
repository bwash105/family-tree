'use client'

import { useState } from 'react'
import { addHeritageNote, deleteHeritageNote } from '@/lib/actions/heritage'
import type { HeritageNote } from '@/lib/types'
import { format } from 'date-fns'

type Props = {
  personId: string
  notes: HeritageNote[]
  currentUserId: string
}

export function HeritageNoteList({ personId, notes, currentUserId }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    setSubmitting(true)
    setError('')
    const result = await addHeritageNote(personId, title.trim(), body.trim())
    if (result.error) {
      setError(result.error)
    } else {
      setTitle('')
      setBody('')
      setShowForm(false)
    }
    setSubmitting(false)
  }

  return (
    <div className="space-y-4">
      {notes.length === 0 && !showForm && (
        <p className="text-gray-400 text-sm italic">No stories or notes yet.</p>
      )}

      {notes.map((note) => (
        <div key={note.id} className="bg-amber-50 rounded-xl p-4">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-900">{note.title}</h4>
            {note.added_by === currentUserId && (
              <button
                type="button"
                onClick={() => deleteHeritageNote(note.id, personId)}
                className="text-red-400 hover:text-red-600 text-xs touch-manipulation flex-shrink-0"
                aria-label="Delete note"
              >
                Delete
              </button>
            )}
          </div>
          <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">{note.body}</p>
          <p className="text-gray-400 text-xs mt-2">
            {format(new Date(note.created_at), 'MMM d, yyyy')}
          </p>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-3 bg-white border border-gray-200 rounded-xl p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Story title…"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the story or note here…"
            required
            rows={4}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-amber-600 text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-50 touch-manipulation"
            >
              {submitting ? 'Saving…' : 'Save story'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setTitle(''); setBody('') }}
              className="px-4 py-3 bg-gray-100 rounded-xl text-sm font-medium touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full py-3 border-2 border-dashed border-amber-300 rounded-xl text-amber-700 text-sm font-medium hover:bg-amber-50 touch-manipulation"
        >
          + Add story or note
        </button>
      )}
    </div>
  )
}
