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
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-100 sticky top-0 z-40 hidden md:block">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/tree" className="font-display text-2xl text-stone-800 hover:text-amber-700 transition-colors">
            Family Tree
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/tree" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors">Tree</Link>
            <Link href="/people" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors">People</Link>
            <Link href="/profile" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors">Profile</Link>
            <form action={signOut}>
              <button type="submit" className="text-sm text-stone-400 hover:text-stone-600 transition-colors cursor-pointer">Sign out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  )
}
