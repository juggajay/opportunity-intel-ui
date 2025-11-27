"use client"

import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <div className="flex items-center justify-between py-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {action}
        <Link href="/chat">
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Go to Chat
          </Button>
        </Link>
      </div>
    </div>
  )
}
