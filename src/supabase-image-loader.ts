export default function supabaseImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  if (src.startsWith('http')) {
    return `${src}?width=${width}&quality=${quality ?? 75}`
  }
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${projectUrl}/storage/v1/render/image/public/${src}?width=${width}&quality=${quality ?? 75}`
}
