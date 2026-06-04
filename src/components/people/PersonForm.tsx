'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createPerson, updatePerson } from '@/lib/actions/people'
import { useRouter } from 'next/navigation'
import type { Person } from '@/lib/types'
import { PhotoUploader } from './PhotoUploader'
import { useState } from 'react'

const schema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  birth_date: z.string().optional(),
  death_date: z.string().optional(),
  birthplace: z.string().optional(),
  bio: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type Props = {
  person?: Person
  onSuccess?: (id: string) => void
}

export function PersonForm({ person, onSuccess }: Props) {
  const router = useRouter()
  const [photoUrl, setPhotoUrl] = useState(person?.cover_photo_url ?? '')
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: person?.full_name ?? '',
      birth_date: person?.birth_date ?? '',
      death_date: person?.death_date ?? '',
      birthplace: person?.birthplace ?? '',
      bio: person?.bio ?? '',
    },
  })

  async function onSubmit(values: FormValues) {
    setServerError('')
    const payload = {
      ...values,
      cover_photo_url: photoUrl || undefined,
      birth_date: values.birth_date || undefined,
      death_date: values.death_date || undefined,
      birthplace: values.birthplace || undefined,
      bio: values.bio || undefined,
    }

    if (person) {
      const result = await updatePerson(person.id, payload)
      if (result.error) { setServerError(result.error); return }
      if (onSuccess) onSuccess(person.id)
      else router.push(`/people/${person.id}`)
    } else {
      const result = await createPerson(payload)
      if (result.error) { setServerError(result.error); return }
      if (onSuccess) onSuccess(result.data!.id)
      else router.push(`/people/${result.data!.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <PhotoUploader
        bucket="person-photos"
        currentUrl={photoUrl}
        onUpload={setPhotoUrl}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('full_name')}
          type="text"
          autoComplete="name"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        {errors.full_name && (
          <p className="text-red-600 text-sm mt-1">{errors.full_name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birth date</label>
          <input
            {...register('birth_date')}
            type="date"
            className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Death date</label>
          <input
            {...register('death_date')}
            type="date"
            className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Birthplace</label>
        <input
          {...register('birthplace')}
          type="text"
          placeholder="City, Country"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          {...register('bio')}
          rows={4}
          placeholder="A few sentences about this person…"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
        />
      </div>

      {serverError && (
        <p className="text-red-600 text-sm">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-3 text-base font-semibold disabled:opacity-50 active:scale-95 transition-all touch-manipulation"
      >
        {isSubmitting ? 'Saving…' : person ? 'Save changes' : 'Add person'}
      </button>
    </form>
  )
}
