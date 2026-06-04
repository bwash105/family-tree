import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { fetchPersonById } from '@/lib/queries/people'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { signOut } from '@/lib/actions/auth'
import type { Profile } from '@/lib/types'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile: Profile = profileData ?? {
    id: user.id,
    full_name: null,
    avatar_url: null,
    person_id: null,
    created_at: new Date().toISOString(),
  }

  const linkedPerson = profile.person_id
    ? await fetchPersonById(profile.person_id)
    : null

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My profile</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <ProfileForm profile={profile} linkedPerson={linkedPerson} />
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-sm text-gray-500 mb-1">Signed in as</p>
        <p className="font-medium text-gray-900">{user.email}</p>
        <form action={signOut} className="mt-4">
          <button
            type="submit"
            className="w-full py-3 border border-red-200 rounded-xl text-red-600 text-sm font-medium hover:bg-red-50 touch-manipulation"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
