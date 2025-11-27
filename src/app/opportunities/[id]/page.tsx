"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Target, Radio, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { fetchOpportunity, updateOpportunityNotes, type Opportunity } from '@/lib/api'
import { getThesisLabel, formatTimeAgo, getSourceIcon } from '@/lib/utils'

const thesisColors: Record<string, string> = {
  ai_enablement: 'bg-thesis-ai',
  trust_scarcity: 'bg-thesis-trust',
  physical_digital: 'bg-thesis-physical',
  incumbent_disruption: 'bg-thesis-incumbent',
  speed_advantage: 'bg-thesis-speed',
  execution_arbitrage: 'bg-thesis-execution',
}

export default function OpportunityDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadOpportunity()
  }, [id])

  async function loadOpportunity() {
    try {
      const data = await fetchOpportunity(id)
      setOpportunity(data)
      setNotes(data.notes || '')
    } catch (error) {
      console.error('Failed to load opportunity:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveNotes() {
    if (!opportunity) return
    setSaving(true)
    try {
      await updateOpportunityNotes(id, notes)
    } catch (error) {
      console.error('Failed to save notes:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="pb-8">
        <div className="py-6">
          <div className="h-8 w-32 loading-shimmer rounded mb-4" />
          <div className="h-10 w-96 loading-shimmer rounded mb-2" />
          <div className="h-6 w-64 loading-shimmer rounded" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="h-48 loading-shimmer rounded-lg" />
            <div className="h-64 loading-shimmer rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="h-48 loading-shimmer rounded-lg" />
            <div className="h-32 loading-shimmer rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!opportunity) {
    return (
      <div className="pb-8">
        <div className="py-6">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Opportunities
          </Link>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">Opportunity not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const thesisScores = opportunity.thesis_scores || {}

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="py-6">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunities
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{opportunity.title}</h1>
              <Badge variant={opportunity.status.toLowerCase() as any}>
                {opportunity.status}
              </Badge>
            </div>
            {opportunity.description && (
              <p className="text-muted mt-2 max-w-2xl">{opportunity.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Thesis Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Thesis Alignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(thesisScores).map(([thesis, score]) => (
                  <div key={thesis}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{getThesisLabel(thesis)}</span>
                      <span className="text-sm font-medium">{Math.round((score as number) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-card-hover rounded-full overflow-hidden">
                      <div
                        className={`h-full ${thesisColors[thesis] || 'bg-muted'}`}
                        style={{ width: `${(score as number) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                {Object.keys(thesisScores).length === 0 && (
                  <p className="text-muted text-sm">No thesis scores available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Signals */}
          <Card>
            <CardHeader>
              <CardTitle>Related Signals</CardTitle>
            </CardHeader>
            <CardContent>
              {opportunity.related_signals && opportunity.related_signals.length > 0 ? (
                <div className="space-y-3">
                  {opportunity.related_signals.map((signal: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{getSourceIcon(signal.signal_type || '')}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            {signal.title || signal.summary || 'Signal detected'}
                          </p>
                          <p className="text-xs text-muted mt-1">
                            {formatTimeAgo(signal.processed_at)}
                          </p>
                        </div>
                        {signal.source_url && (
                          <a
                            href={signal.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted hover:text-foreground"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Radio className="w-8 h-8 text-muted mx-auto mb-2" />
                  <p className="text-muted text-sm">No related signals</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                {opportunity.primary_thesis && (
                  <div>
                    <dt className="text-xs text-muted">Primary Thesis</dt>
                    <dd className="text-sm font-medium">
                      {getThesisLabel(opportunity.primary_thesis)}
                    </dd>
                  </div>
                )}
                {opportunity.timing_stage && (
                  <div>
                    <dt className="text-xs text-muted">Timing Stage</dt>
                    <dd className="text-sm font-medium capitalize">
                      {opportunity.timing_stage}
                    </dd>
                  </div>
                )}
                {opportunity.market_size && (
                  <div>
                    <dt className="text-xs text-muted">Market Size</dt>
                    <dd className="text-sm font-medium">{opportunity.market_size}</dd>
                  </div>
                )}
                {opportunity.competition_level && (
                  <div>
                    <dt className="text-xs text-muted">Competition Level</dt>
                    <dd className="text-sm font-medium capitalize">
                      {opportunity.competition_level}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-muted">Created</dt>
                  <dd className="text-sm font-medium">
                    {formatTimeAgo(opportunity.created_at)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes about this opportunity..."
                rows={4}
                className="mb-3"
              />
              <Button
                onClick={handleSaveNotes}
                disabled={saving}
                size="sm"
                className="w-full"
              >
                {saving ? 'Saving...' : 'Save Notes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
