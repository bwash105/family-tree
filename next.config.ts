import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/supabase-image-loader.ts',
  },
}

export default nextConfig
