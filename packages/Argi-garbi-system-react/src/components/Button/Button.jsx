import React from 'react'
import '../../styles/button.css'
import { Icon } from '../Icons/Icons'

/**
 * Button – Argi Garbi DS
 *
 * Props
 *  variant   'primary' | 'secondary' | 'tertiary'   (default 'primary')
 *  size      'sm' | 'md' | 'lg'                      (default 'md')
 *  iconLeft  icon name, e.g. 'person'
 *  iconRight icon name, e.g. 'close'
 *  disabled  boolean
 *  forceState 'hover' | 'pressed' | 'focus'  (documentation only: shows a state without interaction)
 *  className extra classes
 *  type      'button' | 'submit' | 'reset'           (default 'button')
 *  children  the label
 *
 * Any other prop (onClick, aria-label, id...) is passed to the <button>.
 */

const FORCED_STATE = {
  hover: 'is-hover',
  pressed: 'is-pressed',
  focus: 'is-focus',
}

export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled = false,
  forceState,
  className = '',
  type = 'button',
  children,
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    !disabled && forceState ? FORCED_STATE[forceState] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {iconLeft && <Icon name={iconLeft} />}
      <span className="btn__label">{children}</span>
      {iconRight && <Icon name={iconRight} />}
    </button>
  )
}
