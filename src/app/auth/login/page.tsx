import { MagicLinkForm } from '@/components/auth/MagicLinkForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-amber-700" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 2 5 5 5 9c0 2.4 1.1 4.5 2.8 5.9L12 22l4.2-7.1C17.9 13.5 19 11.4 19 9c0-4-3-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <h1 className="font-display text-5xl text-stone-800 mb-1">Family Tree</h1>
          <p className="text-stone-500 text-sm font-body">Building our story, together</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
          <h2 className="font-display text-2xl text-stone-800 mb-1">Welcome</h2>
          <p className="text-stone-500 text-sm mb-6">
            Enter your email and we&apos;ll send you a sign-in link — no password needed.
          </p>
          <MagicLinkForm />
        </div>

        <p className="text-center text-xs text-stone-400 mt-5">
          First time? Just enter your email and you&apos;ll be added automatically.
        </p>
      </div>
    </main>
  )
}
