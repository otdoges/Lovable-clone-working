"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
}

const EXAMPLE_PROMPTS = [
  "Create a modern landing page for a tech startup",
  "Build a portfolio website with dark theme",
  "Design a dashboard with charts and statistics",
  "Make a blog layout with sidebar",
  "Create a pricing page with cards",
  "Build a contact form with validation"
]

export function ChatInput({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "Describe the HTML page you want to create...",
  className 
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [, setShowSuggestions] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage("")
      setShowSuggestions(false)
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
    setShowSuggestions(false)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Example Prompts */}
      {!message && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Sparkles className="w-4 h-4" />
            <span>Try these examples:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.slice(0, 3).map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(prompt)}
                className="text-xs px-3 py-2 bg-[var(--muted)]/50 hover:bg-[var(--muted)] rounded-full border border-[var(--border)] transition-colors text-left"
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="relative">
        <div className="flex gap-3 p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg focus-within:border-[var(--primary)] transition-colors">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 min-h-[20px] max-h-[120px]"
            rows={1}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            size="icon"
            className="h-8 w-8 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Character Counter */}
        <div className="flex justify-between items-center mt-2 text-xs text-[var(--muted-foreground)]">
          <div>
            {isLoading && (
              <span className="flex items-center gap-2">
                <div className="animate-pulse-gentle">
                  <Sparkles className="w-3 h-3" />
                </div>
                Generating your HTML...
              </span>
            )}
          </div>
          <div>
            {message.length > 0 && (
              <span className={cn(
                message.length > 500 ? "text-amber-500" : "",
                message.length > 800 ? "text-red-500" : ""
              )}>
                {message.length}/1000
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="text-xs text-[var(--muted-foreground)] text-center">
        Press <kbd className="px-2 py-1 bg-[var(--muted)] rounded text-xs">Enter</kbd> to send, <kbd className="px-2 py-1 bg-[var(--muted)] rounded text-xs">Shift + Enter</kbd> for new line
      </div>
    </div>
  )
}