'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Terminal as TerminalIcon, X } from 'lucide-react'

interface TerminalLog {
  id: string
  timestamp: string
  service: 'claude' | 'morph' | 'freestyle' | 'system'
  level: 'info' | 'success' | 'warning' | 'error'
  message: string
}

interface TerminalProps {
  className?: string
}

const serviceColors = {
  claude: 'text-orange-400',
  morph: 'text-purple-400', 
  freestyle: 'text-blue-400',
  system: 'text-green-400'
}

const levelColors = {
  info: 'text-gray-300',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400'
}

export default function Terminal({ className = '' }: TerminalProps) {
  const [logs, setLogs] = useState<TerminalLog[]>([])
  const [isMinimized, setIsMinimized] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  // Global function to add logs from anywhere in the app
  useEffect(() => {
    // @ts-ignore
    window.addTerminalLog = (service: string, level: string, message: string) => {
      const newLog: TerminalLog = {
        id: Math.random().toString(36),
        timestamp: new Date().toLocaleTimeString(),
        service: service as any,
        level: level as any,
        message
      }
      setLogs(prev => [...prev.slice(-50), newLog]) // Keep last 50 logs
    }

    // Initial system log
    // @ts-ignore
    window.addTerminalLog('system', 'info', 'Resume-to-Hire platform initialized')
    // @ts-ignore
    window.addTerminalLog('system', 'info', 'Sponsors: Claude AI, Morph Apply, Freestyle Deploy')

    return () => {
      // @ts-ignore
      delete window.addTerminalLog
    }
  }, [])

  const clearLogs = () => setLogs([])

  if (isMinimized) {
    return (
      <div className={`h-full w-full flex items-center justify-center ${className}`}>
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center space-x-2 bg-black/90 backdrop-blur-sm text-green-400 px-4 py-2 rounded-lg border border-green-500/30 hover:border-green-500/50 transition-all shadow-lg shadow-green-500/20"
        >
          <TerminalIcon className="w-4 h-4" />
          <span className="text-sm font-mono">Sponsor Monitor ({logs.length})</span>
        </button>
      </div>
    )
  }

  return (
    <div className={`h-full w-full ${className}`}>
      <div className="bg-black/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden h-full">
        {/* Terminal Header */}
        <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <TerminalIcon className="w-4 h-4" />
                <span className="text-sm font-mono font-bold">Sponsor Activity Monitor</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={clearLogs}
                className="text-gray-400 hover:text-white transition-colors text-xs font-mono px-2 py-1 rounded"
              >
                clear
              </button>

              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Sponsor Legend */}
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-orange-300 font-mono">CLAUDE</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-purple-300 font-mono">MORPH</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-blue-300 font-mono">FREESTYLE</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-300 font-mono">SYSTEM</span>
            </div>
          </div>
        </div>

        {/* Terminal Content */}
        <div 
          ref={scrollRef}
          className="p-4 font-mono text-sm overflow-y-auto custom-scrollbar"
          style={{ height: 'calc(100vh - 90px)' }}
        >
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <TerminalIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Waiting for backend activity...</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="mb-1 flex items-start space-x-2">
                <span className="text-gray-500 text-xs flex-shrink-0 mt-0.5">
                  {log.timestamp}
                </span>
                <span className={`font-bold flex-shrink-0 ${serviceColors[log.service]} uppercase text-xs mt-0.5`}>
                  [{log.service}]
                </span>
                <span className={`${levelColors[log.level]} leading-relaxed`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}
