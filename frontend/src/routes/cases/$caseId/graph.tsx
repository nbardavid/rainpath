import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMemo } from 'react'
import { GraphBadge } from '@/components/cases/graph/Badge'
import { ShortcutHint } from '@/components/common/ShortcutHint'
import { countBlocks, countSlides } from '@/components/cases/graph/utils'
import { fetchCaseById } from '@/lib/api'
import {
  formatBlockLabel,
  formatSlideLabel,
  formatSpecimenLabel,
} from '@/lib/caseLabels'
import { useGlobalShortcut } from '@/lib/useGlobalShortcut'
import type { CaseRecord } from '@/types/cases'

const HORIZONTAL_SPACING = 240
const VERTICAL_SPACING = 180
const BLOCK_EDGE_COLORS = [
  '#7c3aed',
  '#2563eb',
  '#0ea5e9',
  '#22c55e',
  '#f97316',
  '#ec4899',
]

interface FlowElements {
  nodes: Node[]
  edges: Edge[]
}

interface HierarchySummary {
  totalSpecimens: number
  totalBlocks: number
  totalSlides: number
}

export const Route = createFileRoute('/cases/$caseId/graph')({
  loader: async ({ params }) => {
    const caseId = Number(params.caseId)
    if (!Number.isFinite(caseId)) {
      throw new Error('Identifiant de dossier invalide.')
    }
    return fetchCaseById(caseId)
  },
  component: GraphViewPage,
  pendingComponent: GraphViewPending,
  errorComponent: GraphViewError,
})

function GraphViewPending() {
  return (
    <main className="bg-[color-mix(in oklch,var(--background) 90%,var(--foreground))]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-7xl items-center justify-center px-4 py-10 text-[var(--muted-foreground)] sm:px-6 lg:px-8">
        Chargement de la vue graphique…
      </div>
    </main>
  )
}

function GraphViewError({ error }: { error: unknown }) {
  const message =
    error instanceof Error
      ? error.message
      : 'Impossible de charger la vue graphique pour ce dossier.'

  return (
    <main className="bg-[color-mix(in oklch,var(--background) 90%,var(--foreground))]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-8 py-10 text-center text-[var(--foreground)] shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
            Erreur de chargement
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Vue graphique indisponible</h1>
          <p className="mt-4 text-base text-[var(--muted-foreground)]">{message}</p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/30"
            >
              Retour aux dossiers
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function GraphViewPage() {
  const router = useRouter()
  const caseRecord = Route.useLoaderData() as CaseRecord
  const stats = {
    specimens: caseRecord.specimens.length,
    blocks: countBlocks(caseRecord.specimens),
    slides: countSlides(caseRecord.specimens),
  }

  const flowElements = useMemo(
    () =>
      createFlowElements(caseRecord, {
        totalSpecimens: stats.specimens,
        totalBlocks: stats.blocks,
        totalSlides: stats.slides,
      }),
    [caseRecord, stats.blocks, stats.slides, stats.specimens],
  )

  useGlobalShortcut('ctrl+o', () => router.navigate({ to: '/' }))

  return (
    <main className="bg-[color-mix(in oklch,var(--background) 90%,var(--foreground))]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--muted-foreground)]">
              Vue graphique
            </p>
            <h1 className="text-3xl font-semibold text-[var(--foreground)]">
              {caseRecord.identifier}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">Dossier #{caseRecord.id}</p>
          </div>
          <Link
            to="/"
            className="relative inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 pr-20 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--foreground)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/30"
          >
            vue dossier
            <ShortcutHint
              combo="Ctrl + O"
              className="absolute right-3 top-1/2 -translate-y-1/2 border-[var(--muted-foreground)]/40 text-[0.65rem] text-[var(--muted-foreground)]/80"
            />
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-[var(--muted-foreground)]">
          {[
            { label: 'Prélèvements', value: stats.specimens },
            { label: 'Blocs', value: stats.blocks },
            { label: 'Lames', value: stats.slides },
          ].map((stat) => (
            <GraphBadge key={stat.label}>
              {stat.label} : {stat.value}
            </GraphBadge>
          ))}
        </div>

        {stats.specimens === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)] px-8 py-6 text-sm text-[var(--muted-foreground)]">
            Ce dossier ne contient pas encore de prélèvements. Ajoutez des données pour visualiser
            la hiérarchie.
          </div>
        )}

        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <ReactFlow
            nodes={flowElements.nodes}
            edges={flowElements.edges}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnScroll
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.4}
            maxZoom={1.5}
            className="bg-[color-mix(in oklch,var(--background) 96%,var(--foreground))]"
            style={{ width: '100%', minHeight: '60vh' }}
          >
            <Background gap={32} color="color-mix(in oklch,var(--foreground) 25%,var(--background))" />
            <MiniMap
              pannable
              zoomable
              nodeColor={() => 'var(--accent, var(--foreground))'}
              className="!bg-[var(--card)] !text-[var(--foreground)]"
            />
            <Controls position="bottom-right" />
          </ReactFlow>
        </div>
      </div>
    </main>
  )
}

function createFlowElements(caseRecord: CaseRecord, summary: HierarchySummary): FlowElements {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const levelCounts: Record<number, number> = {
    0: 1,
    1: summary.totalSpecimens,
    2: summary.totalBlocks,
    3: summary.totalSlides,
  }
  const levelIndices = new Map<number, number>()
  let blockColorCursor = 0

  const getPosition = (level: number) => {
    const index = levelIndices.get(level) ?? 0
    levelIndices.set(level, index + 1)
    const count = levelCounts[level] ?? 1
    const offset = count > 1 ? -((count - 1) * HORIZONTAL_SPACING) / 2 : 0
    return {
      x: offset + index * HORIZONTAL_SPACING,
      y: level * VERTICAL_SPACING,
    }
  }

  const nextBlockColor = () => {
    const color = BLOCK_EDGE_COLORS[blockColorCursor % BLOCK_EDGE_COLORS.length]
    blockColorCursor += 1
    return color
  }

  const addSpecimenNode = (specimen: CaseRecord['specimens'][number], specimenIndex: number) => {
    const nodeId = `specimen-${specimen.id}`
    nodes.push({
      id: nodeId,
      data: {
        label: (
          <NodeLabel
            title="Prélèvement"
            primary={formatSpecimenLabel(specimenIndex)}
            secondary={`${specimen.blocks.length} blocs`}
          />
        ),
      },
      position: getPosition(1),
      style: getNodeStyle(1),
      draggable: false,
    })
    edges.push(createEdge(`case-${caseRecord.id}`, nodeId))
    return nodeId
  }

  const addBlockNode = (
    block: CaseRecord['specimens'][number]['blocks'][number],
    blockIndex: number,
    specimenNodeId: string,
  ) => {
    const color = nextBlockColor()
    const nodeId = `block-${block.id}`
    nodes.push({
      id: nodeId,
      data: {
        label: (
          <NodeLabel
            title="Bloc"
            primary={formatBlockLabel(blockIndex)}
            secondary={`${block.slides.length} lames`}
          />
        ),
      },
      position: getPosition(2),
      style: {
        ...getNodeStyle(2),
        border: `2px solid ${color}`,
      },
      draggable: false,
    })
    edges.push(createEdge(specimenNodeId, nodeId))
    return { nodeId, color }
  }

  const addSlideNode = (
    slide: CaseRecord['specimens'][number]['blocks'][number]['slides'][number],
    slideIndex: number,
    blockNodeId: string,
    blockColor: string,
  ) => {
    const nodeId = `slide-${slide.id}`
    nodes.push({
      id: nodeId,
      data: {
        label: (
          <NodeLabel
            title="Lame"
            primary={formatSlideLabel(slideIndex)}
            secondary={slide.staining}
          />
        ),
      },
      position: getPosition(3),
      style: getNodeStyle(3),
      type: 'output',
      draggable: false,
    })
    edges.push(createEdge(blockNodeId, nodeId, blockColor))
  }

  const addCaseNode = () => {
    nodes.push({
      id: `case-${caseRecord.id}`,
      data: {
        label: (
          <NodeLabel
            title="Dossier"
            primary={caseRecord.identifier}
            secondary={`${summary.totalSpecimens} prélèvements`}
          />
        ),
      },
      position: getPosition(0),
      type: 'input',
      style: getNodeStyle(0),
      draggable: false,
    })
  }

  addCaseNode()

  caseRecord.specimens.forEach((specimen, specimenIndex) => {
    const specimenNodeId = addSpecimenNode(specimen, specimenIndex)

    specimen.blocks.forEach((block, blockIndex) => {
      const { nodeId: blockNodeId, color } = addBlockNode(block, blockIndex, specimenNodeId)

      block.slides.forEach((slide, slideIndex) => {
        addSlideNode(slide, slideIndex, blockNodeId, color)
      })
    })
  })

  return { nodes, edges }
}

interface NodeLabelProps {
  title: string
  primary: string
  secondary?: string
}

function NodeLabel({ title, primary, secondary }: NodeLabelProps) {
  return (
    <div className="flex flex-col gap-0.5 text-left">
      <span className="text-[0.65rem] uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </span>
      <span className="text-sm font-semibold text-[var(--foreground)]">{primary}</span>
      {secondary ? (
        <span className="text-xs text-[var(--muted-foreground)]">{secondary}</span>
      ) : null}
    </div>
  )
}

function getNodeStyle(level: number): Node['style'] {
  const baseStyle: NonNullable<Node['style']> = {
    borderRadius: 16,
    border: '1px solid var(--border)',
    padding: 12,
    width: 200,
    background: 'var(--card)',
    color: 'var(--foreground)',
    boxShadow: '0px 8px 24px rgba(15, 23, 42, 0.08)',
  }

  const backgroundByLevel: Record<number, string> = {
    0: 'color-mix(in oklch,var(--card) 92%,var(--foreground))',
    1: 'color-mix(in oklch,var(--card) 95%,var(--foreground))',
    2: 'color-mix(in oklch,var(--card) 97%,var(--foreground))',
    3: 'var(--card)',
  }

  return {
    ...baseStyle,
    background: backgroundByLevel[level] ?? baseStyle.background,
  }
}

function createEdge(source: string, target: string, color?: string): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    type: 'smoothstep',
    animated: false,
    style: {
      stroke: color ?? 'color-mix(in oklch,var(--foreground) 35%,var(--border))',
      strokeWidth: color ? 2.5 : 1.5,
    },
  }
}
