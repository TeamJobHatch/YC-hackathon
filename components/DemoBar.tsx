'use client'
import React, { useState } from 'react'

export default function DemoBar() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployId, setDeployId] = useState<string | null>(null)
  const [deployStatus, setDeployStatus] = useState<string>('')

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // @ts-ignore
    window.addTerminalLog?.('system', 'info', 'Starting resume analysis demo...')
    // @ts-ignore
    window.addTerminalLog?.('claude', 'info', 'Initializing Claude AI model...')
    
    try {
      const sampleResume = `John Doe
Software Engineer
john.doe@email.com

Experience:
- 5 years React development
- Team leadership
- Problem solving
- Communication skills
- Project management

Skills: JavaScript, TypeScript, React, Node.js, Python`

      // @ts-ignore
      window.addTerminalLog?.('claude', 'info', 'Processing resume content with Anthropic Claude...')
      
      const response = await fetch('/api/analyzeResume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sampleResume })
      })

      const result = await response.json()
      
      if (result.candidateId) {
        // @ts-ignore
        window.addTerminalLog?.('claude', 'success', `Analysis complete! Generated candidate ID: ${result.candidateId.slice(0, 8)}...`)
        // @ts-ignore
        window.addTerminalLog?.('system', 'info', 'Redirecting to candidate analysis page...')
        setTimeout(() => {
          window.location.href = `/candidate/${result.candidateId}`
        }, 1000)
      }
    } catch (error) {
      console.error('Demo analyze error:', error)
      // @ts-ignore
      window.addTerminalLog?.('claude', 'error', 'Analysis failed: ' + (error as Error).message)
      alert('Demo analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleApplyUpdate = async () => {
    setIsUpdating(true)
    // @ts-ignore
    window.addTerminalLog?.('system', 'info', 'Initiating live code update...')
    // @ts-ignore
    window.addTerminalLog?.('morph', 'info', 'Connecting to Morph Apply API...')
    
    try {
      // @ts-ignore
      window.addTerminalLog?.('morph', 'info', 'Reading target file: components/ScoreCard.tsx')
      // @ts-ignore
      window.addTerminalLog?.('morph', 'info', 'Generating code update snippet...')
      
      const response = await fetch('/api/applyCodeUpdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      const result = await response.json()
      
      if (result.status === 'applied') {
        // @ts-ignore
        window.addTerminalLog?.('morph', 'success', `Code successfully updated: ${result.targetFile}`)
        // @ts-ignore
        window.addTerminalLog?.('system', 'info', 'Diff preview generated and saved to database')
        alert(`✅ Code update applied to ${result.targetFile}`)
      }
    } catch (error) {
      console.error('Demo update error:', error)
      // @ts-ignore
      window.addTerminalLog?.('morph', 'error', 'Code update failed: ' + (error as Error).message)
      alert('Code update failed')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    // @ts-ignore
    window.addTerminalLog?.('system', 'info', 'Starting deployment process...')
    // @ts-ignore
    window.addTerminalLog?.('freestyle', 'info', 'Connecting to Freestyle deployment service...')
    
    try {
      // @ts-ignore
      window.addTerminalLog?.('freestyle', 'info', 'Preparing deployment payload...')
      
      const response = await fetch('/api/triggerDeploy', {
        method: 'POST'
      })

      const result = await response.json()
      
      if (result.deployId) {
        // @ts-ignore
        window.addTerminalLog?.('freestyle', 'success', `Deployment initiated! ID: ${result.deployId}`)
        setDeployId(result.deployId)
        pollDeployStatus(result.deployId)
      }
    } catch (error) {
      console.error('Demo deploy error:', error)
      // @ts-ignore
      window.addTerminalLog?.('freestyle', 'error', 'Deployment failed: ' + (error as Error).message)
      alert('Deploy failed')
      setIsDeploying(false)
    }
  }

  const pollDeployStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/deployStatus?id=${id}`)
      const status = await response.json()
      
      setDeployStatus(`${status.phase}: ${status.status}`)
      // @ts-ignore
      window.addTerminalLog?.('freestyle', 'info', `Status: ${status.phase} - ${status.status}`)
      
      if (status.status === 'success' || status.status === 'failed') {
        setIsDeploying(false)
        if (status.status === 'success') {
          // @ts-ignore
          window.addTerminalLog?.('freestyle', 'success', 'Deployment completed successfully! 🎉')
          // @ts-ignore
          window.addTerminalLog?.('system', 'info', 'Platform ready for demo. Refresh to see changes.')
          alert('🚀 Deploy completed! Refresh the page to see changes.')
        } else {
          // @ts-ignore
          window.addTerminalLog?.('freestyle', 'error', 'Deployment failed')
        }
      } else {
        // Poll again after 2 seconds
        setTimeout(() => pollDeployStatus(id), 2000)
      }
    } catch (error) {
      console.error('Status polling error:', error)
      // @ts-ignore
      window.addTerminalLog?.('freestyle', 'error', 'Status polling error: ' + (error as Error).message)
      setIsDeploying(false)
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-black/20">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">🚀 Interactive Demo Pipeline</h3>
        <p className="text-gray-300">Watch the real-time terminal output below to see each sponsor in action</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex flex-col items-center p-4 bg-white rounded-xl border border-green-200 hover:border-green-400 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl">🧠</span>
          </div>
          <h4 className="font-semibold text-green-800 mb-1">
            {isAnalyzing ? 'Analyzing...' : 'Step 1: Analyze'}
          </h4>
          <p className="text-sm text-green-600 text-center">
            {isAnalyzing ? 'Claude is processing...' : 'Upload & score resume with AI'}
          </p>
        </button>
        
        <button
          onClick={handleApplyUpdate}
          disabled={isUpdating}
          className="flex flex-col items-center p-4 bg-white rounded-xl border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl">⚡</span>
          </div>
          <h4 className="font-semibold text-orange-800 mb-1">
            {isUpdating ? 'Updating...' : 'Step 2: Update Code'}
          </h4>
          <p className="text-sm text-orange-600 text-center">
            {isUpdating ? 'Morph is applying changes...' : 'Modify UI components live'}
          </p>
        </button>
        
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="flex flex-col items-center p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl">🚀</span>
          </div>
          <h4 className="font-semibold text-purple-800 mb-1">
            {isDeploying ? 'Deploying...' : 'Step 3: Deploy'}
          </h4>
          <p className="text-sm text-purple-600 text-center">
            {isDeploying ? 'Freestyle is deploying...' : 'Auto-deploy & see changes'}
          </p>
        </button>
      </div>
      
      {deployStatus && (
        <div className="mt-2 text-sm text-gray-600">
          Deploy Status: {deployStatus}
        </div>
      )}
    </div>
  )
}
