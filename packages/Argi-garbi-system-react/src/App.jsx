import React from 'react';
import { Button } from "./components/Button/Button";
import { Fab } from "./components/Fab/Fab";


export default function App() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Kaixo Argi & Garbi!</h1>
      <Button variant="primary" size="lg" iconLeft="person">Save </Button>
      <p><Fab variant="tertiary" size="lg"></Fab></p>
      
      
      
    </div>
  );
}


