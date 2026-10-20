import React, { forwardRef } from "react";

import "../../styles/Link.css";

/**
 * Argi Garbi – Link
 * Figma: Minimal-DS-ArgiGarbi, node 7407:23340
 *
 * Props:
 *  - size:         "sm" (default) | "md" | "lg"
 *  - disabled:     boolean. Removes href, takes the link out of the tab order.
 *  - trailingIcon: boolean, default true. Set to false to hide the arrow.
 *  - icon:         node. Replaces the default arrow (ignored if trailingIcon is false).
 *  - state:        "hover" | "focus" | "visited". Forces a visual state (docs / tests only).
 *  - ...rest:      any other <a> attribute (href, target, rel, onClick...).
 */

function ArrowUpForward() {
  return (
    <svg className="link__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M6 14 14 6" />
      <path d="M7.5 6H14v6.5" />
    </svg>
  );
}

function renderIcon(icon) {
  if (icon === undefined) return <ArrowUpForward />;
  return (
    <span className="link__icon" aria-hidden="true">
      {icon}
    </span>
  );
}

export const Link = forwardRef(function Link(
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
  const classes = ["link", `link--${size}`, state && `is-${state}`, className]
    .filter(Boolean)
    .join(" ");

  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (onClick) onClick(event);
  };

  return (
    <a
      {...rest}
      ref={ref}
      className={classes}
      // An <a> without href is not focusable or navigable, which is what disabled needs.
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : (rest.tabIndex ?? 0)}
      onClick={handleClick}
    >
      {children}
      {trailingIcon && renderIcon(icon)}
    </a>
  );
});

export default Link;