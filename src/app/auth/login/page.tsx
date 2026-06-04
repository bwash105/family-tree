import { MagicLinkForm } from '@/components/auth/MagicLinkForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-amber-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🌳 Family Tree</h1>
          <p className="text-gray-500 text-sm">
            Enter your email — we will send you a sign-in link. No password needed.
          </p>
        </div>
        <MagicLinkForm />
      </div>
    </main>
  )
}
