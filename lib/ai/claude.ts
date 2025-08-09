import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const ResumeAnalysisSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(), 
  skills: z.array(z.string()).default([]),
  overall_score: z.number().min(0).max(100).optional(),
  soft_skills_score: z.number().min(0).max(100).optional(),
  explanations: z.record(z.string()).optional(),
})

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Analyze this resume and return ONLY valid JSON with the following structure:
{
  "name": "candidate name",
  "email": "email address", 
  "skills": ["skill1", "skill2", "skill3"],
  "overall_score": 85,
  "soft_skills_score": 78,
  "explanations": {
    "overall": "Brief explanation of overall score",
    "soft_skills": "Brief explanation of soft skills assessment"
  }
}

Score from 0-100. If soft_skills_score cannot be determined, use 65 as default.

Resume text:
${resumeText}`
      }]
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    let jsonText = content.text.trim()
    
    // Clean up the response - remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }

    const parsed = JSON.parse(jsonText)
    const validated = ResumeAnalysisSchema.parse(parsed)
    
    // Ensure soft_skills_score has a default if missing
    if (!validated.soft_skills_score) {
      validated.soft_skills_score = 65
    }

    return validated
  } catch (error) {
    console.error('Claude analysis error:', error)
    
    // Return a helpful example payload on failure
    return {
      name: 'Parse Error',
      email: undefined,
      skills: ['Error parsing resume'],
      overall_score: 50,
      soft_skills_score: 65,
      explanations: {
        error: 'Failed to analyze resume. Please try again.',
        example: 'Expected format: {name, email, skills[], overall_score, soft_skills_score, explanations{}}'
      }
    }
  }
}
