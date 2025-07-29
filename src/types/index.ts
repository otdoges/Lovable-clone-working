export interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Project {
  id: string
  filename: string
  htmlContent: string
  createdAt: Date
  updatedAt: Date
  preview?: string
}

export interface AIResponse {
  filename: string
  htmlContent: string
  aiResponse: any
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  currentProject?: Project
}

export interface GenerateRequest {
  prompt: string
}

export interface GenerateResponse {
  success: boolean
  data?: AIResponse
  error?: string
}