import React from "react";
import { Tag } from "./Tag";

const COLORS = ["neutral", "inverse", "success", "error", "brand"];
const SIZES = ["sm", "md", "lg"];

/* Usage examples – not part of the component API. */
export function TagExamples() {
  return (
    <>
      {/* Default: small, neutral */}
      <Tag>TAG</Tag>

      {/* Sizes */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {SIZES.map((size) => (
          <Tag key={size} size={size} color="brand">
            {size.toUpperCase()}
          </Tag>
        ))}
      </div>

      {/* Colours */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {COLORS.map((color) => (
          <Tag key={color} size="md" color={color}>
            {color}
          </Tag>
        ))}
      </div>

      {/* Icons: default clock / link, or your own */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Tag size="md" color="success" leadingIcon>
          Scheduled
        </Tag>
        <Tag size="md" color="error" trailingIcon>
          Docs
        </Tag>
        <Tag size="md" color="inverse" leadingIcon trailingIcon>
          Both
        </Tag>
        <Tag
          size="md"
          color="brand"
          leadingIcon={
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 4v12M4 10h12" />
            </svg>
          }
        >
          Custom
        </Tag>
      </div>

      {/* Grows with its content */}
      <Tag size="md" color="brand">
        In review
      </Tag>
    </>
  );
}
