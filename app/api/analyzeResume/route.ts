import { NextRequest, NextResponse } from 'next/server'
import formidable from 'formidable'
import { promises as fs } from 'fs'
import prisma from '@/lib/prisma'
import { analyzeResume } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let resumeText = ''

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData()
      const file = formData.get('file') as File
      
      if (file) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // For demo purposes, assume text content or simple extraction
        // In production, you'd use proper PDF/DOCX parsers
        resumeText = buffer.toString('utf-8')
        
        // If it looks like binary data, provide fallback
        if (resumeText.includes('\x00') || resumeText.length === 0) {
          resumeText = `Resume file: ${file.name} (${file.size} bytes). Content extraction not implemented for binary files.`
        }
      }
    } else {
      // Handle JSON with text content
      const body = await request.json()
      resumeText = body.text || body.resumeText || ''
    }

    if (!resumeText) {
      return NextResponse.json(
        { error: 'No resume text provided' },
        { status: 400 }
      )
    }

    // Analyze with Claude
    const analysis = await analyzeResume(resumeText)

    // Save to database
    const candidate = await prisma.candidate.create({
      data: {
        name: analysis.name,
        email: analysis.email,
        skills: JSON.stringify(analysis.skills),
        overallScore: analysis.overall_score,
        softSkills: analysis.soft_skills_score,
        explanations: JSON.stringify(analysis.explanations),
      }
    })

    return NextResponse.json({
      candidateId: candidate.id,
      analysis
    })
  } catch (error) {
    console.error('Resume analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    )
  }
}
