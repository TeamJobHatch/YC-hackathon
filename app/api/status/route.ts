import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if environment variables are present
    const claudeKey = process.env.ANTHROPIC_API_KEY
    const morphKey = process.env.MORPH_API_KEY
    const freestyleToken = process.env.FREESTYLE_TOKEN

    const status = {
      claude: claudeKey && claudeKey !== 'YOUR_KEY' ? 'connected' : 'error',
      morph: morphKey && morphKey !== 'YOUR_KEY' ? 'connected' : 'error',
      freestyle: freestyleToken && freestyleToken !== 'YOUR_TOKEN' ? 'connected' : 'error'
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { claude: 'error', morph: 'error', freestyle: 'error' },
      { status: 500 }
    )
  }
}
