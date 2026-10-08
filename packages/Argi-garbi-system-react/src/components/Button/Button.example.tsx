import React from 'react';
import { Button } from "./Button";
import { CloseIcon, PersonIcon } from "./icons";

export function ButtonExamples() {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="primary" size="lg" leadingIcon={<PersonIcon />} trailingIcon={<CloseIcon />}>
        Button text
      </Button>
      <Button variant="secondary" size="md" leadingIcon={<PersonIcon />}>
        Button text
      </Button>
      <Button variant="tertiary" size="sm" trailingIcon={<CloseIcon />} onClick={() => alert("clicked")}>
        Button text
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}
