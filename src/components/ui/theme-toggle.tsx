"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "./button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    if (theme === "light") {
      return <Sun className="h-4 w-4" />
    } else if (theme === "dark") {
      return <Moon className="h-4 w-4" />
    } else {
      // System theme - check current preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      return isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
    }
  }

  const getTooltip = () => {
    if (theme === "light") return "Switch to dark theme"
    if (theme === "dark") return "Switch to system theme"
    return "Switch to light theme"
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={getTooltip()}
      className="relative"
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}