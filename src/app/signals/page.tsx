"use client"

import { useState, useEffect } from 'react'
import { Radio, ExternalLink, RefreshCw, Play } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchSignals, runCollection, type ProcessedSignal } from '@/lib/api'
import { formatTimeAgo, getSourceIcon } from '@/lib/utils'

const sourceOptions = [
  { value: 'all', label: 'All Sources' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'news', label: 'News' },
  { value: 'hn', label: 'Hacker News' },
  { value: 'government', label: 'Government' },
]

export default function SignalsPage() {
  const [signals, setSignals] = useState<ProcessedSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [sourceFilter, setSourceFilter] = useState('all')
  const [collecting, setCollecting] = useState(false)

  useEffect(() => {
    loadSignals()
  }, [sourceFilter])

  async function loadSignals() {
    setLoading(true)
    try {
      const params: any = { limit: 50 }
      if (sourceFilter !== 'all') params.source = sourceFilter
      const data = await fetchSignals(params)
      setSignals(data)
    } catch (error) {
      console.error('Failed to load signals:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRunCollection() {
    setCollecting(true)
    try {
      await runCollection()
      await loadSignals()
    } catch (error) {
      console.error('Collection failed:', error)
    } finally {
      setCollecting(false)
    }
  }

  return (
    <div className="pb-8">
      <Header
        title="Signals"
        description="Raw signals collected from various sources"
        action={
          <Button
            onClick={handleRunCollection}
            disabled={collecting}
            variant="secondary"
            className="gap-2"
          >
            {collecting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Run Collection
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            {sourceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Signals List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-20 loading-shimmer rounded-lg" />
          ))}
        </div>
      ) : signals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Radio className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">No signals found</p>
            <p className="text-sm text-muted mt-1">
              Run the collection to gather signals from configured sources
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {signals.map((signal) => (
            <Card key={signal.id} className="hover:bg-card-hover transition-colors">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getSourceIcon(signal.signal_type || '')}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium">
                          {signal.title || signal.summary || 'Signal detected'}
                        </h3>
                        {signal.summary && signal.title && (
                          <p className="text-sm text-muted mt-1 line-clamp-2">
                            {signal.summary}
                          </p>
                        )}
                      </div>
                      {signal.source_url && (
                        <a
                          href={signal.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-muted hover:text-foreground"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {signal.signal_type || 'unknown'}
                      </Badge>
                      {signal.relevance_score && (
                        <span className="text-xs text-muted">
                          Relevance: {Math.round(signal.relevance_score * 100)}%
                        </span>
                      )}
                      <span className="text-xs text-muted">
                        {formatTimeAgo(signal.processed_at)}
                      </span>
                    </div>
                    {signal.thesis_tags && signal.thesis_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {signal.thesis_tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
