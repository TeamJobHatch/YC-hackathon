export interface MorphUpdateRequest {
  path: string
  original: string
  updateSnippet: string
}

export interface MorphUpdateResponse {
  merged: string
  diffPreview: string
}

export async function applyUpdate({
  path,
  original, 
  updateSnippet
}: MorphUpdateRequest): Promise<MorphUpdateResponse> {
  try {
    const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MORPH_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://localhost:3000',
        'X-Title': 'Resume-to-Hire Platform'
      },
      body: JSON.stringify({
        model: process.env.MORPH_MODEL || 'morph-pro-apply',
        messages: [{
          role: 'user',
          content: `${original}
<update>
${updateSnippet}
</update>`
        }],
        temperature: 0.1,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error(`Morph API error: ${response.status}`)
    }

    const data = await response.json()
    const merged = data.choices?.[0]?.message?.content || original

    // Generate a simple diff preview by comparing strings
    const diffPreview = generateDiffPreview(original, merged)

    return {
      merged,
      diffPreview
    }
  } catch (error) {
    console.error('Morph API error:', error)
    
    // Fallback: return original with a note about the update
    const fallbackMerged = original + '\n\n// TODO: Apply this update manually:\n// ' + updateSnippet.split('\n').join('\n// ')
    
    return {
      merged: fallbackMerged,
      diffPreview: `+ Added update snippet as comment (API error)\n+ ${updateSnippet.slice(0, 100)}...`
    }
  }
}

function generateDiffPreview(original: string, merged: string): string {
  const originalLines = original.split('\n')
  const mergedLines = merged.split('\n')
  
  const diff: string[] = []
  let addedCount = 0
  let removedCount = 0
  
  // Simple line-by-line comparison
  const maxLength = Math.max(originalLines.length, mergedLines.length)
  
  for (let i = 0; i < maxLength; i++) {
    const originalLine = originalLines[i] || ''
    const mergedLine = mergedLines[i] || ''
    
    if (originalLine !== mergedLine) {
      if (originalLine && !mergedLine) {
        diff.push(`- ${originalLine}`)
        removedCount++
      } else if (!originalLine && mergedLine) {
        diff.push(`+ ${mergedLine}`)
        addedCount++
      } else {
        diff.push(`- ${originalLine}`)
        diff.push(`+ ${mergedLine}`)
        removedCount++
        addedCount++
      }
    }
  }
  
  // Limit the preview to last 15-25 lines
  const previewLines = diff.slice(-25)
  const summary = `${addedCount} additions, ${removedCount} deletions`
  
  return previewLines.length > 0 
    ? `${summary}\n${previewLines.join('\n')}`
    : 'No changes detected'
}
