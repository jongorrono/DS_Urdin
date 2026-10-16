import React from 'react'
import '../../styles/fab.example.css'
import { Fab } from './Fab'

const VARIANTS = ['primary', 'secondary', 'tertiary']
const SIZES = [
  ['Small', 'sm'],
  ['Medium', 'md'],
  ['Large', 'lg'],
]
const STATES = [
  ['Default', undefined],
  ['Hover', 'hover'],
  ['Focus', 'focus'],
  ['Disabled', 'disabled'],
]

const capitalize = (text) => text[0].toUpperCase() + text.slice(1)

export function FabExamples() {
  return (
    <div className="fab-examples">
      <h1>FAB</h1>
      <p className="lead">
        Types: primary, secondary, tertiary. Sizes: small (32), medium (40), large (48). States:
        default, hover, focus, disabled.
      </p>

      <h2>Live (try hover, click, Tab)</h2>
      <div className="row">
        <Fab variant="primary" size="lg" aria-label="Add" />
        <Fab variant="secondary" size="md" aria-label="Add" />
        <Fab variant="tertiary" size="sm" aria-label="Add" />
        <Fab disabled aria-label="Add" />
      </div>

      {/* Documentation matrix: every variant x state x size */}
      {VARIANTS.map((variant) => (
        <section key={variant}>
          <h2>{capitalize(variant)}</h2>
          <div className="grid">
            <span />
            {SIZES.map(([label]) => (
              <span key={label} className="h">
                {label}
              </span>
            ))}

            {STATES.map(([stateLabel, state]) => (
              <Row key={stateLabel} variant={variant} stateLabel={stateLabel} state={state} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function Row({ variant, stateLabel, state }) {
  const isDisabled = state === 'disabled'
  return (
    <>
      <span className="rowlabel">{stateLabel}</span>
      {SIZES.map(([, size]) => (
        <Fab
          key={size}
          variant={variant}
          size={size}
          disabled={isDisabled}
          forceState={isDisabled ? undefined : state}
          aria-label="Add"
        />
      ))}
    </>
  )
}
