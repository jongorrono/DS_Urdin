import React from 'react'
import '../../styles/fab.css'

/**
 * Fab (floating action button) – Argi Garbi DS
 * Figma: "Minimal-DS-ArgiGarbi", node 7474:2996
 *
 * Anatomy: 1 container (circle) + 2 icon (24px).
 *
 * Props
 *  variant    'primary' | 'secondary' | 'tertiary'   (default 'primary')
 *  size       'sm' (32px) | 'md' (40px) | 'lg' (48px) (default 'md')
 *  disabled   boolean
 *  children   custom icon (an <svg className="fab__icon">). Default: plus icon
 *  forceState 'hover' | 'focus'  (documentation only: shows a state without interaction)
 *  className  extra classes
 *  type       'button' | 'submit' | 'reset'           (default 'button')
 *
 * The FAB has no text, so always pass aria-label:
 *   <Fab aria-label="Add item" />
 * Any other prop (onClick, id...) is passed to the <button>.
 */

const FORCED_STATE = {
  hover: 'is-hover',
  focus: 'is-focus',
}

// Default icon: "add_regular". Swap the <path> with the SVG exported from Figma if you want the original.
function PlusIcon() {
  return (
    <svg
      className="fab__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 4v16M4 12h16" />
    </svg>
  )
}

export function Fab({
  variant = 'primary',
  size = 'md',
  disabled = false,
  forceState,
  className = '',
  type = 'button',
  children,
  ...props
}) {
  const classes = [
    'fab',
    `fab--${variant}`,
    `fab--${size}`,
    !disabled && forceState ? FORCED_STATE[forceState] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children || <PlusIcon />}
    </button>
  )
}
