import React from 'react'
import '../../styles/button.example.css'
import { Button } from './Button'

const VARIANTS = ['primary', 'secondary', 'tertiary']
const SIZES = [
  ['Small', 'sm'],
  ['Medium', 'md'],
  ['Large', 'lg'],
]
const STATES = [
  ['Default', undefined],
  ['Hover', 'hover'],
  ['Pressed', 'pressed'],
  ['Focus', 'focus'],
  ['Disabled', 'disabled'],
]

const capitalize = (text) => text[0].toUpperCase() + text.slice(1)

export function ButtonExamples() {
  return (
    <>
      <h1>Button</h1>
      <p className="lead">
        Types: primary, secondary, tertiary. Sizes: small, medium, large. States: default, hover,
        pressed, focus, disabled.
      </p>

      <h2>Live (try hover, click, Tab)</h2>
      <div className="row">
        <Button variant="primary" size="lg" iconLeft="person" iconRight="close">
          Button text
        </Button>
        <Button variant="secondary" size="md" iconLeft="person" iconRight="close">
          Button text
        </Button>
        <Button variant="tertiary" size="sm" iconLeft="person" iconRight="close">
          Button text
        </Button>
        <Button disabled>Disabled</Button>
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
    </>
  )
}

function Row({ variant, stateLabel, state }) {
  const isDisabled = state === 'disabled'
  return (
    <>
      <span className="rowlabel">{stateLabel}</span>
      {SIZES.map(([, size]) => (
        <Button
          key={size}
          variant={variant}
          size={size}
          disabled={isDisabled}
          forceState={isDisabled ? undefined : state}
          iconLeft="person"
          iconRight="close"
        >
          Button text
        </Button>
      ))}
    </>
  )
}
