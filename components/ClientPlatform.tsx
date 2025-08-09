'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import UploadBox from "@/components/UploadBox"
import DemoBar from "@/components/DemoBar"
import DiffView from "@/components/DiffView"
import Terminal from "@/components/Terminal"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Brain, Code, Zap, CheckCircle, XCircle, AlertCircle, Github, ExternalLink } from "lucide-react"

interface SystemState {
  lastUpdate?: string
  lastPatch?: string
  targetFile?: string
}

interface Candidate {
  id: string
  name?: string
}

interface ClientPlatformProps {
  initialSystemState: SystemState | null
  initialSampleCandidate: Candidate | null
}

interface ApiStatus {
  claude: 'checking' | 'connected' | 'error'
  morph: 'checking' | 'connected' | 'error'
  freestyle: 'checking' | 'connected' | 'error'
}

export default function ClientPlatform({ initialSystemState, initialSampleCandidate }: ClientPlatformProps) {
  const [systemState] = useState(initialSystemState)
  const [sampleCandidate] = useState(initialSampleCandidate)
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    claude: 'checking',
    morph: 'checking',
    freestyle: 'checking'
  })

  // Check API key status on mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/status')
        const status = await response.json()
        setApiStatus(status)
      } catch (error) {
        console.error('API status check failed:', error)
        setApiStatus({
          claude: 'error',
          morph: 'error', 
          freestyle: 'error'
        })
      }
    }

    checkApiStatus()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-3 h-3 text-green-400" />
      case 'error': return <XCircle className="w-3 h-3 text-red-400" />
      default: return <AlertCircle className="w-3 h-3 text-yellow-400 animate-pulse" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'error': return 'Error'
      default: return 'Checking...'
    }
  }

  return (
    <>
      {/* Platform Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/30">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Resume-to-Hire</h1>
                <p className="text-sm text-gray-300">Instant Platform</p>
              </div>
            </div>
            
            {/* Navigation */}
            <div className='flex items-center space-x-4'>
              <Link 
                href="https://github.com/TeamJobHatch/YC-hackathon" 
                target="_blank"
                className="inline-flex items-center space-x-2 px-3 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-xl rounded-md text-sm font-medium transition-all"
              >
                <Github className="w-4 h-4" />
                <span>View Code</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              
              <Link 
                href="#demo"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-md text-sm font-medium shadow-lg shadow-purple-500/25 transition-all"
              >
                Try Demo
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      {/* API Status Indicator */}
      <div className="fixed top-24 right-4 z-40 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 p-3 shadow-2xl max-w-[200px]">
        <h4 className="text-white font-semibold text-xs mb-2">API Status</h4>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-orange-300 text-[10px] font-mono">CLAUDE</span>
            <div className="flex items-center space-x-1">
              {getStatusIcon(apiStatus.claude)}
              <span className="text-[10px] text-gray-300">{getStatusText(apiStatus.claude)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-purple-300 text-[10px] font-mono">MORPH</span>
            <div className="flex items-center space-x-1">
              {getStatusIcon(apiStatus.morph)}
              <span className="text-[10px] text-gray-300">{getStatusText(apiStatus.morph)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-300 text-[10px] font-mono">FREESTYLE</span>
            <div className="flex items-center space-x-1">
              {getStatusIcon(apiStatus.freestyle)}
              <span className="text-[10px] text-gray-300">{getStatusText(apiStatus.freestyle)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-8 pb-12 px-4 relative z-10">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 px-6 py-3 text-sm font-medium bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg shadow-purple-500/25">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Resume Platform
          </Badge>
          
          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white">
            Resume-to-Hire
            <br />
            <span className="text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text animate-pulse">
              Instant Platform
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Upload a resume → AI analyzes & scores → Code updates live → Deploy shows real-time changes
          </p>

          {/* Feature Cards with Glass Morphism */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/25 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">AI Analysis</h3>
              <p className="text-gray-300 leading-relaxed">Claude extracts skills and generates comprehensive scores</p>
              <div className="mt-4 text-xs text-blue-300 font-mono">Powered by Anthropic</div>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/25 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">Live Code Updates</h3>
              <p className="text-gray-300 leading-relaxed">Morph modifies UI components in real-time</p>
              <div className="mt-4 text-xs text-purple-300 font-mono">Powered by Morph Apply</div>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/25 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">Auto Deploy</h3>
              <p className="text-gray-300 leading-relaxed">Freestyle deploys changes instantly</p>
              <div className="mt-4 text-xs text-cyan-300 font-mono">Powered by Freestyle</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Platform */}
      <section className="pb-20 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          
          {/* Demo Bar */}
          <div id="demo" className="mb-12">
            <DemoBar />
          </div>
          
          {/* Platform Interface with Glass Morphism */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Upload Section */}
            <div className="group bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/20 hover:shadow-blue-500/20 hover:bg-white/15 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
              <div className="relative">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  Upload & Analyze
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Upload a resume file or paste text to get started with AI analysis
                </p>
                <UploadBox />
              </div>
            </div>
            
            {/* Activity Section */}
            <div className="group bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/20 hover:shadow-purple-500/20 hover:bg-white/15 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl"></div>
              <div className="relative">
                <h3 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-purple-500/30">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  Recent Activity
                </h3>
                
                {systemState?.lastUpdate ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-lg shadow-green-500/10">
                      <div className="text-sm font-medium text-green-300">
                        ✅ Last update: {new Date(systemState.lastUpdate).toLocaleString()}
                      </div>
                      <div className="text-sm text-green-400 mt-1">
                        Modified: {systemState.targetFile}
                      </div>
                    </div>
                    <DiffView diffContent={systemState.lastPatch || ''} />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-white/10">
                      <Zap className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-300 mb-2">No recent updates</p>
                    <p className="text-sm text-gray-400">Start by analyzing a resume above</p>
                  </div>
                )}
                
                {/* Sample candidate link */}
                {sampleCandidate && (
                  <div className="mt-6 p-4 bg-blue-500/10 backdrop-blur-xl rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/10">
                    <div className="text-sm font-medium text-blue-300 mb-2">💼 Sample Result Available</div>
                    <a 
                      href={`/candidate/${sampleCandidate.id}`}
                      className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors"
                    >
                      View {sampleCandidate.name || 'Latest Candidate'} Analysis →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Terminal Component */}
      <Terminal />
    </div>
    </>
  )
}
