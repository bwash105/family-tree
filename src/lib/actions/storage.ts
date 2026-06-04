'use server'

import { createClient } from '@/lib/supabase/server'

export async function getSignedUploadUrl(
  bucket: 'avatars' | 'person-photos',
  filename: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const path = `${user.id}/${Date.now()}-${filename}`
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path)

  if (error) return { error: error.message }

  return { data: { signedUrl: data.signedUrl, path } }
}

export function getPublicUrl(bucket: string, path: string): string {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${projectUrl}/storage/v1/object/public/${bucket}/${path}`
}
