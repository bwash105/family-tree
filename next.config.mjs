/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/supabase-image-loader.ts',
  },
}

export default nextConfig
