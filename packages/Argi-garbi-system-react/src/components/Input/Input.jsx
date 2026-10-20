import React, { useId, useState } from 'react';
import '../../styles/input.css';

function UserIcon() {
  return <svg className="leading-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 21c.6-4.1 3.4-6 8-6s7.4 1.9 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function ClearIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function StatusIcon({ status }) {
  if (status === 'error') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v6m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  if (status === 'success') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return null;
}

/**
 * Input field for the Argi Garbi design system.
 * size: small | medium | large
 * status: default | error | success
 */
export default function Input({
  id,
  label = 'Label',
  placeholder = 'Placeholder text',
  helperText = 'Helper text',
  size = 'medium',
  status = 'default',
  disabled = false,
  readOnly = false,
  leadingIcon = true,
  clearable = true,
  defaultValue = '',
  value: controlledValue,
  onChange,
  type = 'text',
  name,
  autoComplete,
  required = false,
  className = '',
  ...inputProps
}) {
  const generatedId = useId();
  const inputId = id || `argi-input-${generatedId}`;
  const helperId = `${inputId}-helper`;
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;
  const isStatus = status === 'error' || status === 'success';

  function handleChange(event) {
    if (!isControlled) setInternalValue(event.target.value);
    onChange?.(event);
  }
  function clearValue() {
    if (disabled || readOnly) return;
    if (!isControlled) setInternalValue('');
    if (isControlled) onChange?.({ target: { value: '', name, id: inputId } });
    document.getElementById(inputId)?.focus();
  }

  const fieldClass = ['field', `field--${size}`, status !== 'default' ? `field--${status}` : '', disabled ? 'field--disabled' : '', readOnly ? 'field--readonly' : '', className].filter(Boolean).join(' ');
  const controlClass = ['control', `control--${size}`, status !== 'default' ? `control--${status}` : '', disabled ? 'control--disabled' : '', readOnly ? 'control--readonly' : ''].filter(Boolean).join(' ');

  return (
    <div className={fieldClass}>
      {label && <label className="field-label" htmlFor={inputId}>{label}{required && <span aria-hidden="true"> *</span>}</label>}
      <div className={controlClass}>
        {leadingIcon && <UserIcon />}
        <input
          {...inputProps}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={status === 'error' ? 'true' : undefined}
          aria-describedby={helperText ? helperId : undefined}
        />
        {isStatus ? (
          <span className="trailing-icon" aria-hidden="true"><StatusIcon status={status} /></span>
        ) : clearable && value && !disabled && !readOnly ? (
          <button className="trailing-icon" type="button" aria-label="Clear input" onClick={clearValue}><ClearIcon /></button>
        ) : null}
      </div>
      {helperText && <span className="helper" id={helperId} role={status === 'error' ? 'alert' : undefined}>{helperText}</span>}
    </div>
  );
}
