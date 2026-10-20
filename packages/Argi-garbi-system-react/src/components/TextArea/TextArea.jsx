import React, { forwardRef, useId, useState } from "react";

import "../../styles/TextArea.css";

/**
 * Argi Garbi – Text area
 * Figma: Minimal-DS-ArgiGarbi, node 7423:4963
 *
 * Props:
 *  - label:       string, default "Label".
 *  - helperText:  string. Text under the field. Omit to hide it.
 *  - showCount:   boolean, default true. Shows the "n/max" counter.
 *  - maxLength:   number, default 100. Also used by the counter.
 *  - status:      "error" | "success". Validation state (adds the icon and colours).
 *  - disabled:    boolean.
 *  - readOnly:    boolean.
 *  - value / defaultValue / onChange: controlled or uncontrolled, like a normal <textarea>.
 *  - state:       "hover" | "focus". Forces a visual state (docs / tests only).
 *  - ...rest:     any other <textarea> attribute (name, placeholder, rows, required...).
 */

function ExclamationIcon() {
  return (
    <svg className="textarea__status" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M10 2.75 18.25 17H1.75z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M10 7.75v4"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ stroke: "var(--_surface, #e6e6e8)" }}
      />
      <circle cx="10" cy="14.25" r=".95" style={{ fill: "var(--_surface, #e6e6e8)" }} />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="textarea__status" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M4.5 10.5 8.5 14.5 15.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const TextArea = forwardRef(function TextArea(
  {
    label = "Label",
    helperText,
    showCount = true,
    maxLength = 100,
    status,
    disabled = false,
    readOnly = false,
    state,
    id,
    className,
    value,
    defaultValue,
    onChange,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const fieldId = id || `textarea-${generatedId}`;
  const helperId = `${fieldId}-help`;
  const countId = `${fieldId}-count`;

  // The counter follows the value, whether the field is controlled or not.
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(defaultValue ?? "");
  const currentLength = String(isControlled ? value : innerValue).length;

  const handleChange = (event) => {
    if (!isControlled) setInnerValue(event.target.value);
    if (onChange) onChange(event);
  };

  const classes = [
    "textarea",
    status && `textarea--${status}`,
    state && `is-${state}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const describedBy =
    [ariaDescribedBy, helperText ? helperId : null, showCount ? countId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={classes}>
      <div className="textarea__header">
        <label className="textarea__label" htmlFor={fieldId}>
          {label}
        </label>
        {showCount && (
          <span className="textarea__count" id={countId}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <div className="textarea__control">
        <textarea
          {...rest}
          ref={ref}
          id={fieldId}
          className="textarea__input"
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={status === "error" || undefined}
          aria-describedby={describedBy}
          {...(isControlled ? { value } : { defaultValue })}
          onChange={handleChange}
        />
        {status === "error" && <ExclamationIcon />}
        {status === "success" && <CheckIcon />}
      </div>

      {helperText && (
        <p className="textarea__helper" id={helperId}>
          {helperText}
        </p>
      )}
    </div>
  );
});

export default TextArea;
