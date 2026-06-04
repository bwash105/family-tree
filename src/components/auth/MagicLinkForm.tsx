'use client'

import { useState } from 'react'
import { sendMagicLink } from '@/lib/actions/auth'

export function MagicLinkForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const result = await sendMagicLink(email)
    if (result.error) {
      setErrorMsg(result.error)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  if (status === 'sent') {
    return (
      <div className="text-center p-6">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-xl font-semibold mb-2">Check your email</h2>
        <p className="text-gray-600 text-sm">
          We sent a magic link to <strong>{email}</strong>. Tap it to sign in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          inputMode="email"
          autoComplete="email"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      {status === 'error' && (
        <p className="text-red-600 text-sm">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-3 text-base font-semibold disabled:opacity-50 active:scale-95 transition-all touch-manipulation"
      >
        {status === 'loading' ? 'Sending…' : 'Send magic link'}
      </button>
    </form>
  )
}
