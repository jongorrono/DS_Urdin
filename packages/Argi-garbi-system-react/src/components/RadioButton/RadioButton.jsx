import React, { forwardRef } from "react";

import "../../styles/RadioButton.css";

/**
 * Argi Garbi – Radio button
 * Figma: Minimal-DS-ArgiGarbi, node 7465:7847
 *
 * Props:
 *  - label:      node. Optional text next to the circle. Omit it and pass aria-label instead.
 *  - name:       string. Radios that share a name form a group (arrow keys move between them).
 *  - value:      string. The value this radio represents.
 *  - checked / defaultChecked / onChange: controlled or uncontrolled, like a normal radio.
 *  - error:      boolean. Figma "Type = Error". Also sets aria-invalid.
 *  - disabled:   boolean.
 *  - state:      "hover" | "focus" | "pressed". Forces a visual state (docs / tests only).
 *  - ...rest:    any other <input> attribute (id, required, aria-label...).
 */

export const RadioButton = forwardRef(function RadioButton(
  { label, error = false, disabled = false, state, className, ...rest },
  ref,
) {
  const classes = [
    "radio",
    error && "radio--error",
    state && `is-${state}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes}>
      <input
        {...rest}
        ref={ref}
        className="radio__input"
        type="radio"
        disabled={disabled}
        aria-invalid={error || undefined}
      />
      <span className="radio__control" aria-hidden="true" />
      {label && <span className="radio__label">{label}</span>}
    </label>
  );
});

export default RadioButton;
