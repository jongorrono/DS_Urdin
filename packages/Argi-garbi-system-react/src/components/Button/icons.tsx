import React from "react";
import type { SVGProps } from "react";

/* Stand-ins for the Figma "Person" and "close_regular" icons.
   Replace the bodies with your exported SVGs; keep `currentColor` so the
   icon follows the button text color in every state. */

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  width: "100%",
  height: "100%",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const PersonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c.6-3.6 3.6-5.5 7.5-5.5s6.9 1.9 7.5 5.5" />
  </svg>
);

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
