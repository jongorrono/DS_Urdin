import React from 'react';
import Input from './Input.jsx';

const sizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const states = [
  { value: 'default', label: 'Default' },
  { value: 'hover', label: 'Hover' },
  { value: 'focus', label: 'Focus' },
  { value: 'error', label: 'Error' },
  { value: 'success', label: 'Success' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'readonly', label: 'Read only' },
];

function ExampleField({ size, state }) {
  const disabled = state === 'disabled';
  const readOnly = state === 'readonly';
  const status = state === 'error' || state === 'success' ? state : 'default';
  const filled = state === 'error' || state === 'success' || readOnly;
  const className = `input-example__field input-example__field--${state}`;

  return (
    <div className="input-example__cell">
      <div className="input-example__caption">{state === 'readonly' ? 'Read only' : state[0].toUpperCase() + state.slice(1)}</div>
      <Input
        id={`input-example-${size}-${state}`}
        className={className}
        size={size}
        label="Label"
        placeholder="Placeholder text"
        helperText={state === 'error' ? 'Please check this field.' : state === 'success' ? 'Looks good.' : state === 'readonly' ? 'Read-only information.' : 'Helper text'}
        status={status}
        disabled={disabled}
        readOnly={readOnly}
        defaultValue={filled ? (state === 'readonly' ? 'Read-only value' : 'Example value') : ''}
        leadingIcon={state !== 'focus'}
        clearable={state !== 'disabled' && state !== 'readonly'}
      />
    </div>
  );
}

/**
 * Visual specimen sheet for the Input component.
 * Displays all seven Figma states across Small, Medium, and Large sizes.
 */
export default function InputExample() {
  return (
    <main className="page input-example">
      <header className="input-example__header">
        <p className="input-example__eyebrow">Argi Garbi · Design system</p>
        <h1>Input</h1>
        <p className="intro">Component states and sizes based on the Input component in Figma.</p>
      </header>

      {sizes.map((size) => (
        <section className="input-example__size-section" key={size.value} aria-labelledby={`input-example-heading-${size.value}`}>
          <h2 className="section-title" id={`input-example-heading-${size.value}`}>{size.label}</h2>
          <div className="input-example__grid">
            {states.map((state) => (
              <ExampleField key={`${size.value}-${state.value}`} size={size.value} state={state.value} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
