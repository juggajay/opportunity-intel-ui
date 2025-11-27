"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Target, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchOpportunities, type Opportunity } from '@/lib/api'
import { getThesisLabel } from '@/lib/utils'

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'exploring', label: 'Exploring' },
  { value: 'validating', label: 'Validating' },
  { value: 'pursuing', label: 'Pursuing' },
  { value: 'passed', label: 'Passed' },
]

const thesisOptions = [
  { value: 'all', label: 'All Theses' },
  { value: 'ai_enablement', label: 'AI Enablement' },
  { value: 'trust_scarcity', label: 'Trust Scarcity' },
  { value: 'physical_digital', label: 'Physical-Digital Bridge' },
  { value: 'incumbent_disruption', label: 'Incumbent Disruption' },
  { value: 'speed_advantage', label: 'Speed Advantage' },
  { value: 'execution_arbitrage', label: 'Execution Arbitrage' },
]

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [thesisFilter, setThesisFilter] = useState('all')

  useEffect(() => {
    loadOpportunities()
  }, [statusFilter, thesisFilter])

  async function loadOpportunities() {
    setLoading(true)
    try {
      const params: any = { limit: 50 }
      if (statusFilter !== 'all') params.status = statusFilter
      if (thesisFilter !== 'all') params.thesis = thesisFilter
      const data = await fetchOpportunities(params)
      setOpportunities(data)
    } catch (error) {
      console.error('Failed to load opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pb-8">
      <Header
        title="Opportunities"
        description="Business opportunities identified from signal analysis"
      />

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={thesisFilter} onValueChange={setThesisFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by thesis" />
          </SelectTrigger>
          <SelectContent>
            {thesisOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 loading-shimmer rounded-lg" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">No opportunities found</p>
            <p className="text-sm text-muted mt-1">
              Try adjusting your filters or run the pipeline to generate opportunities
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <Link key={opp.id} href={`/opportunities/${opp.id}`}>
              <Card className="hover:bg-card-hover transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-thesis-speed/20 mt-1">
                        <Target className="w-5 h-5 text-thesis-speed" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{opp.title}</h3>
                        {opp.description && (
                          <p className="text-muted text-sm mt-1 line-clamp-2">
                            {opp.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          {opp.primary_thesis && (
                            <span className="text-xs text-muted">
                              {getThesisLabel(opp.primary_thesis)}
                            </span>
                          )}
                          {opp.timing_stage && (
                            <>
                              <span className="text-muted">•</span>
                              <span className="text-xs text-muted capitalize">
                                {opp.timing_stage}
                              </span>
                            </>
                          )}
                          {opp.market_size && (
                            <>
                              <span className="text-muted">•</span>
                              <span className="text-xs text-muted">
                                {opp.market_size}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={opp.status.toLowerCase() as any}>
                        {opp.status}
                      </Badge>
                      <ArrowRight className="w-5 h-5 text-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
