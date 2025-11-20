# React + TypeScript + Vite + shadcn/ui

This project is set up with React, TypeScript, Vite, and shadcn/ui component library.

## Getting Started

Install dependencies:
```bash
npm install
```

### Calendar Booking Setup

Before running the calendar booking feature, you need to set up the Google Calendar service account:

1. **Download Service Account Key**: See [SERVICE_ACCOUNT_SETUP.md](./SERVICE_ACCOUNT_SETUP.md) for detailed instructions
2. **Place the key file**: Save it as `service-account-key.json` in the project root
3. **Share calendar**: Share `nick@gauge.io` calendar with `gauge-io@calendar-integration-478723.iam.gserviceaccount.com`

### Running the Application

**Option 1: Run both frontend and backend together (recommended)**
```bash
npm run dev:all
```
This starts:
- Backend API server on `http://localhost:3001`
- Vite dev server on `http://localhost:5173`

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## shadcn/ui Components

This project uses [shadcn/ui](https://ui.shadcn.com) - a collection of reusable components built with Radix UI and Tailwind CSS.

### Adding Components

To add a new component from shadcn/ui:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
```

### Available Components

Browse all available components at: https://ui.shadcn.com/docs/components

### Using Components

Components are located in `src/components/ui/` and can be imported like:

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

### Project Structure

```
src/
├── components/
│   └── ui/          # shadcn/ui components
├── lib/
│   └── utils.ts     # Utility functions (cn helper)
└── ...
```

## Design System

This project includes a comprehensive dark mode design system. See **[STYLE_GUIDE.md](./STYLE_GUIDE.md)** for complete documentation on:

- Color palette and tokens
- Typography system
- Spacing scale
- Border radius
- Shadows and elevation
- Component guidelines

The design system uses CSS custom properties (CSS variables) for theming and is optimized for dark mode by default.

## Configuration

- **Tailwind CSS**: Configured in `tailwind.config.js`
- **shadcn/ui**: Configured in `components.json`
- **Path Aliases**: `@/` maps to `src/` (configured in `tsconfig.app.json` and `vite.config.ts`)
- **Dark Mode**: Enabled by default (see `index.html` and `src/index.css`)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
