"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Project } from "@/types"
import { 
  Download, 
  Code, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor,
  RefreshCw,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"
import { downloadFile } from "@/lib/utils"
import toast from 'react-hot-toast'

interface HTMLPreviewProps {
  project: Project
  className?: string
}

type ViewMode = 'preview' | 'code'
type DeviceSize = 'mobile' | 'tablet' | 'desktop'

const deviceSizes = {
  mobile: { width: 375, height: 667, label: 'Mobile' },
  tablet: { width: 768, height: 1024, label: 'Tablet' },
  desktop: { width: 1200, height: 800, label: 'Desktop' }
}

export function HTMLPreview({ project, className }: HTMLPreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const codeRef = useRef<HTMLPreElement>(null)

  // Create blob URL for iframe
  const createPreviewUrl = useCallback(() => {
    try {
      const blob = new Blob([project.htmlContent], { type: 'text/html' })
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error('Failed to create preview URL:', error)
      setPreviewError('Failed to create preview')
      return null
    }
  }, [project.htmlContent])

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = createPreviewUrl()
    setPreviewUrl(url)
    setPreviewError(null)

    // Cleanup previous URL
    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [project.htmlContent, createPreviewUrl])

  const handleDownload = () => {
    try {
      downloadFile(project.htmlContent, `${project.filename}.html`, 'text/html')
      toast.success(`Downloaded ${project.filename}.html`)
    } catch {
      toast.error('Failed to download file')
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    
    // Clean up old URL and create new one
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    
    const newUrl = createPreviewUrl()
    setPreviewUrl(newUrl)
    
    // Simulate refresh delay for UX
    setTimeout(() => {
      setIsRefreshing(false)
    }, 500)
  }

  const handleOpenInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank')
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(project.htmlContent)
      toast.success('Code copied to clipboard')
    } catch {
      toast.error('Failed to copy code')
    }
  }

  const currentDevice = deviceSizes[deviceSize]

  return (
    <div className={cn("flex flex-col h-full bg-[var(--background)]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--muted)]/20">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-lg">{project.filename}</h3>
          <div className="flex items-center space-x-1">
            <Button
              variant={viewMode === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('preview')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant={viewMode === 'code' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('code')}
            >
              <Code className="w-4 h-4 mr-2" />
              Code
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {viewMode === 'preview' && (
            <>
              <div className="flex items-center space-x-1 border border-[var(--border)] rounded-md">
                <Button
                  variant={deviceSize === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceSize('desktop')}
                  className="h-8"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={deviceSize === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceSize('tablet')}
                  className="h-8"
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={deviceSize === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceSize('mobile')}
                  className="h-8"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenInNewTab}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </>
          )}

          {viewMode === 'code' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={copyCode}
            >
              <Code className="w-4 h-4 mr-2" />
              Copy
            </Button>
          )}

          <Button
            variant="default"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'preview' ? (
          <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            {previewError ? (
              <div className="text-center space-y-4">
                <div className="text-red-500 text-lg">⚠️ Preview Error</div>
                <p className="text-[var(--muted-foreground)]">{previewError}</p>
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            ) : previewUrl ? (
              <div 
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                style={{
                  width: `${currentDevice.width}px`,
                  height: `${currentDevice.height}px`,
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
              >
                <iframe
                  ref={iframeRef}
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title={`Preview of ${project.filename}`}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="animate-pulse-gentle">
                  <Eye className="w-12 h-12 mx-auto text-[var(--muted-foreground)]" />
                </div>
                <p className="text-[var(--muted-foreground)]">Loading preview...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full overflow-auto p-4 bg-[var(--muted)]/20">
            <pre 
              ref={codeRef}
              className="text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg p-4 overflow-auto font-mono whitespace-pre-wrap"
            >
              <code>{project.htmlContent}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--muted)]/20">
        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
          <div>
            Created: {new Date(project.createdAt).toLocaleString()}
          </div>
          <div>
            {project.htmlContent.length.toLocaleString()} characters
          </div>
        </div>
      </div>
    </div>
  )
}