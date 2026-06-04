import dynamic from 'next/dynamic'
import { fetchAllPeople } from '@/lib/queries/people'
import { fetchAllRelationships } from '@/lib/queries/relationships'
import { buildTreeData } from '@/lib/tree/buildTreeData'
import Link from 'next/link'

const TreeCanvas = dynamic(
  () => import('@/components/tree/TreeCanvas').then((m) => m.TreeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-sm">Loading tree…</div>
      </div>
    ),
  }
)

export default async function TreePage() {
  const [people, relationships] = await Promise.all([
    fetchAllPeople(),
    fetchAllRelationships(),
  ])

  const treeData = buildTreeData(people, relationships)

  return (
    <div className="relative" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Floating "Add person" button */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          href="/people/new"
          className="bg-amber-600 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg touch-manipulation flex items-center gap-1"
        >
          + Add
        </Link>
      </div>

      {/* People count badge */}
      {people.length > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-gray-600 shadow-sm">
          {people.length} {people.length === 1 ? 'person' : 'people'}
        </div>
      )}

      <TreeCanvas data={treeData} />
    </div>
  )
}
