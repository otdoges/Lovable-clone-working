"use client"

import { useEffect, useRef, useState } from "react"
import { ChatMessage } from "./message"
import { ChatInput } from "./chat-input"
import { TypingIndicator, LoadingStates } from "./typing-indicator"
import { Message, Project } from "@/types"
import { generateId } from "@/lib/utils"
import { ChatService } from "@/lib/chat-service"
import { AlertCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast'

interface ChatInterfaceProps {
  messages: Message[]
  onMessagesChange: (messages: Message[]) => void
  onProjectGenerated: (project: Project) => void
  isLoading: boolean
  onLoadingChange: (loading: boolean) => void
}

export function ChatInterface({ 
  messages, 
  onMessagesChange, 
  onProjectGenerated, 
  isLoading, 
  onLoadingChange 
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const loadingStates = LoadingStates()
  const [currentLoadingState, setCurrentLoadingState] = useState<keyof typeof loadingStates>('thinking')
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate realistic loading states
  useEffect(() => {
    if (!isLoading) {
      setLoadingProgress(0)
      setCurrentLoadingState('thinking')
      return
    }

    const states: (keyof typeof loadingStates)[] = ['thinking', 'generating', 'styling', 'optimizing', 'finalizing']
    let currentStateIndex = 0
    let progress = 0

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
      } else if (progress > (currentStateIndex + 1) * 20 && currentStateIndex < states.length - 1) {
        currentStateIndex++
        setCurrentLoadingState(states[currentStateIndex])
      }
      
      setLoadingProgress(progress)
    }, 800)

    return () => clearInterval(interval)
  }, [isLoading, loadingStates])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content,
      timestamp: new Date()
    }

    // Add user message immediately
    const updatedMessages = [...messages, userMessage]
    onMessagesChange(updatedMessages)
    onLoadingChange(true)

    try {
      // Call AI service
      const response = await ChatService.generateHTML(content)

      if (response.success && response.data) {
        // Create assistant message
        const assistantMessage: Message = {
          id: generateId(),
          type: 'assistant',
          content: `I've created a beautiful HTML page called "${response.data.filename}". The page includes modern styling and is fully responsive. You can preview it in the right panel and download it when ready!`,
          timestamp: new Date()
        }

        // Create project from the response
        const project: Project = {
          id: generateId(),
          filename: response.data.filename,
          htmlContent: response.data.htmlContent,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        // Update messages and notify parent components
        onMessagesChange([...updatedMessages, assistantMessage])
        onProjectGenerated(project)
        
        toast.success(`Created "${response.data.filename}.html"`)
      } else {
        // Handle error case
        const errorMessage: Message = {
          id: generateId(),
          type: 'assistant',
          content: `I apologize, but I encountered an error: ${response.error || 'Unknown error occurred'}. Please try again with a different request.`,
          timestamp: new Date()
        }
        
        onMessagesChange([...updatedMessages, errorMessage])
        toast.error(response.error || 'Failed to generate HTML')
      }
    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage: Message = {
        id: generateId(),
        type: 'assistant',
        content: 'I apologize, but I encountered a technical error. Please check your internet connection and try again.',
        timestamp: new Date()
      }
      
      onMessagesChange([...updatedMessages, errorMessage])
      toast.error('Connection error')
    } finally {
      onLoadingChange(false)
    }
  }

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.type === 'user')
      if (lastUserMessage) {
        handleSendMessage(lastUserMessage.content)
      }
    }
  }

  const handleEditMessage = (messageId: string, newContent: string) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, content: newContent } : msg
    )
    onMessagesChange(updatedMessages)
    
    // If it was a user message, regenerate response
    const editedMessage = messages.find(m => m.id === messageId)
    if (editedMessage?.type === 'user') {
      // Remove all messages after the edited one
      const messageIndex = messages.findIndex(m => m.id === messageId)
      const messagesUpToEdit = updatedMessages.slice(0, messageIndex + 1)
      onMessagesChange(messagesUpToEdit)
      
      // Regenerate response
      handleSendMessage(newContent)
    }
  }

  const handleRegenerateMessage = (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex > 0) {
      // Find the user message that prompted this response
      const userMessage = messages[messageIndex - 1]
      if (userMessage?.type === 'user') {
        // Remove the AI response and regenerate
        const messagesUpToUserMessage = messages.slice(0, messageIndex)
        onMessagesChange(messagesUpToUserMessage)
        handleSendMessage(userMessage.content)
      }
    }
  }

  const handleMessageFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    // Store feedback (could be sent to analytics later)
    console.log(`Message ${messageId} received ${feedback} feedback`)
    toast.success(`Thank you for your feedback!`)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        role="log"
        aria-label="Chat conversation"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.length === 0 ? (
          // Empty state
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Start Creating</h3>
                <p className="text-[var(--muted-foreground)]">
                  Describe the HTML page you want to create and I&apos;ll generate it for you instantly.
                </p>
              </div>
              <div className="text-xs text-[var(--muted-foreground)] space-y-1">
                <p>💡 Be specific about design, layout, and functionality</p>
                <p>🎨 Mention colors, themes, or styles you prefer</p>
                <p>📱 All generated pages are mobile-responsive</p>
              </div>
            </div>
          </div>
        ) : (
          // Messages list
          <div className="space-y-1 group">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                onEdit={handleEditMessage}
                onRegenerate={handleRegenerateMessage}
                onFeedback={handleMessageFeedback}
                isLast={index === messages.length - 1}
              />
            ))}
            
            {/* Enhanced Loading indicator */}
            {isLoading && (
              <TypingIndicator 
                message={loadingStates[currentLoadingState]}
                progress={loadingProgress}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Retry Button */}
      {messages.length > 0 && messages[messages.length - 1]?.type === 'assistant' && 
       messages[messages.length - 1]?.content.includes('error') && !isLoading && (
        <div className="p-4 border-t border-[var(--border)]">
          <Button
            onClick={handleRetry}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Chat Input */}
      <div className="border-t border-[var(--border)] p-4 bg-[var(--background)]">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}