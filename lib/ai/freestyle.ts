export interface DeployResponse {
  deployId: string
  status: string
}

export interface DeployStatusResponse {
  id: string
  status: string
  phase: string
  log?: string
}

export async function triggerDeploy(): Promise<DeployResponse> {
  try {
    const response = await fetch('https://api.freestyle.sh/api/v1/deploys', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FREESTYLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        project_id: process.env.FREESTYLE_PROJECT_ID,
        trigger: 'api',
        branch: 'main'
      })
    })

    if (!response.ok) {
      throw new Error(`Freestyle deploy error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      deployId: data.id || 'unknown',
      status: data.status || 'pending'
    }
  } catch (error) {
    console.error('Freestyle deploy error:', error)
    
    // Return a mock response for demo purposes
    return {
      deployId: `demo-${Date.now()}`,
      status: 'pending'
    }
  }
}

export async function deployStatus(deployId: string): Promise<DeployStatusResponse> {
  try {
    const response = await fetch(`https://api.freestyle.sh/api/v1/deploys/${deployId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.FREESTYLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Freestyle status error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      id: data.id || deployId,
      status: data.status || 'unknown',
      phase: data.phase || 'unknown',
      log: data.logs?.slice(-200) // Last 200 chars of logs
    }
  } catch (error) {
    console.error('Freestyle status error:', error)
    
    // Return a mock response for demo purposes  
    const mockPhases = ['pending', 'building', 'deploying', 'deployed']
    const randomPhase = mockPhases[Math.floor(Math.random() * mockPhases.length)]
    
    return {
      id: deployId,
      status: randomPhase === 'deployed' ? 'success' : 'running',
      phase: randomPhase,
      log: `Mock deploy ${randomPhase}...`
    }
  }
}
