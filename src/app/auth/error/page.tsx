import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-amber-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-semibold mb-2">Link expired or invalid</h1>
        <p className="text-gray-600 text-sm mb-6">
          Magic links expire after 1 hour. Please request a new one.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-amber-600 text-white rounded-xl px-6 py-3 font-semibold touch-manipulation"
        >
          Back to login
        </Link>
      </div>
    </main>
  )
}
