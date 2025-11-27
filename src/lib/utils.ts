import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatTimeAgo(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return formatDate(date)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-status-new',
    exploring: 'bg-status-exploring',
    validating: 'bg-status-validating',
    pursuing: 'bg-status-pursuing',
    passed: 'bg-status-passed',
  }
  return colors[status.toLowerCase()] || 'bg-gray-500'
}

export function getThesisColor(thesis: string): string {
  const colors: Record<string, string> = {
    ai_leverage: 'bg-thesis-ai',
    trust_scarcity: 'bg-thesis-trust',
    physical_digital: 'bg-thesis-physical',
    incumbent_decay: 'bg-thesis-incumbent',
    speed_advantage: 'bg-thesis-speed',
    execution_fit: 'bg-thesis-execution',
  }
  return colors[thesis.toLowerCase()] || 'bg-gray-500'
}

export function getThesisLabel(thesis: string): string {
  const labels: Record<string, string> = {
    ai_leverage: 'AI Leverage',
    trust_scarcity: 'Trust Scarcity',
    physical_digital: 'Physical-Digital',
    incumbent_decay: 'Incumbent Decay',
    speed_advantage: 'Speed Advantage',
    execution_fit: 'Execution Fit',
  }
  return labels[thesis.toLowerCase()] || thesis
}

export function getSourceIcon(source: string): string {
  const icons: Record<string, string> = {
    google_trends: '📈',
    github_trending: '🐙',
    hacker_news: '🔶',
    reddit: '🔴',
    product_hunt: '🦁',
  }
  return icons[source.toLowerCase()] || '📊'
}
