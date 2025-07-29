import { GenerateRequest, GenerateResponse } from '@/types'

export class ChatService {
  static async generateHTML(prompt: string): Promise<GenerateResponse> {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt } as GenerateRequest),
      })

      const data: GenerateResponse = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate HTML')
      }

      return data
    } catch (error) {
      console.error('ChatService Error:', error)
      
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message
        }
      }
      
      return {
        success: false,
        error: 'An unexpected error occurred'
      }
    }
  }
}

export default ChatService