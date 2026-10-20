import React, { forwardRef, useState } from "react";

import "../../styles/Chip.css";

/**
 * Argi Garbi – Chip
 * Figma: Minimal-DS-ArgiGarbi, node 7466:1542
 *
 * A chip is a button. Use it as a toggle (filters, options) or as a plain button.
 *
 * Props:
 *  - children:         the label text, e.g. <Chip>Design</Chip>.
 *  - size:             "sm" (default) | "md" | "lg".
 *  - selected:         boolean. Controlled toggle: you own the state, update it in onSelectedChange.
 *  - defaultSelected:  boolean. Uncontrolled toggle: the chip keeps its own state.
 *  - onSelectedChange: (nextSelected, event) => void. Called when a toggle chip is clicked.
 *  - leadingIcon:      true for the default clock icon, or pass your own node.
 *  - trailingIcon:     true for the default link icon, or pass your own node.
 *  - disabled:         boolean.
 *  - state:            "hover" | "focus" | "pressed". Forces a visual state (docs / tests only).
 *  - ...rest:          any other <button> attribute (onClick, name, value, aria-label...).
 *
 * Pass neither `selected` nor `defaultSelected` and the chip is a plain button (no aria-pressed).
 * A custom icon should be an <svg> that uses currentColor, so it follows the chip's text colour.
 */

function ClockIcon() {
  return (
    <svg className="chip__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="7.25" />
      <path d="M10 5.75V10l2.75 1.75" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="chip__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M8.5 11.5a3 3 0 0 0 4.24 0l2.5-2.5a3 3 0 0 0-4.24-4.24l-.9.9" />
      <path d="M11.5 8.5a3 3 0 0 0-4.24 0l-2.5 2.5a3 3 0 0 0 4.24 4.24l.9-.9" />
    </svg>
  );
}

// true -> the default icon, a node -> the caller's icon, anything else -> nothing.
function renderIcon(value, DefaultIcon) {
  if (value === true) return <DefaultIcon />;
  if (!value) return null;
  return (
    <span className="chip__icon" aria-hidden="true">
      {value}
    </span>
  );
}

export const Chip = forwardRef(function Chip(
  {
    size = "sm",
    selected,
    defaultSelected,
    onSelectedChange,
    leadingIcon = false,
    trailingIcon = false,
    disabled = false,
    state,
    className,
    onClick,
    children,
    ...rest
  },
  ref,
) {
  const isControlled = selected !== undefined;
  const isToggle = isControlled || defaultSelected !== undefined;
  const [innerSelected, setInnerSelected] = useState(Boolean(defaultSelected));
  const isSelected = isControlled ? selected : innerSelected;

  const handleClick = (event) => {
    if (onClick) onClick(event);
    if (!isToggle || event.defaultPrevented) return;
    const next = !isSelected;
    if (!isControlled) setInnerSelected(next);
    if (onSelectedChange) onSelectedChange(next, event);
  };

  const classes = ["chip", `chip--${size}`, state && `is-${state}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...rest}
      ref={ref}
      type={rest.type || "button"}
      className={classes}
      disabled={disabled}
      aria-pressed={isToggle ? isSelected : undefined}
      onClick={handleClick}
    >
      {renderIcon(leadingIcon, ClockIcon)}
      <span className="chip__label">{children}</span>
      {renderIcon(trailingIcon, LinkIcon)}
    </button>
  );
});

export default Chip;
