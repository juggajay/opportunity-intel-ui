const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
export interface Signal {
  id: string;
  source_type: string;
  source_category: string;
  source_url?: string;
  raw_content: Record<string, any>;
  signal_date?: string;
  geography?: string;
  collected_at: string;
  created_at: string;
}

export interface ProcessedSignal {
  id: string;
  raw_signal_id: string;
  signal_type?: string;
  signal_subtype?: string;
  title?: string;
  summary?: string;
  entities: {
    companies: string[];
    technologies: string[];
    industries: string[];
    locations: string[];
  };
  keywords: string[];
  thesis_scores: {
    ai_leverage?: number;
    trust_scarcity?: number;
    physical_digital?: number;
    incumbent_decay?: number;
    speed_advantage?: number;
    execution_fit?: number;
  };
  thesis_reasoning?: string;
  novelty_score?: number;
  velocity_score?: number;
  geography?: string;
  timing_stage?: string;
  processed_at: string;
  created_at: string;
}

export interface Pattern {
  id: string;
  pattern_type: string;
  signal_ids: string[];
  signal_count: number;
  title: string;
  description?: string;
  hypothesis?: string;
  confidence_score: number;
  opportunity_score: number;
  primary_thesis_alignment?: string;
  thesis_scores: Record<string, number>;
  status: string;
  user_notes?: string;
  detected_at: string;
  created_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  summary?: string;
  detailed_analysis?: string;
  pattern_ids: string[];
  signal_ids: string[];
  opportunity_type?: string;
  industries: string[];
  geographies: string[];
  thesis_scores: Record<string, number>;
  primary_thesis?: string;
  execution_fit_reasoning?: string;
  timing_stage?: string;
  time_sensitivity?: string;
  existing_players: string[];
  incumbent_weakness?: string;
  estimated_complexity?: string;
  key_requirements: string[];
  potential_moats: string[];
  risks: string[];
  status: string;
  user_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DigestContent {
  period: string;
  generated_at: string;
  signals_processed: number;
  patterns_detected: number;
  opportunities_identified: number;
  top_patterns: Pattern[];
  new_opportunities: Opportunity[];
  velocity_spikes: any[];
  key_insight: string;
  recommended_actions: string[];
}

// API Functions
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Health
export async function checkHealth() {
  return fetchAPI('/health');
}

// Signals
export async function fetchSignals(params?: {
  limit?: number;
  source_type?: string;
  days?: number;
}): Promise<ProcessedSignal[]> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.source_type) query.set('source_type', params.source_type);
  if (params?.days) query.set('days', params.days.toString());

  const queryStr = query.toString();
  return fetchAPI(`/signals${queryStr ? `?${queryStr}` : ''}`);
}

export async function fetchRawSignals(params?: {
  limit?: number;
  source_type?: string;
  days?: number;
}): Promise<Signal[]> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.source_type) query.set('source_type', params.source_type);
  if (params?.days) query.set('days', params.days.toString());

  const queryStr = query.toString();
  return fetchAPI(`/signals/raw${queryStr ? `?${queryStr}` : ''}`);
}

// Opportunities
export async function fetchOpportunities(params?: {
  limit?: number;
  status?: string;
  timing_stage?: string;
}): Promise<Opportunity[]> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.status) query.set('status', params.status);
  if (params?.timing_stage) query.set('timing_stage', params.timing_stage);

  const queryStr = query.toString();
  return fetchAPI(`/opportunities${queryStr ? `?${queryStr}` : ''}`);
}

export async function fetchOpportunity(id: string): Promise<Opportunity> {
  return fetchAPI(`/opportunities/${id}`);
}

export async function updateOpportunity(id: string, data: {
  status?: string;
  user_notes?: string;
}): Promise<Opportunity> {
  return fetchAPI(`/opportunities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Patterns
export async function fetchPatterns(params?: {
  limit?: number;
  status?: string;
  min_score?: number;
}): Promise<Pattern[]> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.status) query.set('status', params.status);
  if (params?.min_score) query.set('min_score', params.min_score.toString());

  const queryStr = query.toString();
  return fetchAPI(`/patterns${queryStr ? `?${queryStr}` : ''}`);
}

export async function updatePattern(id: string, data: {
  status?: string;
  user_notes?: string;
}): Promise<Pattern> {
  return fetchAPI(`/patterns/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Chat
export async function sendChatMessage(
  message: string,
  history?: ChatMessage[]
): Promise<{ response: string; conversation_id?: string }> {
  return fetchAPI('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  });
}

export async function chatAboutOpportunity(
  opportunityId: string,
  message: string
): Promise<{ response: string }> {
  return fetchAPI(`/chat/opportunity/${opportunityId}`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

// Digest
export async function fetchWeeklyDigest(): Promise<DigestContent> {
  return fetchAPI('/digest/weekly');
}

export async function fetchMonthlyDigest(): Promise<DigestContent> {
  return fetchAPI('/digest/monthly');
}

// Pipeline Actions
export async function runCollection(): Promise<{ status: string; message: string }> {
  return fetchAPI('/pipeline/collect', { method: 'POST' });
}

export async function runProcessing(): Promise<{ status: string; message: string }> {
  return fetchAPI('/pipeline/process', { method: 'POST' });
}

export async function runPatternDetection(): Promise<{ status: string; message: string }> {
  return fetchAPI('/pipeline/detect-patterns', { method: 'POST' });
}

export async function runOpportunityGeneration(): Promise<{ status: string; message: string }> {
  return fetchAPI('/pipeline/generate-opportunities', { method: 'POST' });
}

// Stats
export async function fetchStats(): Promise<{
  signals_count: number;
  patterns_count: number;
  opportunities_count: number;
}> {
  return fetchAPI('/stats');
}
