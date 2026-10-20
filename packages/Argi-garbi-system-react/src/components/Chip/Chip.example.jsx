import React, { useState } from "react";
import { Chip } from "./Chip";

const FILTERS = ["All", "Design", "Engineering", "Research"];

/* Usage examples – not part of the component API. */
export function ChipExamples() {
  // Controlled: single-select filter group, one value in state.
  const [filter, setFilter] = useState("All");

  // Controlled: multi-select, a list of values in state.
  const [topics, setTopics] = useState(["Design"]);
  const toggleTopic = (topic, isOn) =>
    setTopics((current) => (isOn ? [...current, topic] : current.filter((t) => t !== topic)));

  return (
    <>
      {/* Single-select group */}
      <div role="group" aria-label="Filter" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {FILTERS.map((name) => (
          <Chip
            key={name}
            size="md"
            selected={filter === name}
            onSelectedChange={() => setFilter(name)}
          >
            {name}
          </Chip>
        ))}
        <Chip size="md" disabled>
          Archived
        </Chip>
      </div>

      {/* Multi-select group */}
      <div role="group" aria-label="Topics" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["Design", "Code", "Research"].map((topic) => (
          <Chip
            key={topic}
            size="md"
            selected={topics.includes(topic)}
            onSelectedChange={(isOn) => toggleTopic(topic, isOn)}
          >
            {topic}
          </Chip>
        ))}
      </div>

      {/* Uncontrolled toggle, starts selected */}
      <Chip defaultSelected>Remember me</Chip>

      {/* Plain button chip (no toggle) */}
      <Chip size="lg" onClick={() => console.log("clicked")}>
        Open
      </Chip>

      {/* Sizes */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Chip size="sm">Chips</Chip>
        <Chip size="md">Chips</Chip>
        <Chip size="lg">Chips</Chip>
      </div>

      {/* Icons: default clock / link, or your own */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Chip size="md" leadingIcon>
          Recent
        </Chip>
        <Chip size="md" trailingIcon>
          Docs
        </Chip>
        <Chip size="md" leadingIcon trailingIcon defaultSelected>
          Both
        </Chip>
        <Chip
          size="md"
          leadingIcon={
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 4v12M4 10h12" />
            </svg>
          }
        >
          Custom
        </Chip>
      </div>

      {/* Forced states, for docs / visual tests */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Chip state="hover">Hover</Chip>
        <Chip state="focus">Focus</Chip>
        <Chip state="pressed">Pressed</Chip>
        <Chip selected>Selected</Chip>
        <Chip disabled>Disabled</Chip>
      </div>
    </>
  );
}
