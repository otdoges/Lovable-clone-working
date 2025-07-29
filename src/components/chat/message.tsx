"use client"

import { Message } from "@/types"
import { cn, formatDate } from "@/lib/utils"
import { User, Bot, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface MessageProps {
  message: Message
}

export function ChatMessage({ message }: MessageProps) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  const isUser = message.type === 'user'

  return (
    <div className={cn(
      "flex gap-4 p-4 animate-slide-in-up",
      isUser ? "bg-transparent" : "bg-[var(--muted)]/30"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser 
          ? "bg-[var(--primary)] text-[var(--primary-foreground)]" 
          : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-medium",
              isUser ? "text-[var(--primary)]" : "text-[var(--foreground)]"
            )}>
              {isUser ? "You" : "AI Assistant"}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {formatDate(message.timestamp)}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        </div>
        
        <div className={cn(
          "prose prose-sm max-w-none",
          isUser 
            ? "text-[var(--foreground)]" 
            : "text-[var(--foreground)]"
        )}>
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  )
}