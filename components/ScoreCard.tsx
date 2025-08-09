'use client'
import React from 'react'

type Props = { 
  name?: string
  email?: string
  overallScore?: number
  softSkills?: number 
}

export default function ScoreCard({ name, email, overallScore, softSkills }: Props) {
  return (
    <div className="rounded-2xl p-4 shadow">
      <h2 className="text-xl font-semibold">{name ?? 'Unknown'}</h2>
      <p className="text-sm opacity-70">{email ?? '—'}</p>
      <div className="mt-3">
        <div className="text-sm">Overall Score</div>
        <div className="text-3xl font-bold">{overallScore ?? '—'}</div>
      </div>
      {/* No soft skills UI yet — Morph will add it live */}
    </div>
  )
}
