'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TreeIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 transition-colors ${active ? 'text-amber-600' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 8v8m-4-4h8" />
  </svg>
)
const PeopleIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 transition-colors ${active ? 'text-amber-600' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
)
const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 transition-colors ${active ? 'text-amber-600' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

const tabs = [
  { href: '/tree', label: 'Tree', Icon: TreeIcon },
  { href: '/people', label: 'People', Icon: PeopleIcon },
  { href: '/profile', label: 'Profile', Icon: ProfileIcon },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-stone-100 flex md:hidden z-40 safe-area-inset-bottom">
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 touch-manipulation transition-colors min-h-[56px] ${active ? '' : 'active:bg-stone-50'}`}
            aria-label={label}
          >
            <Icon active={active} />
            <span className={`text-xs font-medium transition-colors ${active ? 'text-amber-600' : 'text-stone-400'}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
