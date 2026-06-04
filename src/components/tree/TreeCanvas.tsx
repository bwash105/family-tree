'use client'

import { useCallback, useRef } from 'react'
import Tree from 'react-d3-tree'
import type { RawNodeDatum, CustomNodeElementProps } from 'react-d3-tree'
import type { TreeNodeDatum as AppTreeNodeDatum } from '@/lib/tree/buildTreeData'
import { useRouter } from 'next/navigation'

type Props = {
  data: AppTreeNodeDatum[]
}

function PersonNode({ nodeDatum, toggleNode }: CustomNodeElementProps) {
  const router = useRouter()
  const appNode = nodeDatum as unknown as AppTreeNodeDatum

  function handleClick() {
    if (appNode.__person?.id) {
      router.push(`/people/${appNode.__person.id}`)
    } else {
      toggleNode()
    }
  }

  const hasChildren = (nodeDatum.children?.length ?? 0) > 0

  return (
    <g onClick={handleClick} style={{ cursor: 'pointer' }}>
      {/* Circle avatar */}
      <circle r={28} fill="#fef3c7" stroke="#d97706" strokeWidth={2} />
      {/* Name text */}
      <text
        y={44}
        textAnchor="middle"
        style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', fill: '#1f2937' }}
      >
        {nodeDatum.name.length > 18 ? nodeDatum.name.slice(0, 16) + '…' : nodeDatum.name}
      </text>
      {/* Birth year if present */}
      {nodeDatum.attributes?.['Born'] && (
        <text
          y={57}
          textAnchor="middle"
          style={{ fontSize: '9px', fontFamily: 'Inter, sans-serif', fill: '#6b7280' }}
        >
          b. {String(nodeDatum.attributes['Born']).slice(0, 4)}
        </text>
      )}
      {/* Expand indicator */}
      {hasChildren && (
        <circle cx={0} cy={28} r={6} fill="#d97706" />
      )}
    </g>
  )
}

export function TreeCanvas({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const renderNode = useCallback(
    (props: CustomNodeElementProps) => <PersonNode {...props} />,
    []
  )

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-4">🌱</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Start your family tree</h2>
        <p className="text-gray-500 text-sm mb-6">
          Add your first family member to get started.
        </p>
        <a
          href="/people/new"
          className="bg-amber-600 text-white rounded-xl px-6 py-3 font-semibold touch-manipulation"
        >
          Add first person
        </a>
      </div>
    )
  }

  // react-d3-tree expects a single root node. If multiple roots, wrap in a virtual root.
  const treeData: RawNodeDatum =
    data.length === 1
      ? (data[0] as unknown as RawNodeDatum)
      : {
          name: 'Family',
          children: data as unknown as RawNodeDatum[],
        }

  return (
    <div ref={containerRef} className="w-full h-full">
      <Tree
        data={treeData}
        orientation="vertical"
        renderCustomNodeElement={renderNode}
        pathFunc="step"
        separation={{ siblings: 1.5, nonSiblings: 2 }}
        nodeSize={{ x: 140, y: 120 }}
        translate={{ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400, y: 80 }}
        zoom={0.8}
        enableLegacyTransitions={false}
        pathClassFunc={() => 'stroke-amber-400 stroke-1 fill-none'}
      />
    </div>
  )
}
