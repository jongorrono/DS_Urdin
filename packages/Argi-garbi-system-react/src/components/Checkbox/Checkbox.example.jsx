import React, { useState } from "react";
import { Checkbox } from "./Checkbox";

/* Usage examples – not part of the component API. */
export function CheckboxExamples() {
  // Controlled
  const [accepted, setAccepted] = useState(false);

  // "Select all" pattern with an indeterminate parent
  const [items, setItems] = useState({ a: true, b: false, c: false });
  const values = Object.values(items);
  const allChecked = values.every(Boolean);
  const someChecked = values.some(Boolean) && !allChecked;

  const toggleAll = () => {
    const next = !allChecked;
    setItems({ a: next, b: next, c: next });
  };

  return (
    <>
      {/* Uncontrolled, with a label */}
      <Checkbox label="Remember me" defaultChecked />

      {/* Controlled */}
      <Checkbox
        label="Accept the terms"
        checked={accepted}
        onChange={(event) => setAccepted(event.target.checked)}
      />

      {/* Error */}
      <Checkbox label="You must accept the terms" error />

      {/* Disabled */}
      <Checkbox label="Not available" disabled />
      <Checkbox label="Not available" disabled defaultChecked />

      {/* Without a visible label: give it an accessible name */}
      <Checkbox aria-label="Select row" />

      {/* Indeterminate parent + children */}
      <Checkbox
        label="Select all"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={toggleAll}
      />
      {Object.keys(items).map((key) => (
        <Checkbox
          key={key}
          label={`Item ${key.toUpperCase()}`}
          checked={items[key]}
          onChange={(event) => setItems({ ...items, [key]: event.target.checked })}
        />
      ))}

      {/* Forced states, for docs / visual tests */}
      <Checkbox aria-label="Hover" defaultChecked state="hover" />
      <Checkbox aria-label="Focus" defaultChecked state="focus" />
      <Checkbox aria-label="Pressed" defaultChecked state="pressed" />
    </>
  );
}
