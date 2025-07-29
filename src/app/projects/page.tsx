"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Project } from "@/types"
import { 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  Code, 
  Calendar,
  FileText,
  FolderOpen,
  Plus,
  CheckSquare
} from "lucide-react"
import { cn, formatDate, downloadFile } from "@/lib/utils"
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date')
  const router = useRouter()

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('ai-html-projects')
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects)
        setProjects(parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        })))
      } catch (error) {
        console.error('Failed to load projects:', error)
      }
    }
  }, [])

  // Save projects to localStorage when projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('ai-html-projects', JSON.stringify(projects))
    }
  }, [projects])

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => 
      project.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.htmlContent.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        return a.filename.localeCompare(b.filename)
      }
    })

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(p => p.id !== projectId))
      setSelectedProjects(prev => {
        const newSet = new Set(prev)
        newSet.delete(projectId)
        return newSet
      })
      toast.success('Project deleted')
    }
  }

  const handleDownloadProject = (project: Project) => {
    try {
      downloadFile(project.htmlContent, `${project.filename}.html`, 'text/html')
      toast.success(`Downloaded ${project.filename}.html`)
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Failed to download file')
    }
  }

  const handleBulkDelete = () => {
    if (selectedProjects.size === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedProjects.size} selected projects?`)) {
      setProjects(prev => prev.filter(p => !selectedProjects.has(p.id)))
      setSelectedProjects(new Set())
      toast.success(`Deleted ${selectedProjects.size} projects`)
    }
  }

  const handleBulkDownload = () => {
    if (selectedProjects.size === 0) return

    selectedProjects.forEach(projectId => {
      const project = projects.find(p => p.id === projectId)
      if (project) {
        downloadFile(project.htmlContent, `${project.filename}.html`, 'text/html')
      }
    })
    
    toast.success(`Downloaded ${selectedProjects.size} projects`)
    setSelectedProjects(new Set())
  }

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  const selectAllProjects = () => {
    if (selectedProjects.size === filteredProjects.length) {
      setSelectedProjects(new Set())
    } else {
      setSelectedProjects(new Set(filteredProjects.map(p => p.id)))
    }
  }

  const openProject = (project: Project) => {
    // Store the selected project in localStorage for the main page
    localStorage.setItem('selected-project', JSON.stringify(project))
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header 
        onNewProject={() => router.push('/')}
        onOpenSettings={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-[var(--muted-foreground)] mt-1">
              Manage your AI-generated HTML projects
            </p>
          </div>
          
          <Button onClick={() => router.push('/')}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
            className="px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)]"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>

          {selectedProjects.size > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download ({selectedProjects.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedProjects.size})
              </Button>
            </div>
          )}
        </div>

        {/* Select All */}
        {filteredProjects.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAllProjects}
              className="h-8"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              {selectedProjects.size === filteredProjects.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-sm text-[var(--muted-foreground)]">
              {filteredProjects.length} projects
            </span>
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-[var(--muted-foreground)] opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              {projects.length === 0 ? 'No projects yet' : 'No projects found'}
            </h3>
            <p className="text-[var(--muted-foreground)] mb-6">
              {projects.length === 0 
                ? 'Start creating your first HTML project'
                : 'Try adjusting your search criteria'
              }
            </p>
            {projects.length === 0 && (
              <Button onClick={() => router.push('/')}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className={cn(
                  "cursor-pointer hover:shadow-lg transition-all group",
                  selectedProjects.has(project.id) && "ring-2 ring-[var(--primary)]"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {project.filename}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(project.createdAt)}
                      </CardDescription>
                    </div>
                    
                    <input
                      type="checkbox"
                      checked={selectedProjects.has(project.id)}
                      onChange={() => toggleProjectSelection(project.id)}
                      className="ml-2 h-4 w-4 rounded border-[var(--border)]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Preview thumbnail would go here */}
                    <div className="h-32 bg-[var(--muted)]/30 rounded-md flex items-center justify-center border border-[var(--border)]">
                      <FileText className="w-8 h-8 text-[var(--muted-foreground)]" />
                    </div>
                    
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {project.htmlContent.length.toLocaleString()} characters
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openProject(project)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Open
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadProject(project)
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProject(project.id)
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}