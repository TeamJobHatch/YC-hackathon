'use client'
import React, { useState } from 'react'

export default function UploadBox() {
  const [isUploading, setIsUploading] = useState(false)
  const [text, setText] = useState('')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyzeResume', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.candidateId) {
        // Use window.location for navigation to avoid SSR/Client issues
        window.location.href = `/candidate/${result.candidateId}`
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload resume')
    } finally {
      setIsUploading(false)
    }
  }

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsUploading(true)
    
    try {
      const response = await fetch('/api/analyzeResume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      const result = await response.json()
      
      if (result.candidateId) {
        // Use window.location for navigation to avoid SSR/Client issues
        window.location.href = `/candidate/${result.candidateId}`
      }
    } catch (error) {
      console.error('Text analysis error:', error)
      alert('Failed to analyze resume text')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-4">Upload Resume</h3>
        
        {/* File Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="text-sm text-gray-500 mb-4">or</div>

        {/* Text Input */}
        <form onSubmit={handleTextSubmit} className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste resume text here..."
            disabled={isUploading}
            className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none"
          />
          <button
            type="submit"
            disabled={isUploading || !text.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </form>
      </div>
    </div>
  )
}
