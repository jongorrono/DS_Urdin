import React, { forwardRef } from "react";

import "../../styles/Tag.css";

/**
 * Argi Garbi – Tag
 * Figma: Minimal-DS-ArgiGarbi, node 7465:8686
 *
 * Props:
 *  - children:     the label text, e.g. <Tag>In review</Tag>.
 *  - size:         "sm" (default) | "md" | "lg".
 *  - color:        "neutral" (default) | "inverse" | "success" | "error" | "brand".
 *  - leadingIcon:  true for the default clock icon, or pass your own node.
 *  - trailingIcon: true for the default link icon, or pass your own node.
 *  - ...rest:      any other <span> attribute (id, title, onClick, aria-label...).
 *
 * A custom icon should be an <svg> that uses currentColor, so it follows the tag's text colour.
 */

function ClockIcon() {
  return (
    <svg className="tag__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="7.25" />
      <path d="M10 5.75V10l2.75 1.75" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="tag__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
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
    <span className="tag__icon" aria-hidden="true">
      {value}
    </span>
  );
}

export const Tag = forwardRef(function Tag(
  {
    size = "sm",
    color = "neutral",
    leadingIcon = false,
    trailingIcon = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const classes = ["tag", `tag--${size}`, `tag--${color}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span {...rest} ref={ref} className={classes}>
      {renderIcon(leadingIcon, ClockIcon)}
      <span className="tag__label">{children}</span>
      {renderIcon(trailingIcon, LinkIcon)}
    </span>
  );
});

export default Tag;
