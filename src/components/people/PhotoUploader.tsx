'use client'

import { useRef, useState } from 'react'
import { getSignedUploadUrl } from '@/lib/actions/storage'
import { getPublicUrl } from '@/lib/utils/storage'
import Image from 'next/image'

type Props = {
  bucket: 'avatars' | 'person-photos'
  currentUrl?: string
  onUpload: (url: string) => void
}

export function PhotoUploader({ bucket, currentUrl, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(currentUrl ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError('')

    const result = await getSignedUploadUrl(bucket, file.name)
    if (result.error || !result.data) {
      setError(result.error ?? 'Upload failed')
      setUploading(false)
      return
    }

    const { signedUrl, path } = result.data

    const uploadRes = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })

    if (!uploadRes.ok) {
      setError('Upload failed — please try again')
      setUploading(false)
      return
    }

    const publicUrl = getPublicUrl(bucket, path)
    setPreview(publicUrl)
    onUpload(publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 touch-manipulation relative"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Photo"
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <span className="text-3xl">📷</span>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
            <span className="text-white text-xs">Uploading…</span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-sm text-amber-700 font-medium touch-manipulation"
      >
        {preview ? 'Change photo' : 'Add photo'}
      </button>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
