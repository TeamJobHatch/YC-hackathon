'use client'
import React from 'react'
import Terminal from '@/components/Terminal'

interface GlobalLayoutProps {
  children: React.ReactNode
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Main Content Area - 2/3 width */}
      <div className="w-2/3 min-h-screen">
        {children}
      </div>
      
      {/* Terminal Component - Right 1/3 - Fixed Sidebar */}
      <div className="w-1/3 min-h-screen bg-black/95 backdrop-blur-xl border-l border-white/10 flex-shrink-0 fixed right-0 top-0">
        <div className="absolute top-2 right-2 z-50 bg-red-500 text-white text-xs px-2 py-1 rounded">
          DEBUG: Global Terminal
        </div>
        <Terminal className="h-full w-full" />
      </div>
    </div>
  )
}
