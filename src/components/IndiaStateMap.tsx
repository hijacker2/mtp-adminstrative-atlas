import { geoMercator, geoPath } from 'd3-geo'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { stateAppearance, type StateProfile } from '../types/research'

const mapUrl = '/maps/india-states.geojson'
const mapViewBox = { width: 720, height: 680 }
const neutralFill = '#e2ded3'

interface IndiaStateMapProps {
  states: StateProfile[]
  selectedStateId: string
  onSelectState: (stateId: string) => void
}

interface IndiaProperties {
  st_nm?: string
  district?: string
  st_code?: string
  dt_code?: string
  year?: string
}

type IndiaFeatureCollection = FeatureCollection<Geometry, IndiaProperties>

interface RenderedState {
  name: string
  path: string
  researchState?: StateProfile
  featureCount: number
}

export default function IndiaStateMap({ states, selectedStateId, onSelectState }: IndiaStateMapProps) {
  const [collection, setCollection] = useState<IndiaFeatureCollection | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [focusedName, setFocusedName] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadMap() {
      try {
        const response = await fetch(mapUrl, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Map request failed with status ${response.status}.`)
        }

        const data: unknown = await response.json()
        if (
          typeof data !== 'object' ||
          data === null ||
          !('type' in data) ||
          data.type !== 'FeatureCollection' ||
          !('features' in data) ||
          !Array.isArray(data.features)
        ) {
          throw new Error('The map file is not a valid GeoJSON FeatureCollection.')
        }

        const parsed = data as IndiaFeatureCollection
        if (parsed.features.some((feature) => typeof feature.properties?.st_nm !== 'string')) {
          throw new Error('The map file is missing the required st_nm state-name property.')
        }

        setCollection(parsed)
      } catch (error) {
        if (controller.signal.aborted) return
        setLoadError(error instanceof Error ? error.message : 'The map could not be loaded.')
      }
    }

    void loadMap()
    return () => controller.abort()
  }, [])

  const renderedStates = useMemo((): RenderedState[] => {
    if (!collection) return []

    const grouped = new Map<string, Feature<Geometry, IndiaProperties>[]>()
    for (const feature of collection.features) {
      const stateName = feature.properties?.st_nm
      if (!stateName) continue
      const stateFeatures = grouped.get(stateName) ?? []
      stateFeatures.push(feature)
      grouped.set(stateName, stateFeatures)
    }

    const projection = geoMercator().fitExtent(
      [[22, 22], [mapViewBox.width - 22, mapViewBox.height - 22]],
      collection,
    )
    const pathGenerator = geoPath(projection)

    return Array.from(grouped, ([name, features]) => {
      const stateFeatureCollection: IndiaFeatureCollection = {
        type: 'FeatureCollection',
        features,
      }
      return {
        name,
        path: pathGenerator(stateFeatureCollection) ?? '',
        researchState: states.find((state) => state.state_name === name),
        featureCount: features.length,
      }
    }).filter((state) => state.path.length > 0)
  }, [collection, states])

  const featureCount = collection?.features.length ?? 0
  const selectedState = states.find((state) => state.state_code === selectedStateId)
  const tooltipName = focusedName ?? selectedState?.state_name ?? null
  const dataYears = Array.from(new Set(
    collection?.features
      .map((feature) => feature.properties?.year)
      .filter((year): year is string => Boolean(year)) ?? [],
  )).sort()

  function activateResearchState(researchState: StateProfile | undefined) {
    if (researchState) onSelectState(researchState.state_code)
  }

  function handleKeyDown(event: KeyboardEvent<SVGPathElement>, researchState: StateProfile | undefined) {
    if (!researchState || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    activateResearchState(researchState)
  }

  return (
    <div className="india-map-panel">
      <div className="india-map-heading">
        <div>
          <p className="eyebrow">India · state and union territory boundaries</p>
          <p className="india-map-subtitle">District geometries grouped by their <code>st_nm</code> property</p>
        </div>
        <span className="map-data-count">{featureCount || '—'} features</span>
      </div>

      {loadError ? (
        <div className="map-error" role="alert">
          <strong>Map unavailable</strong>
          <span>{loadError}</span>
        </div>
      ) : !collection ? (
        <div className="map-loading" role="status">Loading boundary data…</div>
      ) : (
        <div className="india-map-canvas">
          <svg
            className="india-map-svg"
            viewBox={`0 0 ${mapViewBox.width} ${mapViewBox.height}`}
            role="group"
            aria-label="Map of India with state and union territory boundaries. Focus or hover over a region to read its name. Only the four research states are selectable."
          >
            <title>India state map</title>
            <desc>
              {renderedStates.length} distinct state and union territory names from {featureCount} district features.
              Rajasthan, Kerala, Karnataka and Bihar are highlighted research cases.
            </desc>
            {renderedStates.map((state) => {
              const isSelected = state.researchState?.state_code === selectedStateId
              const accent = state.researchState
                ? stateAppearance[state.researchState.state_code]?.accent ?? '#78766d'
                : undefined
              const fill = accent ?? neutralFill
              return (
                <path
                  key={state.name}
                  data-state-code={state.researchState?.state_code}
                  className={`india-map-state${state.researchState ? ' is-research-state' : ''}${isSelected ? ' is-selected' : ''}`}
                  d={state.path}
                  fill={fill}
                  stroke={accent ?? '#f5f2e9'}
                  strokeWidth={state.researchState ? 1.15 : 0.75}
                  style={{ '--state-accent': state.researchState ? stateAppearance[state.researchState.state_code]?.accent ?? '#78766d' : '#78766d' } as CSSProperties}
                  role={state.researchState ? 'button' : 'img'}
                  tabIndex={0}
                  aria-label={state.researchState
                    ? `${state.name}, research case, ${state.featureCount} district features${isSelected ? ', selected' : ''}`
                    : `${state.name}, not a research case`}
                  aria-pressed={state.researchState ? isSelected : undefined}
                  onPointerEnter={() => setFocusedName(state.name)}
                  onPointerLeave={() => setFocusedName(null)}
                  onFocus={() => setFocusedName(state.name)}
                  onBlur={() => setFocusedName(null)}
                  onClick={() => activateResearchState(state.researchState)}
                  onKeyDown={(event) => handleKeyDown(event, state.researchState)}
                />
              )
            })}
          </svg>
          <div className="map-tooltip" role="status" aria-live="polite">
            {tooltipName
                  ? <><strong>{tooltipName}</strong>{states.some((state) => state.state_name === tooltipName) ? <span>Research case</span> : <span>Not a research case</span>}</>
              : <span>Focus or hover over a state to identify it</span>}
          </div>
        </div>
      )}

      <div className="india-map-legend" aria-label="Map legend">
        {states.map((state) => (
          <span key={state.state_code}><i style={{ backgroundColor: stateAppearance[state.state_code]?.accent ?? '#77766f' }} />{state.state_name}</span>
        ))}
        <span><i className="legend-neutral" />Other states and union territories</span>
      </div>
      <p className="map-geography-note">
        {renderedStates.length} distinct state/UT names · {featureCount} district features grouped by <code>st_nm</code>.
        The provided GeoJSON has no embedded upstream attribution or licence; source provenance and boundary currency are not yet established.
      </p>
      <p className="map-source-note">
        Geometry source: <a href={mapUrl}>public/maps/india-states.geojson</a>
        {dataYears.length > 0 && <> · data year fields include {dataYears.join(', ')}</>}
      </p>
    </div>
  )
}
