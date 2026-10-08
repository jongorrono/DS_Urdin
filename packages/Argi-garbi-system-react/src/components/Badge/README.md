# Badge Component

A versatile badge component for displaying status, labels, and notifications.

## Usage

```jsx
import { Badge } from 'components'

// Basic usage
<Badge>Default Badge</Badge>

// With size and tone
<Badge size="l" tone="brand">Brand Badge</Badge>

// With custom className
<Badge className="custom-badge" tone="success">Success</Badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Badge content |
| `size` | `'s' \| 'm' \| 'l'` | `'m'` | Badge size |
| `tone` | `'brand' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'neutral'` | Badge color tone |
| `className` | `string` | `''` | Additional CSS classes |
| `...props` | `HTMLAttributes<HTMLSpanElement>` | - | Additional HTML attributes |

## Size Variants

- **Small (`s`)**: Compact badge for tight spaces
- **Medium (`m`)**: Standard badge size (default)
- **Large (`l`)**: Prominent badge for emphasis

## Tone Variants

- **Brand**: Primary brand color
- **Neutral**: Subtle gray tone
- **Success**: Green for positive states
- **Warning**: Orange for caution states
- **Error**: Red for error states
- **Info**: Blue for informational states

## Examples

### Size Variants
```jsx
<Badge size="s">Small</Badge>
<Badge size="m">Medium</Badge>
<Badge size="l">Large</Badge>
```

### Tone Variants
```jsx
<Badge tone="brand">Brand</Badge>
<Badge tone="neutral">Neutral</Badge>
<Badge tone="success">Success</Badge>
<Badge tone="warning">Warning</Badge>
<Badge tone="error">Error</Badge>
<Badge tone="info">Info</Badge>
```

## Accessibility

- Uses semantic `span` element
- Supports screen readers
- Maintains proper contrast ratios
- Keyboard accessible (when interactive)
