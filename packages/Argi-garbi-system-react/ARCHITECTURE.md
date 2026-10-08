# Design System Architecture

This project follows Andrew Couldwell's design system architecture from "Laying the Foundations", adapted for React components.

## Directory Structure

```
src/
├── foundations/                   # Core design system foundations
│   ├── tokens/                    # Design tokens
│   │   ├── colors.js              # Color palette and semantic colors
│   │   ├── typography.js          # Font families, sizes, weights
│   │   ├── spacing.js             # Spacing scale (8px grid)
│   │   ├── shadows.js             # Elevation and focus shadows
│   │   ├── borders.js             # Border styles and radius
│   │   └── index.js               # Token exports
│   ├── themes/                    # Theme configurations
│   │   ├── light.js               # Light theme
│   │   ├── dark.js                # Dark theme
│   │   └── index.js               # Theme exports
│   └── base/                      # Base styles and resets
│       ├── reset.css              # CSS reset
│       ├── typography.css         # Typography foundation
│       └── index.css              # Main CSS file with custom properties
│
├── components/                    # Basic building blocks
│   ├── Badge/                     # Badge component
│   │   ├── Badge.jsx              # Component implementation
│   │   ├── Badge.css              # Component styles
│   │   ├── Badge.stories.jsx      # Storybook stories
│   │   ├── Badge.test.jsx         # Component tests
│   │   ├── README.md              # Component documentation
│   │   └── index.js               # Component exports
│   └── index.js                   # All components export
│
├── patterns/                      # Reusable UI patterns
│   └── index.js                   # Pattern exports (future)
│
├── templates/                     # Page layouts and structures
│   └── index.js                   # Template exports (future)
│
├── pages/                         # Full page implementations
│   └── index.js                   # Page exports (future)
│
├── hooks/                         # Custom React hooks
│   └── index.js                   # Hook exports (future)
│
├── utils/                         # Utility functions
│   └── index.js                   # Utility exports (future)
│
├── services/                      # External services and API
│   └── index.js                   # Service exports (future)
│
├── types/                         # TypeScript definitions
│   └── index.ts                   # Type exports (future)
│
└── App.jsx                        # Main application
```

## Design System Principles

### 1. Foundations
- **Tokens**: Centralized design decisions (colors, typography, spacing, etc.)
- **Themes**: Consistent color schemes for light/dark modes
- **Base**: CSS reset, typography foundation, and custom properties

### 2. Components
- **Atomic**: Basic UI elements that can't be broken down further
- **Co-located**: Each component has its own directory with all related files
- **Documented**: README, stories, and tests for each component
- **Accessible**: Built with accessibility in mind

### 3. Patterns
- **Combinations**: Reusable combinations of components
- **Examples**: SearchBar (Button + Input), Card (Container pattern), Modal (Overlay pattern)

### 4. Templates
- **Layouts**: Page structure and framework
- **Examples**: DefaultLayout, AuthLayout, DashboardLayout

### 5. Pages
- **Complete**: Full page implementations using templates and patterns
- **Examples**: HomePage, AboutPage, ContactPage

## Import Examples

```javascript
// Foundations
import { colors, spacing, typography } from 'foundations/tokens'
import { lightTheme, darkTheme } from 'foundations/themes'

// Components
import { Badge, Button, Input } from 'components'

// Patterns (future)
import { SearchBar, Card, Modal } from 'patterns'

// Templates (future)
import { DefaultLayout, AuthLayout } from 'templates'

// Pages (future)
import { HomePage, AboutPage } from 'pages'
```

## Benefits

1. **Scalable**: Easy to add new components without cluttering
2. **Maintainable**: Clear boundaries and responsibilities
3. **Consistent**: Design tokens ensure visual consistency
4. **Accessible**: Built-in accessibility considerations
5. **Documented**: Comprehensive documentation for each component
6. **Testable**: Co-located tests for reliability
7. **Themeable**: Easy theme switching with CSS custom properties
8. **Business-friendly**: Intuitive naming that non-technical stakeholders understand

## Development Workflow

1. **Add new tokens** in `foundations/tokens/`
2. **Create components** in `components/ComponentName/`
3. **Build patterns** by combining components in `patterns/`
4. **Design templates** for page layouts in `templates/`
5. **Implement pages** using templates and patterns in `pages/`

## Tools Integration

- **Storybook**: Stories co-located with components
- **Testing**: Jest/Vitest tests for each component
- **Linting**: ESLint for code quality
- **TypeScript**: Ready for TypeScript migration
- **CSS**: Modern CSS with custom properties
