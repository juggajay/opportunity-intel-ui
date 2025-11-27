"use client"

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { FileText, RefreshCw, Calendar } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchDigest, generateDigest, type DigestContent } from '@/lib/api'
import { formatTimeAgo } from '@/lib/utils'

const periodOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
]

export default function DigestPage() {
  const [digest, setDigest] = useState<DigestContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('weekly')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadDigest()
  }, [period])

  async function loadDigest() {
    setLoading(true)
    try {
      const data = await fetchDigest(period)
      setDigest(data)
    } catch (error) {
      console.error('Failed to load digest:', error)
      setDigest(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    setGenerating(true)
    try {
      await generateDigest(period)
      await loadDigest()
    } catch (error) {
      console.error('Failed to generate digest:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="pb-8">
      <Header
        title="Digest"
        description="AI-generated summaries of opportunities and patterns"
        action={
          <Button
            onClick={handleGenerate}
            disabled={generating}
            variant="secondary"
            className="gap-2"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Generate Digest
          </Button>
        }
      />

      {/* Period Selector */}
      <div className="flex gap-4 mb-6">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Digest Content */}
      {loading ? (
        <div className="space-y-6">
          <div className="h-12 w-64 loading-shimmer rounded" />
          <div className="h-96 loading-shimmer rounded-lg" />
        </div>
      ) : !digest ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">No digest available for this period</p>
            <p className="text-sm text-muted mt-1">
              Generate a digest to see an AI summary of recent activity
            </p>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="mt-4 gap-2"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              Generate {period.charAt(0).toUpperCase() + period.slice(1)} Digest
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Digest Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-thesis-ai/20">
                <Calendar className="w-5 h-5 text-thesis-ai" />
              </div>
              <div>
                <h2 className="text-xl font-semibold capitalize">{period} Digest</h2>
                <p className="text-sm text-muted">
                  Generated {formatTimeAgo(digest.generated_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          {digest.stats && (
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold">{digest.stats.signals || 0}</p>
                  <p className="text-xs text-muted">Signals Collected</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold">{digest.stats.patterns || 0}</p>
                  <p className="text-xs text-muted">Patterns Detected</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold">{digest.stats.opportunities || 0}</p>
                  <p className="text-xs text-muted">Opportunities</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold">{digest.stats.top_thesis || '-'}</p>
                  <p className="text-xs text-muted">Top Thesis</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{digest.content || 'No summary available.'}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Top Opportunities */}
          {digest.top_opportunities && digest.top_opportunities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {digest.top_opportunities.map((opp: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{opp.title}</h4>
                          {opp.description && (
                            <p className="text-sm text-muted mt-1 line-clamp-2">
                              {opp.description}
                            </p>
                          )}
                        </div>
                        {opp.score && (
                          <span className="text-sm font-medium text-thesis-speed">
                            {Math.round(opp.score * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Patterns */}
          {digest.key_patterns && digest.key_patterns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {digest.key_patterns.map((pattern: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-border"
                    >
                      <h4 className="font-medium">{pattern.title || pattern.pattern_type}</h4>
                      {pattern.description && (
                        <p className="text-sm text-muted mt-1">
                          {pattern.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
