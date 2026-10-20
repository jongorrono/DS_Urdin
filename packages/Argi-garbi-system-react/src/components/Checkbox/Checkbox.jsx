import React, { forwardRef, useCallback, useEffect, useRef } from "react";

import "../../styles/Checkbox.css";

/**
 * Argi Garbi – Checkbox
 * Figma: Minimal-DS-ArgiGarbi, node 7465:3497
 *
 * Props:
 *  - label:         node. Optional text next to the box. Omit it and pass aria-label instead.
 *  - checked / defaultChecked / onChange: controlled or uncontrolled, like a normal checkbox.
 *  - indeterminate: boolean. Shows the dash (Figma "Indetermined"). Cleared by the user's click,
 *                   so keep it in your state and reset it in onChange.
 *  - error:         boolean. Figma "Type = Error". Also sets aria-invalid.
 *  - disabled:      boolean.
 *  - state:         "hover" | "focus" | "pressed". Forces a visual state (docs / tests only).
 *  - ...rest:       any other <input> attribute (name, value, id, required, aria-label...).
 */

export const Checkbox = forwardRef(function Checkbox(
  {
    label,
    indeterminate = false,
    error = false,
    disabled = false,
    state,
    className,
    ...rest
  },
  ref,
) {
  const inputRef = useRef(null);

  // "indeterminate" can't be set in markup, only through the DOM property.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  // Keep our own ref and still forward the one the parent passes in.
  const setRefs = useCallback(
    (node) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const classes = [
    "checkbox",
    error && "checkbox--error",
    state && `is-${state}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes}>
      <input
        {...rest}
        ref={setRefs}
        className="checkbox__input"
        type="checkbox"
        disabled={disabled}
        aria-invalid={error || undefined}
      />
      <span className="checkbox__control" aria-hidden="true" />
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  );
});

export default Checkbox;
