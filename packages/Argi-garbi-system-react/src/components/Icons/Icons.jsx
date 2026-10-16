import React from 'react'

// Icons are drawn here and used by name: <Icon name="person" />.
// The Button does this for you: <Button iconLeft="person">.
// To add an icon, add one entry to ICONS (paste the SVG shapes exported from Figma).
// stroke="currentColor" makes the icon follow the text color of its parent.
const ICONS = {
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c.6-3.6 3.6-5.5 7.5-5.5s6.9 1.9 7.5 5.5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
}

export function Icon({ name, className = 'btn__icon' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  )
}
