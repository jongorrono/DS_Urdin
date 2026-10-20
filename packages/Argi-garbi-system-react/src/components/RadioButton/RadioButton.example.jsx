import React, { useState } from "react";
import { RadioButton } from "./RadioButton";

/* Usage examples – not part of the component API. */
export function RadioButtonExamples() {
  // Controlled group: one value in state, every radio compares against it.
  const [plan, setPlan] = useState("free");

  return (
    <>
      {/* Controlled group */}
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend>Plan</legend>
        {["free", "pro"].map((value) => (
          <div key={value}>
            <RadioButton
              name="plan"
              value={value}
              label={value === "free" ? "Free" : "Pro"}
              checked={plan === value}
              onChange={(event) => setPlan(event.target.value)}
            />
          </div>
        ))}
        <div>
          <RadioButton name="plan" value="team" label="Team (not available)" disabled />
        </div>
      </fieldset>

      {/* Uncontrolled group, first option selected by default */}
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend>Billing</legend>
        <div><RadioButton name="billing" value="monthly" label="Monthly" defaultChecked /></div>
        <div><RadioButton name="billing" value="yearly" label="Yearly" /></div>
      </fieldset>

      {/* Error group */}
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend>Choose one option</legend>
        <div><RadioButton name="required" value="a" label="Option A" error /></div>
        <div><RadioButton name="required" value="b" label="Option B" error /></div>
      </fieldset>

      {/* Without a visible label: give it an accessible name */}
      <RadioButton name="solo" value="x" aria-label="Select this row" />

      {/* Forced states, for docs / visual tests */}
      <RadioButton name="forced-hover" aria-label="Hover" defaultChecked state="hover" />
      <RadioButton name="forced-focus" aria-label="Focus" defaultChecked state="focus" />
      <RadioButton name="forced-pressed" aria-label="Pressed" defaultChecked state="pressed" />
    </>
  );
}
