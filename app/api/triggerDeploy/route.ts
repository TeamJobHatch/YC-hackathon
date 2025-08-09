import { NextResponse } from 'next/server'
import { triggerDeploy } from '@/lib/ai/freestyle'

export async function POST() {
  try {
    const result = await triggerDeploy()
    
    return NextResponse.json({
      deployId: result.deployId,
      status: result.status
    })
  } catch (error) {
    console.error('Deploy trigger error:', error)
    return NextResponse.json(
      { error: 'Failed to trigger deploy' },
      { status: 500 }
    )
  }
}
