"use client"

import { useState, useEffect } from 'react'
import { FileText, RefreshCw, Calendar, Rocket, TrendingUp, AlertCircle, Lightbulb, Target, XCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchDigest, type DigestContent } from '@/lib/api'
import { formatTimeAgo } from '@/lib/utils'

const periodOptions = [
  { value: 'weekly', label: 'Weekly' },
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
      // Just reload - the API generates on GET
      await loadDigest()
    } catch (error) {
      console.error('Failed to generate digest:', error)
    } finally {
      setGenerating(false)
    }
  }

  // Get verdict color
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'BUILD NOW': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'EXPLORE': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'MONITOR': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'PASS': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold">{digest.signals_processed || 0}</p>
                <p className="text-xs text-muted">Signals Processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold">{digest.patterns_detected || 0}</p>
                <p className="text-xs text-muted">Patterns Detected</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold">{digest.opportunities_identified || 0}</p>
                <p className="text-xs text-muted">Opportunities</p>
              </CardContent>
            </Card>
          </div>

          {/* Key Insight */}
          {digest.key_insight && (
            <Card className="border-thesis-ai/30 bg-thesis-ai/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-thesis-ai" />
                  Key Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{digest.key_insight}</p>
              </CardContent>
            </Card>
          )}

          {/* This Week's Action */}
          {digest.this_week_action && (
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-green-400" />
                  This Week&apos;s Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{digest.this_week_action}</p>
              </CardContent>
            </Card>
          )}

          {/* Top Build-Ready Ideas */}
          {digest.top_build_ready_ideas && digest.top_build_ready_ideas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-green-400" />
                  Build-Ready Ideas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {digest.top_build_ready_ideas.map((idea: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-border bg-card/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{idea.name}</h4>
                        {idea.build_time && (
                          <Badge variant="outline" className="text-xs">
                            {idea.build_time}
                          </Badge>
                        )}
                      </div>
                      {idea.one_liner && (
                        <p className="text-sm text-muted mb-3">{idea.one_liner}</p>
                      )}
                      {idea.why_high_score && (
                        <div className="text-sm mb-2">
                          <span className="text-green-400 font-medium">Why it scores high: </span>
                          <span className="text-foreground/80">{idea.why_high_score}</span>
                        </div>
                      )}
                      {idea.demand_evidence && (
                        <div className="text-sm mb-2">
                          <span className="text-blue-400 font-medium">Demand evidence: </span>
                          <span className="text-foreground/80">{idea.demand_evidence}</span>
                        </div>
                      )}
                      {idea.first_step && (
                        <div className="text-sm mt-3 p-2 rounded bg-green-500/10 border border-green-500/20">
                          <span className="text-green-400 font-medium">First step: </span>
                          <span className="text-foreground">{idea.first_step}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Opportunity Summaries */}
          {digest.new_opportunities && digest.new_opportunities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Opportunity Summaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {digest.new_opportunities.map((opp: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{opp.title}</h4>
                            {opp.verdict && (
                              <Badge className={getVerdictColor(opp.verdict)}>
                                {opp.verdict}
                              </Badge>
                            )}
                          </div>
                          {opp.summary && (
                            <p className="text-sm text-muted line-clamp-2">
                              {opp.summary}
                            </p>
                          )}
                          {opp.action && (
                            <p className="text-xs text-blue-400 mt-2">
                              → {opp.action}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emerging Trends */}
          {digest.emerging_trends && digest.emerging_trends.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  Emerging Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {digest.emerging_trends.map((trend: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-border"
                    >
                      <h4 className="font-medium">{trend.trend}</h4>
                      {trend.niche && (
                        <p className="text-sm text-muted mt-1">
                          <span className="text-yellow-400">Niche: </span>{trend.niche}
                        </p>
                      )}
                      {trend.timeline && (
                        <p className="text-xs text-muted mt-1">
                          Timeline: {trend.timeline}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Velocity Spikes */}
          {digest.velocity_spikes && digest.velocity_spikes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  Velocity Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {digest.velocity_spikes.map((spike: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded border border-border"
                    >
                      <span className="font-medium">{spike.topic}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">{spike.signal_type}</span>
                        <Badge variant="outline" className="text-orange-400 border-orange-400/30">
                          {(spike.velocity * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pass List */}
          {digest.pass_list && digest.pass_list.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  Pass List (Not Recommended)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {digest.pass_list.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-red-500/20 bg-red-500/5"
                    >
                      <h4 className="font-medium text-red-400">{item.idea}</h4>
                      {item.reason && (
                        <p className="text-sm text-muted mt-1">{item.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommended Actions */}
          {digest.recommended_actions && digest.recommended_actions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {digest.recommended_actions.map((action: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-thesis-ai mt-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Top Patterns */}
          {digest.top_patterns && digest.top_patterns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {digest.top_patterns.map((pattern: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-border"
                    >
                      <h4 className="font-medium">{pattern.title || pattern.pattern_type}</h4>
                      {pattern.summary && (
                        <p className="text-sm text-muted mt-1">
                          {pattern.summary}
                        </p>
                      )}
                      {pattern.relevance && (
                        <p className="text-xs text-thesis-ai mt-2">
                          {pattern.relevance}
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
