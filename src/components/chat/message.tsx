"use client"

import { Message } from "@/types"
import { cn, formatDate } from "@/lib/utils"
import { User, Bot, Copy, Check, Edit3, RotateCcw, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, memo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

interface MessageProps {
  message: Message
  onEdit?: (messageId: string, newContent: string) => void
  onRegenerate?: (messageId: string) => void
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void
  isLast?: boolean
}

export const ChatMessage = memo(function ChatMessage({ 
  message, 
  onEdit, 
  onRegenerate, 
  onFeedback,
  isLast = false 
}: MessageProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  const handleEdit = () => {
    if (isEditing) {
      if (editContent.trim() !== message.content && onEdit) {
        onEdit(message.id, editContent.trim())
      }
      setIsEditing(false)
    } else {
      setIsEditing(true)
      setEditContent(message.content)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(message.content)
  }

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(feedback === type ? null : type)
    if (onFeedback) {
      onFeedback(message.id, type)
    }
  }

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id)
    }
  }

  const isUser = message.type === 'user'

  return (
    <div 
      className={cn(
        "group flex gap-4 p-4 animate-slide-in-up transition-colors hover:bg-[var(--muted)]/20",
        isUser ? "bg-transparent" : "bg-[var(--muted)]/30"
      )}
      role="article"
      aria-label={`Message from ${isUser ? "user" : "AI assistant"} at ${formatDate(message.timestamp)}`}
    >
      <div 
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
          isUser 
            ? "bg-[var(--primary)] text-[var(--primary-foreground)]" 
            : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn(
              "text-sm font-medium truncate",
              isUser ? "text-[var(--primary)]" : "text-[var(--foreground)]"
            )}>
              {isUser ? "You" : "AI Assistant"}
            </span>
            <span className="text-xs text-[var(--muted-foreground)] flex-shrink-0">
              {formatDate(message.timestamp)}
            </span>
          </div>
          
          <div 
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            role="toolbar"
            aria-label="Message actions"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-7 w-7"
              title="Copy message"
              aria-label="Copy message to clipboard"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" aria-hidden="true" />
              ) : (
                <Copy className="w-3 h-3" aria-hidden="true" />
              )}
            </Button>
            
            {isUser && onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="h-7 w-7"
                title={isEditing ? "Save edit" : "Edit message"}
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            )}
            
            {!isUser && onRegenerate && isLast && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRegenerate}
                className="h-7 w-7"
                title="Regenerate response"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            )}
            
            {!isUser && onFeedback && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleFeedback('positive')}
                  className={cn(
                    "h-7 w-7",
                    feedback === 'positive' && "text-green-500 bg-green-50 dark:bg-green-950"
                  )}
                  title="Good response"
                >
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleFeedback('negative')}
                  className={cn(
                    "h-7 w-7",
                    feedback === 'negative' && "text-red-500 bg-red-50 dark:bg-red-950"
                  )}
                  title="Poor response"
                >
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  title="More options"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="w-3 h-3 mr-2" />
                  Copy
                </DropdownMenuItem>
                {isUser && onEdit && (
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-3 h-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {!isUser && onRegenerate && isLast && (
                  <DropdownMenuItem onClick={handleRegenerate}>
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Regenerate
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] resize-none"
                placeholder="Edit your message..."
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit} disabled={!editContent.trim()}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className={cn(
              "prose prose-sm max-w-none break-words",
              isUser 
                ? "text-[var(--foreground)]" 
                : "text-[var(--foreground)]"
            )}>
              <div className="whitespace-pre-wrap leading-relaxed">
                {message.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})