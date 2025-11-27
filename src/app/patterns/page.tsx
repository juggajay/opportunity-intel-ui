"use client"

import { useState, useEffect } from 'react'
import { GitBranch, TrendingUp, Layers, Zap, RefreshCw } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchPatterns, runPatternDetection, type Pattern } from '@/lib/api'
import { formatTimeAgo, getThesisLabel } from '@/lib/utils'

const patternTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'convergence', label: 'Convergence' },
  { value: 'velocity_spike', label: 'Velocity Spike' },
  { value: 'emergence', label: 'Emergence' },
  { value: 'correlation', label: 'Correlation' },
]

const patternIcons: Record<string, React.ReactNode> = {
  convergence: <Layers className="w-5 h-5" />,
  velocity_spike: <TrendingUp className="w-5 h-5" />,
  emergence: <Zap className="w-5 h-5" />,
  correlation: <GitBranch className="w-5 h-5" />,
}

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')
  const [detecting, setDetecting] = useState(false)

  useEffect(() => {
    loadPatterns()
  }, [typeFilter])

  async function loadPatterns() {
    setLoading(true)
    try {
      const params: any = { limit: 50 }
      if (typeFilter !== 'all') params.type = typeFilter
      const data = await fetchPatterns(params)
      setPatterns(data)
    } catch (error) {
      console.error('Failed to load patterns:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRunDetection() {
    setDetecting(true)
    try {
      await runPatternDetection()
      await loadPatterns()
    } catch (error) {
      console.error('Pattern detection failed:', error)
    } finally {
      setDetecting(false)
    }
  }

  return (
    <div className="pb-8">
      <Header
        title="Patterns"
        description="Detected patterns from signal analysis"
        action={
          <Button
            onClick={handleRunDetection}
            disabled={detecting}
            variant="secondary"
            className="gap-2"
          >
            {detecting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Detect Patterns
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {patternTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Patterns List */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 loading-shimmer rounded-lg" />
          ))}
        </div>
      ) : patterns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GitBranch className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">No patterns detected</p>
            <p className="text-sm text-muted mt-1">
              Run pattern detection to analyze collected signals
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {patterns.map((pattern) => (
            <Card key={pattern.id} className="hover:bg-card-hover transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-thesis-trust/20 text-thesis-trust">
                      {patternIcons[pattern.pattern_type] || <GitBranch className="w-5 h-5" />}
                    </div>
                    <div>
                      <CardTitle className="text-base">{pattern.title || pattern.pattern_type}</CardTitle>
                      <p className="text-xs text-muted capitalize">{pattern.pattern_type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  {pattern.confidence && (
                    <Badge variant="outline" className="text-xs">
                      {Math.round(pattern.confidence * 100)}% confidence
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {pattern.description && (
                  <p className="text-sm text-muted mb-3 line-clamp-2">
                    {pattern.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  {pattern.related_theses && pattern.related_theses.map((thesis: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {getThesisLabel(thesis)}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>
                    {pattern.signal_count || 0} signals
                  </span>
                  <span>{formatTimeAgo(pattern.detected_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
