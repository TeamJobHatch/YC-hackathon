'use client'
import React from 'react'
import ScoreCard from '@/components/ScoreCard'
import DiffView from '@/components/DiffView'

interface CandidateData {
  id: string
  name: string | null
  email: string | null
  skills: string
  overallScore: number | null
  softSkills: number | null
  explanations: string | null
  createdAt: Date
}

interface SystemStateData {
  id: number
  lastUpdate: Date | null
  lastPatch: string | null
  targetFile: string | null
}

interface Props {
  candidate: CandidateData
  systemState: SystemStateData | null
}

export default function CandidateClient({ candidate, systemState }: Props) {
  // Parse JSON fields
  const skills = candidate.skills ? JSON.parse(candidate.skills) : []
  const explanations = candidate.explanations ? JSON.parse(candidate.explanations) : {}

  // Check if updated recently (within 2 minutes)
  const isRecentlyUpdated = systemState?.lastUpdate && 
    (Date.now() - new Date(systemState.lastUpdate).getTime()) < 120000

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Candidate Analysis</h1>
          {isRecentlyUpdated && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              ✨ Updated by AI just now
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Score Card */}
            <ScoreCard
              name={candidate.name || undefined}
              email={candidate.email || undefined}
              overallScore={candidate.overallScore || undefined}
              softSkills={candidate.softSkills || undefined}
            />

            {/* Skills */}
            {skills.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Explanations */}
            {explanations && Object.keys(explanations).length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-3">Analysis Details</h3>
                <div className="space-y-3">
                  {Object.entries(explanations).map(([key, value]) => (
                    <div key={key}>
                      <div className="font-medium text-sm text-gray-700 capitalize">
                        {key.replace('_', ' ')}:
                      </div>
                      <div className="text-gray-600 text-sm">
                        {String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Created:</span><br />
                  {new Date(candidate.createdAt).toLocaleString()}
                </div>
                <div>
                  <span className="text-gray-600">ID:</span><br />
                  <code className="text-xs bg-white px-1 py-0.5 rounded">
                    {candidate.id}
                  </code>
                </div>
              </div>
            </div>

            {/* Recent Code Changes */}
            {systemState?.lastPatch && (
              <div>
                <h4 className="font-medium mb-3">Recent Code Changes</h4>
                <DiffView diffContent={systemState.lastPatch} />
                {systemState.lastUpdate && (
                  <div className="mt-2 text-xs text-gray-500">
                    Updated: {new Date(systemState.lastUpdate).toLocaleString()}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                ← Back to Home
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                🔄 Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
