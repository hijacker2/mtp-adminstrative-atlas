import type { AtlasOverview, ResearchData, SourceRecord, StateProfile } from '../types/research'

const paths = {
  overview: '/data/atlas-overview.json',
  profiles: '/data/state-profiles.json',
  sources: '/data/source-register.json',
} as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function nullableString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null
}

function nullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function parseOverview(value: unknown): AtlasOverview {
  if (!isRecord(value)) throw new Error(`${paths.overview} must contain a JSON object.`)
  return {
    snapshot_date: nullableString(value.snapshot_date),
    state_cases: nullableNumber(value.state_cases),
    registered_sources: nullableNumber(value.registered_sources),
    extracted_content_records: nullableNumber(value.extracted_content_records),
    unverified_evidence_candidates: nullableNumber(value.unverified_evidence_candidates),
    verified_evidence_entries: nullableNumber(value.verified_evidence_entries),
    research_status: nullableString(value.research_status),
    methodological_note: nullableString(value.methodological_note),
  }
}

function parseProfiles(value: unknown): StateProfile[] {
  if (!Array.isArray(value)) throw new Error(`${paths.profiles} must contain a JSON array.`)
  return value.map((item, index) => {
    if (!isRecord(item) || typeof item.state_code !== 'string' || typeof item.state_name !== 'string') {
      throw new Error(`${paths.profiles} entry ${index + 1} is missing a valid state_code or state_name.`)
    }

    return {
      state_code: item.state_code,
      state_name: item.state_name,
      case_role: nullableString(item.case_role),
      administrative_model: nullableString(item.administrative_model),
      digital_delivery_model: nullableString(item.digital_delivery_model),
      selection_rationale: nullableString(item.selection_rationale),
      comparison_status: nullableString(item.comparison_status),
      registered_sources: nullableNumber(item.registered_sources),
      extracted_records: nullableNumber(item.extracted_records),
      verified_evidence_entries: nullableNumber(item.verified_evidence_entries),
    }
  })
}

function parseSources(value: unknown): SourceRecord[] {
  if (!Array.isArray(value)) throw new Error(`${paths.sources} must contain a JSON array.`)
  return value.map((item, index) => {
    if (!isRecord(item) || typeof item.state_code !== 'string' || (typeof item.source_id !== 'number' && typeof item.source_id !== 'string')) {
      throw new Error(`${paths.sources} entry ${index + 1} is missing a valid source_id or state_code.`)
    }

    return {
      source_id: item.source_id,
      state_code: item.state_code,
      issuing_authority: nullableString(item.issuing_authority),
      title: nullableString(item.title),
      url: nullableString(item.url),
      source_format: nullableString(item.source_format),
      process_stage: nullableString(item.process_stage),
      evidence_role: nullableString(item.evidence_role),
      source_date: nullableString(item.source_date),
      official_status: nullableString(item.official_status),
      collection_status: nullableString(item.collection_status),
      http_status: typeof item.http_status === 'number' || typeof item.http_status === 'string' ? item.http_status : null,
      content_type: nullableString(item.content_type),
      checked_at: nullableString(item.checked_at),
      page_title: nullableString(item.page_title),
    }
  })
}

async function fetchJson(path: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(path, { signal })
  if (!response.ok) {
    throw new Error(`Could not load ${path} (HTTP ${response.status}).`)
  }
  try {
    return await response.json() as unknown
  } catch {
    throw new Error(`${path} did not return valid JSON.`)
  }
}

export async function loadResearchData(signal: AbortSignal): Promise<ResearchData> {
  const [overviewData, profilesData, sourcesData] = await Promise.all([
    fetchJson(paths.overview, signal),
    fetchJson(paths.profiles, signal),
    fetchJson(paths.sources, signal),
  ])
  return {
    overview: parseOverview(overviewData),
    profiles: parseProfiles(profilesData),
    sources: parseSources(sourcesData),
  }
}
