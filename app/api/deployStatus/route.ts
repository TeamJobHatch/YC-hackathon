import { NextRequest, NextResponse } from 'next/server'
import { deployStatus } from '@/lib/ai/freestyle'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deployId = searchParams.get('id')
    
    if (!deployId) {
      return NextResponse.json(
        { error: 'Deploy ID is required' },
        { status: 400 }
      )
    }

    const status = await deployStatus(deployId)
    
    return NextResponse.json(status)
  } catch (error) {
    console.error('Deploy status error:', error)
    return NextResponse.json(
      { error: 'Failed to get deploy status' },
      { status: 500 }
    )
  }
}
