'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/tree', emoji: '🌳', label: 'Tree' },
  { href: '/people', emoji: '👥', label: 'People' },
  { href: '/profile', emoji: '👤', label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-40 safe-area-inset-bottom">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 touch-manipulation transition-colors ${
              active ? 'text-amber-600' : 'text-gray-500 active:bg-gray-50'
            }`}
          >
            <span className="text-xl">{tab.emoji}</span>
            <span className={`text-xs font-medium ${active ? 'text-amber-600' : ''}`}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
