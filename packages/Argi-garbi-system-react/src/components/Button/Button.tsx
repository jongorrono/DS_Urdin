import React, { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import "../../foundations/tokens-v2.1.css";
import "../../foundations/tokens-semantic-v2.1.css";
import "../../styles/button.css";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma "Type". Named `variant` because `type` is the native button attribute. */
  variant?: ButtonVariant;
  /** Figma "Size": sm = 32px, md = 40px, lg = 52px tall. */
  size?: ButtonSize;
  /** Icon before the label (Figma "leading"). Icons should size to 100% of their box. */
  leadingIcon?: ReactNode;
  /** Icon after the label (Figma "trailing"). */
  trailingIcon?: ReactNode;
}

/**
 * Argi Garbi button.
 * Hover, pressed, focus and disabled states come from CSS (:hover, :active,
 * :focus-visible, :disabled), so there is no `state` prop.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    leadingIcon,
    trailingIcon,
    className,
    type = "button",
    children,
    ...rest
  },
  ref
) {
  const classes = ["btn", `btn--${variant}`, `btn--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {leadingIcon ? <span className="btn__icon" aria-hidden="true">{leadingIcon}</span> : null}
      <span className="btn__label">{children}</span>
      {trailingIcon ? <span className="btn__icon" aria-hidden="true">{trailingIcon}</span> : null}
    </button>
  );
});

export default Button;
