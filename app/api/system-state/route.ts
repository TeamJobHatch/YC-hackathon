import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const systemState = await prisma.systemState.findFirst({
      where: { id: 1 }
    })
    
    return NextResponse.json(systemState || {})
  } catch (error) {
    console.error('System state error:', error)
    return NextResponse.json(
      { error: 'Failed to get system state' },
      { status: 500 }
    )
  }
}
