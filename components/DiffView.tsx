'use client'
import React from 'react'

type Props = {
  diffContent?: string
  className?: string
}

export default function DiffView({ diffContent, className = '' }: Props) {
  if (!diffContent) {
    return (
      <div className={`rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 p-4 ${className}`}>
        <div className="text-sm text-gray-400">No recent changes</div>
      </div>
    )
  }

  // Take the last 15-25 lines for display
  const lines = diffContent.split('\n')
  const displayLines = lines.slice(-25)

  return (
    <div className={`rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 p-4 ${className}`}>
      <div className="text-sm font-medium mb-2 text-white">Recent Code Changes</div>
      <pre className="text-xs font-mono bg-black/50 backdrop-blur-xl rounded-lg border border-white/10 p-3 overflow-auto max-h-64">
        {displayLines.map((line, index) => (
          <div
            key={index}
            className={
              line.startsWith('+') 
                ? 'text-green-400' 
                : line.startsWith('-')
                ? 'text-red-400'
                : 'text-gray-300'
            }
          >
            {line}
          </div>
        ))}
      </pre>
    </div>
  )
}
