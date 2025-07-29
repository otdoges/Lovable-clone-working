"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { ChatInterface } from "@/components/chat/chat-interface"
import { HTMLPreview } from "@/components/preview/html-preview"
import { Project, Message } from "@/types"
import { generateId } from "@/lib/utils"

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load projects from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProjects = localStorage.getItem('ai-html-projects')
      if (savedProjects) {
        try {
          const parsed = JSON.parse(savedProjects)
          const loadedProjects = parsed.map((p: Project) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt)
          }))
          setProjects(loadedProjects)

          // Check for selected project from projects page
          const selectedProjectData = localStorage.getItem('selected-project')
          if (selectedProjectData) {
            try {
              const selectedProj = JSON.parse(selectedProjectData)
              const foundProject = loadedProjects.find((p: Project) => p.id === selectedProj.id)
              if (foundProject) {
                setSelectedProject(foundProject)
                setMessages([
                  {
                    id: generateId(),
                    type: 'assistant',
                    content: `Loaded project: ${foundProject.filename}`,
                    timestamp: new Date()
                  }
                ])
              }
              localStorage.removeItem('selected-project') // Clean up
            } catch (error) {
              console.error('Failed to load selected project:', error)
            }
          }
        } catch (error) {
          console.error('Failed to load projects:', error)
        }
      }
    }
  }, [])

  // Save projects to localStorage when projects change
  useEffect(() => {
    if (typeof window !== 'undefined' && projects.length > 0) {
      localStorage.setItem('ai-html-projects', JSON.stringify(projects))
    }
  }, [projects])

  const handleNewProject = () => {
    setSelectedProject(null)
    setMessages([])
  }

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
    // Load messages for this project (for now, just show a welcome message)
    setMessages([
      {
        id: generateId(),
        type: 'assistant',
        content: `Loaded project: ${project.filename}`,
        timestamp: new Date()
      }
    ])
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId))
    if (selectedProject?.id === projectId) {
      setSelectedProject(null)
      setMessages([])
    }
  }

  const handleProjectGenerated = (project: Project) => {
    setProjects(prev => [...prev, project])
    setSelectedProject(project)
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      <Header 
        onNewProject={handleNewProject}
        onOpenSettings={() => {}}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          projects={projects}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
          selectedProjectId={selectedProject?.id}
        />
        
        <main className="flex-1 flex">
          {/* Chat Interface */}
          <div className="flex-1 border-r border-[var(--border)]">
            <ChatInterface
              messages={messages}
              onMessagesChange={setMessages}
              onProjectGenerated={handleProjectGenerated}
              isLoading={isLoading}
              onLoadingChange={setIsLoading}
            />
          </div>
          
          {/* Preview Panel */}
          <div className="flex-1">
            {selectedProject ? (
              <HTMLPreview project={selectedProject} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="max-w-md text-center space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Build something Lovable
                    </h2>
                    <p className="text-lg text-[var(--muted-foreground)]">
                      Create beautiful HTML pages by chatting with AI
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer text-sm">
                      <h4 className="font-medium mb-1">Landing Page</h4>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Business landing page
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer text-sm">
                      <h4 className="font-medium mb-1">Portfolio</h4>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Showcase your work
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer text-sm">
                      <h4 className="font-medium mb-1">Dashboard</h4>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Admin dashboard
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer text-sm">
                      <h4 className="font-medium mb-1">Blog</h4>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Blog layout
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-sm text-[var(--muted-foreground)]">
                      💡 Start a conversation to create your first project
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
