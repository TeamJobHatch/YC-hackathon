"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { Brain, Github, ExternalLink } from 'lucide-react'

export default function PlatformHeader() {
   return (
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
                  <Button variant="outline" size="sm" asChild className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl">
                     <Link 
                        href="https://github.com/TeamJobHatch/YC-hackathon" 
                        target="_blank"
                        className="flex items-center space-x-2"
                     >
                        <Github className="w-4 h-4" />
                        <span>View Code</span>
                        <ExternalLink className="w-3 h-3" />
                     </Link>
                  </Button>
                  
                  <Button size="sm" asChild className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shadow-lg shadow-purple-500/25">
                     <Link href="#demo">
                        Try Demo
                     </Link>
                  </Button>
               </div>
            </nav>
         </div>
      </header>
   )
}
