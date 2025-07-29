"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Sparkles, Github, Settings } from "lucide-react"

interface HeaderProps {
  onNewProject?: () => void
  onOpenSettings?: () => void
}

export function Header({ onNewProject, onOpenSettings }: HeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI HTML Generator
            </h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/projects">Projects</a>
          </Button>
          <Button variant="ghost" size="sm">
            Templates
          </Button>
          <Button variant="ghost" size="sm">
            Docs
          </Button>
        </nav>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNewProject}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New Project
          </Button>
          
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            size="icon"
            asChild
          >
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}