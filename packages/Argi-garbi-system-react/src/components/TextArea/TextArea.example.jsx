import React, { useState } from "react";
import { TextArea } from "./TextArea";

/* Usage examples – not part of the component API. */
export function TextAreaExamples() {
  const [bio, setBio] = useState("");

  return (
    <>
      {/* Default (uncontrolled) */}
      <TextArea label="Label" helperText="Helper text" placeholder="Placeholder text" />

      {/* Controlled */}
      <TextArea
        label="Bio"
        helperText="Tell us about yourself"
        placeholder="Placeholder text"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
      />

      {/* Validation states */}
      <TextArea label="Label" helperText="Helper text" status="error" defaultValue="Placeholder text" />
      <TextArea label="Label" helperText="Helper text" status="success" defaultValue="Placeholder text" />

      {/* Disabled / read only */}
      <TextArea label="Label" helperText="Helper text" placeholder="Placeholder text" disabled />
      <TextArea label="Label" helperText="Helper text" defaultValue="Placeholder text" readOnly />

      {/* No counter, custom limit */}
      <TextArea label="Notes" showCount={false} maxLength={500} />

      {/* Forced states, for docs / visual tests */}
      <TextArea label="Label" helperText="Helper text" placeholder="Placeholder text" state="hover" />
      <TextArea label="Label" helperText="Helper text" placeholder="Placeholder text" state="focus" />
    </>
  );
}
