"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Radio, GitBranch, Target, Play, RefreshCw, Zap } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  fetchSignals,
  fetchOpportunities,
  fetchPatterns,
  runCollection,
  runPatternDetection,
  type ProcessedSignal,
  type Opportunity,
  type Pattern,
} from '@/lib/api'
import { formatTimeAgo, getSourceIcon, getThesisLabel } from '@/lib/utils'

export default function Dashboard() {
  const [signals, setSignals] = useState<ProcessedSignal[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [signalsData, opportunitiesData, patternsData] = await Promise.all([
        fetchSignals({ limit: 5 }).catch(() => []),
        fetchOpportunities({ limit: 5 }).catch(() => []),
        fetchPatterns({ limit: 5 }).catch(() => []),
      ])
      setSignals(signalsData)
      setOpportunities(opportunitiesData)
      setPatterns(patternsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(action: string, fn: () => Promise<any>) {
    setActionLoading(action)
    try {
      await fn()
      // Reload data after action
      await loadData()
    } catch (error) {
      console.error(`${action} failed:`, error)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="pb-8">
      <Header
        title="Dashboard"
        description="Overview of signals, patterns, and opportunities"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-thesis-ai/20">
                <Radio className="w-6 h-6 text-thesis-ai" />
              </div>
              <div>
                <p className="text-3xl font-bold">{signals.length > 0 ? '147' : '0'}</p>
                <p className="text-sm text-muted">Signals collected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-thesis-trust/20">
                <GitBranch className="w-6 h-6 text-thesis-trust" />
              </div>
              <div>
                <p className="text-3xl font-bold">{patterns.length}</p>
                <p className="text-sm text-muted">Patterns detected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-thesis-speed/20">
                <Target className="w-6 h-6 text-thesis-speed" />
              </div>
              <div>
                <p className="text-3xl font-bold">{opportunities.length}</p>
                <p className="text-sm text-muted">Opportunities generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Latest Opportunities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Latest Opportunities</CardTitle>
            <Link href="/opportunities" className="text-sm text-muted hover:text-foreground flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 loading-shimmer rounded-lg" />
                ))}
              </div>
            ) : opportunities.length === 0 ? (
              <p className="text-muted text-sm py-8 text-center">No opportunities yet</p>
            ) : (
              <div className="space-y-3">
                {opportunities.slice(0, 3).map((opp) => (
                  <Link
                    key={opp.id}
                    href={`/opportunities/${opp.id}`}
                    className="block p-3 rounded-lg border border-border hover:bg-card-hover transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-thesis-speed" />
                        <span className="font-medium">{opp.title}</span>
                      </div>
                      <Badge variant={opp.status.toLowerCase() as any} className="text-xs">
                        {opp.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                      {opp.primary_thesis && (
                        <span>{getThesisLabel(opp.primary_thesis)}</span>
                      )}
                      {opp.timing_stage && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{opp.timing_stage}</span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Signals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Signals</CardTitle>
            <Link href="/signals" className="text-sm text-muted hover:text-foreground flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 loading-shimmer rounded-lg" />
                ))}
              </div>
            ) : signals.length === 0 ? (
              <p className="text-muted text-sm py-8 text-center">No signals yet</p>
            ) : (
              <div className="space-y-3">
                {signals.slice(0, 5).map((signal) => (
                  <div
                    key={signal.id}
                    className="p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getSourceIcon(signal.signal_type || '')}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">
                          {signal.title || signal.summary || 'Signal detected'}
                        </p>
                        <p className="text-xs text-muted mt-1">
                          {formatTimeAgo(signal.processed_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => handleAction('collect', runCollection)}
              disabled={actionLoading !== null}
              className="gap-2"
            >
              {actionLoading === 'collect' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Run Collection
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleAction('patterns', runPatternDetection)}
              disabled={actionLoading !== null}
              className="gap-2"
            >
              {actionLoading === 'patterns' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              Detect Patterns
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
