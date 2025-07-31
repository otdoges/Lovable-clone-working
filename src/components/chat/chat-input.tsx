"use client"

import { useState, useRef, KeyboardEvent, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Sparkles, X, History } from "lucide-react"
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

const STORAGE_KEY = 'chat-input-draft'
const HISTORY_KEY = 'chat-input-history'

export function ChatInput({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "Describe the HTML page you want to create...",
  className 
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [, setShowSuggestions] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-save draft
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem(STORAGE_KEY)
      const savedHistory = localStorage.getItem(HISTORY_KEY)
      
      if (savedDraft) {
        setMessage(savedDraft)
      }
      
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory))
        } catch (error) {
          console.error('Failed to load message history:', error)
        }
      }
    }
  }, [])

  // Save draft on message change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (message.trim()) {
        localStorage.setItem(STORAGE_KEY, message)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [message])

  const saveToHistory = useCallback((msg: string) => {
    if (typeof window !== 'undefined') {
      const newHistory = [msg, ...history.filter(h => h !== msg)].slice(0, 10)
      setHistory(newHistory)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    }
  }, [history])

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      const trimmedMessage = message.trim()
      saveToHistory(trimmedMessage)
      onSendMessage(trimmedMessage)
      setMessage("")
      setShowSuggestions(false)
      setShowHistory(false)
      setHistoryIndex(-1)
      
      // Clear draft
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
      
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
    } else if (e.key === 'ArrowUp' && !e.shiftKey && message === '' && history.length > 0) {
      e.preventDefault()
      const newIndex = Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(newIndex)
      setMessage(history[newIndex])
      adjustTextareaHeight()
    } else if (e.key === 'ArrowDown' && !e.shiftKey && historyIndex >= 0) {
      e.preventDefault()
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setMessage(newIndex >= 0 ? history[newIndex] : '')
      adjustTextareaHeight()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setShowHistory(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
    setShowSuggestions(false)
    setShowHistory(false)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
    adjustTextareaHeight()
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const clearMessage = () => {
    setMessage('')
    setHistoryIndex(-1)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = 'auto'
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Example Prompts */}
      {!message && !showHistory && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Sparkles className="w-4 h-4" />
              <span>Try these examples:</span>
            </div>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="h-6 text-xs"
              >
                <History className="w-3 h-3 mr-1" />
                History
              </Button>
            )}
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

      {/* Message History */}
      {showHistory && history.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <History className="w-4 h-4" />
              <span>Recent messages:</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(false)}
              className="h-6 text-xs"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {history.slice(0, 5).map((hist, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(hist)}
                className="w-full text-left text-xs px-3 py-2 bg-[var(--muted)]/30 hover:bg-[var(--muted)]/50 rounded border border-[var(--border)] transition-colors truncate"
                disabled={isLoading}
              >
                {hist}
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
            onFocus={() => adjustTextareaHeight()}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 min-h-[20px] max-h-[120px]"
            rows={1}
            aria-label="Type your message"
            role="textbox"
            aria-multiline="true"
            aria-describedby="input-help"
          />
          
          {message && (
            <Button
              onClick={clearMessage}
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              title="Clear message"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Enhanced Status Bar */}
        <div className="flex justify-between items-center mt-2 text-xs text-[var(--muted-foreground)]">
          <div className="flex items-center gap-3">
            {isLoading && (
              <span className="flex items-center gap-2">
                <div className="animate-pulse-gentle">
                  <Sparkles className="w-3 h-3" />
                </div>
                Generating your HTML...
              </span>
            )}
            {!isLoading && message.trim() && (
              <span className="text-green-600 dark:text-green-400">
                Draft saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {message.length > 0 && (
              <span className={cn(
                "transition-colors",
                message.length > 500 ? "text-amber-500" : "",
                message.length > 800 ? "text-red-500" : ""
              )}>
                {message.length}/1000
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Keyboard Shortcuts */}
      <div id="input-help" className="text-xs text-[var(--muted-foreground)] text-center space-y-1">
        <div>
          <kbd className="px-2 py-1 bg-[var(--muted)] rounded text-xs">Enter</kbd> to send, 
          <kbd className="px-2 py-1 bg-[var(--muted)] rounded text-xs ml-1">Shift + Enter</kbd> for new line
        </div>
        {history.length > 0 && (
          <div>
            <kbd className="px-2 py-1 bg-[var(--muted)] rounded text-xs">↑↓</kbd> to browse history,
            <kbd className="px-2 py-1 bg-[var(--muted)] rounded text-xs ml-1">Esc</kbd> to dismiss
          </div>
        )}
      </div>
    </div>
  )
}