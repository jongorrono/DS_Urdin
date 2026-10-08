# DS_Urdin — Design System

A production-ready React component library and CSS design token architecture based on the **Argi Garbi** design system. Built with React, TypeScript, and modern CSS custom properties.

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: `v22.20.0` (requires `>=18.0.0`)
* **npm**: `v10.9.3` (requires `>=9.0.0`)

### Installation & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jongorrono/DS_Urdin.git
   cd DS_Urdin
   
2. Install dependencies:
npm install

3. Start local development server:
npm run dev

4. View in Browser
Open http://localhost:5173/ in your browser to view the interactive component suite.

## Design Tokens & Architecture
The design system relies on a two-layer token architecture located in src/styles/:
- Primitive Tokens (tokens-primitives-v1.1.css): Raw palette values (--primary-80, --neutral-00), base spacing scale, font families (IBM Plex Mono, Rubik), and shadow abstractions. 
  
- Semantic Tokens (tokens-semantic-v2.1.css): Context-aware aliases mapping primitive tokens to design intents (--surface-brand, --text-on-brand, --space-md).   

## Component Overview
<Button />

Flexible action trigger supporting multiple variants, sizes, icon slots, and interactive states.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Visual style of the button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height: `sm` (32px), `md` (40px), `lg` (52px) |
| `leadingIcon` | `ReactNode` | `undefined` | SVG icon element rendered before the label |
| `trailingIcon` | `ReactNode` | `undefined` | SVG icon element rendered after the label |
| `disabled` | `boolean` | `false` | Native HTML disabled state |


## Use example
import { Button } from './components/Button/Button';
import { PersonIcon, CloseIcon } from './components/Button/icons';

export function Example() {
  return (
    <Button leadingIcon="{<PersonIcon" size="lg" variant="primary"/>} 
      trailingIcon={<CloseIcon/>}
    >
      Button Text
    </Button>
  );
}
## Project Structure
ds-urdin/
├── src/
│   ├── components/       # UI Component modules
│   │   └── Button/       # Button component, icons, and preview examples
│   ├── styles/           # CSS Primitive and Semantic tokens
│   ├── App.jsx           # Sandbox application
│   └── main.jsx          # Entry point
├── ARCHITECTURE.md       # In-depth engineering decisions
└── package.json          # Dependencies and scripts


## Scripts
npm run dev: Launch Vite development server.
npm run build: Compile component library for production distribution.
npm run lint: Run ESLint checks across JSX/TSX files.

## License
MIT © Jon Gorroño