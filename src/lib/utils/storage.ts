export function getPublicUrl(bucket: string, path: string): string {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${projectUrl}/storage/v1/object/public/${bucket}/${path}`
}
