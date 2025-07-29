import { NextRequest, NextResponse } from 'next/server'
import { generateHTMLWithFilename } from '@/lib/ai-integration'
import { GenerateRequest, GenerateResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    
    if (!body.prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' } as GenerateResponse,
        { status: 400 }
      )
    }

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI service not configured. Please add GROQ_API_KEY to your environment variables.' 
        } as GenerateResponse,
        { status: 500 }
      )
    }

    const result = await generateHTMLWithFilename(body.prompt)
    
    return NextResponse.json({
      success: true,
      data: result
    } as GenerateResponse)

  } catch (error) {
    console.error('Generate API Error:', error)
    
    let errorMessage = 'Failed to generate HTML'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage } as GenerateResponse,
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to generate HTML.' 
    } as GenerateResponse,
    { status: 405 }
  )
}