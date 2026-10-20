import React, { forwardRef } from "react";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

import "../../styles/Link.css";

/**
 * Argi Garbi – Link
 * Figma: Minimal-DS-ArgiGarbi, node 7407:23340
 *
 * Styles live in src/styles/Link.css and rely on the token files (src/foundations)
 * being loaded globally, in this order: tokens-v2.1.css, tokens-semantic-v2.1.css.
 */

export type LinkSize = "sm" | "md" | "lg";

/** Forces a visual state. Only meant for docs, visual tests and Storybook:
 *  real hover / focus / visited are handled by the browser. */
export type LinkForcedState = "hover" | "focus" | "visited";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Figma "Size": Small / Medium / Large. */
  size?: LinkSize;
  /** Figma "State = Disabled". Removes href, takes the link out of the tab order. */
  disabled?: boolean;
  /** Figma "Trailing icon". Set to false to hide the arrow. */
  trailingIcon?: boolean;
  /** Replace the default arrow. Ignored when trailingIcon is false. */
  icon?: ReactNode;
  /** Force a visual state (docs / tests only). */
  state?: LinkForcedState;
}

function ArrowUpForward() {
  return (
    <svg className="link__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M6 14 14 6" />
      <path d="M7.5 6H14v6.5" />
    </svg>
  );
}

function renderIcon(icon: ReactNode) {
  if (icon === undefined) return <ArrowUpForward />;
  return <span className="link__icon" aria-hidden="true">{icon}</span>;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    size = "sm",
    disabled = false,
    trailingIcon = true,
    icon,
    state,
    className,
    href,
    onClick,
    children,
    ...rest
  },
  ref,
) {
  const classes = [
    "link",
    `link--${size}`,
    state && `is-${state}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <a
      {...rest}
      ref={ref}
      className={classes}
      // An <a> without href is not focusable or navigable, which is what disabled needs.
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : rest.tabIndex}
      onClick={handleClick}
    >
      {children}
      {trailingIcon && renderIcon(icon)}
    </a>
  );
});
