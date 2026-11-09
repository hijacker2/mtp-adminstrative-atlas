export interface StateProfile {
  state_code: string
  state_name: string
  case_role: string | null
  administrative_model: string | null
  digital_delivery_model: string | null
  selection_rationale: string | null
  comparison_status: string | null
  registered_sources: number | null
  extracted_records: number | null
  verified_evidence_entries: number | null
}

export interface AtlasOverview {
  snapshot_date: string | null
  state_cases: number | null
  registered_sources: number | null
  extracted_content_records: number | null
  unverified_evidence_candidates: number | null
  verified_evidence_entries: number | null
  research_status: string | null
  methodological_note: string | null
}

export interface SourceRecord {
  source_id: number | string
  state_code: string
  issuing_authority: string | null
  title: string | null
  url: string | null
  source_format: string | null
  process_stage: string | null
  evidence_role: string | null
  source_date: string | null
  official_status: string | null
  collection_status: string | null
  http_status: number | string | null
  content_type: string | null
  checked_at: string | null
  page_title: string | null
}

export interface ResearchData {
  overview: AtlasOverview
  profiles: StateProfile[]
  sources: SourceRecord[]
}

export const stateAppearance: Record<string, { accent: string; accentSoft: string }> = {
  rajasthan: { accent: '#a65a43', accentSoft: '#f0e2d9' },
  kerala: { accent: '#667b56', accentSoft: '#e6e9df' },
  karnataka: { accent: '#59637f', accentSoft: '#e3e5ec' },
  bihar: { accent: '#a18348', accentSoft: '#eee8d8' },
}

export const notEstablished = 'Not yet established'
