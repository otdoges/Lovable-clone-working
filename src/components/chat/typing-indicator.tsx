"use client"

import { cn } from "@/lib/utils"
import { Bot, Sparkles } from "lucide-react"

interface TypingIndicatorProps {
  className?: string
  message?: string
  progress?: number
}

export function TypingIndicator({ 
  className, 
  message = "AI is thinking...", 
  progress 
}: TypingIndicatorProps) {
  return (
    <div className={cn(
      "flex gap-4 p-4 bg-[var(--muted)]/30 animate-slide-in-up",
      className
    )}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
        <Bot className="w-4 h-4 text-white" />
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">AI Assistant</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-[var(--muted-foreground)] animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 rounded-full bg-[var(--muted-foreground)] animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 rounded-full bg-[var(--muted-foreground)] animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Sparkles className="w-4 h-4 animate-pulse-gentle" />
            <span>{message}</span>
          </div>
          
          {typeof progress === 'number' && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-[var(--muted)] rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-1 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Animated placeholder content */}
          <div className="space-y-2 mt-3">
            <div className="flex space-x-1">
              <div className="h-3 bg-[var(--muted)] rounded animate-pulse" style={{ width: '60%' }} />
              <div className="h-3 bg-[var(--muted)] rounded animate-pulse" style={{ width: '30%', animationDelay: '100ms' }} />
            </div>
            <div className="flex space-x-1">
              <div className="h-3 bg-[var(--muted)] rounded animate-pulse" style={{ width: '40%', animationDelay: '200ms' }} />
              <div className="h-3 bg-[var(--muted)] rounded animate-pulse" style={{ width: '50%', animationDelay: '300ms' }} />
            </div>
            <div className="flex space-x-1">
              <div className="h-3 bg-[var(--muted)] rounded animate-pulse" style={{ width: '70%', animationDelay: '400ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LoadingStates() {
  return {
    thinking: "Analyzing your request...",
    generating: "Generating HTML structure...",
    styling: "Adding beautiful styles...",
    optimizing: "Optimizing for responsiveness...",
    finalizing: "Putting finishing touches..."
  }
}