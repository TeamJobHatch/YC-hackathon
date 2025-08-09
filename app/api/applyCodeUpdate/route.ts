import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'
import { applyUpdate } from '@/lib/ai/morph'

const DEFAULT_UPDATE_SNIPPET = `// 1) Add a Soft Skills section below Overall Score.
// 2) Add a tiny "UpdatedAt" label reading from a GET /api/system-state.
// 3) Keep styles consistent with Tailwind utilities already used.

import React from 'react'

// Add helper to render a meter
function SoftMeter({ value = 0 }: { value?: number }) {
  const pct = Math.max(0, Math.min(100, value ?? 0))
  return (
    <div className="mt-2">
      <div className="h-2 w-full rounded bg-gray-200">
        <div className="h-2 rounded bg-blue-500" style={{ width: \`\${pct}%\` }} />
      </div>
      <div className="text-xs mt-1">Soft Skills: {pct}%</div>
    </div>
  )
}

// In the default export, after Overall Score block, insert:
{typeof softSkills === 'number' ? <SoftMeter value={softSkills} /> : (
  <div className="text-xs opacity-60 mt-2">Soft skills not evaluated</div>
)}

// At the bottom of the card, add a subtle timestamp badge:
async function UpdatedAt() {
  const res = await fetch('/api/system-state', { cache: 'no-store' })
  const data = await res.json().catch(() => ({}))
  const ts = data?.lastUpdate ? new Date(data.lastUpdate).toLocaleTimeString() : '—'
  return <div className="text-[10px] opacity-50 mt-3">Updated by AI: {ts}</div>
}`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const targetFilePath = body.targetFilePath || 'components/ScoreCard.tsx'
    const updateSnippet = body.updateSnippet || DEFAULT_UPDATE_SNIPPET

    // Read the current file from the workspace
    const fullPath = path.join(process.cwd(), targetFilePath)
    const original = await fs.readFile(fullPath, 'utf-8')

    // Apply the update using Morph
    const { merged, diffPreview } = await applyUpdate({
      path: targetFilePath,
      original,
      updateSnippet
    })

    // Write the updated file back
    await fs.writeFile(fullPath, merged, 'utf-8')

    // Save the system state
    await prisma.systemState.upsert({
      where: { id: 1 },
      update: {
        lastUpdate: new Date(),
        lastPatch: diffPreview,
        targetFile: targetFilePath
      },
      create: {
        id: 1,
        lastUpdate: new Date(),
        lastPatch: diffPreview,
        targetFile: targetFilePath
      }
    })

    return NextResponse.json({
      status: 'applied',
      targetFile: targetFilePath,
      diffPreview: diffPreview.slice(0, 500) // Truncate for response
    })
  } catch (error) {
    console.error('Code update error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to apply code update',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
