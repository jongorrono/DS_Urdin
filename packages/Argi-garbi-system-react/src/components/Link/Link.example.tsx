import React from "react";
import { Link } from "./Link";

/* Usage examples – not part of the component API. */
export function LinkExamples() {
  return (
    <>
      {/* Default: Small, with trailing icon */}
      <Link href="https://example.com">Link</Link>

      <Link href="https://example.com" size="md">Medium</Link>
      <Link href="https://example.com" size="lg">Large</Link>

      {/* External */}
      <Link href="https://example.com" target="_blank" rel="noopener noreferrer">
        Open example.com
      </Link>

      {/* No trailing icon */}
      <Link href="/docs" trailingIcon={false}>Read the docs</Link>

      {/* Disabled */}
      <Link href="/docs" disabled>Unavailable</Link>

      {/* Forced state, for docs / visual tests */}
      <Link href="#" state="focus">Focus</Link>
    </>
  );
}
