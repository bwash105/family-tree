import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/actions/auth'
import { BottomNav } from '@/components/layout/BottomNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Top nav — desktop only; mobile uses bottom nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 hidden md:block">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/tree" className="font-bold text-lg text-amber-800">
            🌳 Family Tree
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/tree" className="text-sm font-medium text-gray-700 hover:text-amber-700">
              Tree
            </Link>
            <Link href="/people" className="text-sm font-medium text-gray-700 hover:text-amber-700">
              People
            </Link>
            <Link href="/profile" className="text-sm font-medium text-gray-700 hover:text-amber-700">
              Profile
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-sm text-gray-400 hover:text-gray-600">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
