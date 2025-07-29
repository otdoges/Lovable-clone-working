"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  MessageSquare, 
  FolderOpen, 
  Code, 
  Eye, 
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Project } from "@/types"

interface SidebarProps {
  projects: Project[]
  onSelectProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
  selectedProjectId?: string
  className?: string
}

export function Sidebar({ 
  projects, 
  onSelectProject, 
  onDeleteProject, 
  selectedProjectId,
  className 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleDownload = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation()
    const blob = new Blob([project.htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.filename}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this project?')) {
      onDeleteProject(projectId)
    }
  }

  return (
    <div className={cn(
      "border-r border-[var(--border)] bg-[var(--muted)]/30 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-80",
      className
    )}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="font-semibold text-sm text-[var(--muted-foreground)] uppercase tracking-wide">
            Projects
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {projects.length === 0 ? (
          <div className={cn(
            "text-center text-[var(--muted-foreground)] py-8",
            isCollapsed && "hidden"
          )}>
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No projects yet</p>
            <p className="text-xs mt-1">Start a conversation to create your first project</p>
          </div>
        ) : (
          projects.map((project) => (
            <Card
              key={project.id}
              className={cn(
                "p-3 cursor-pointer hover:bg-[var(--accent)] transition-colors",
                selectedProjectId === project.id && "ring-2 ring-[var(--primary)] bg-[var(--accent)]",
                isCollapsed && "p-2"
              )}
              onClick={() => onSelectProject(project)}
            >
              <div className="flex items-center justify-between">
                <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center")}>
                  <div className={cn(
                    "w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0",
                    isCollapsed && "w-8 h-8"
                  )}>
                    <Code className={cn("w-5 h-5 text-white", isCollapsed && "w-4 h-4")} />
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {project.filename}
                      </h3>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleDownload(project, e)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-600"
                      onClick={(e) => handleDelete(project.id, e)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--muted-foreground)] space-y-1">
            <p>💡 Pro tip: Be specific in your requests</p>
            <p>📱 Generated pages are mobile-friendly</p>
            <p>🎨 Ask for different styles and themes</p>
          </div>
        </div>
      )}
    </div>
  )
}