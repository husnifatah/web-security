# Secure React Application

This project is a React application with enhanced security features, including Content Security Policy (CSP).

## Project Structure

- `index.html`: The main entry point for the React application.
- `test-csp.html`: A test file to demonstrate Content Security Policy (CSP) implementation.
- `src/main.tsx`: The main TypeScript file for the React application.

## Security Features

### Content Security Policy (CSP)

CSP headers have been added to `index.html` and `test-csp.html` to mitigate cross-site scripting (XSS) and other code injection attacks. The policies are configured as follows:

- **`index.html`**: 
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';`
  This policy allows scripts and styles only from the same origin. `'unsafe-inline'` is used for styles to allow inline styling, which might be present in some React components or development setups. For production, it's recommended to refine this to use nonces or hashes.

- **`test-csp.html`**: 
  `default-src 'self'; frame-src http://localhost:8787/;`
  This policy allows iframes to be embedded only from `http://localhost:8787/`, demonstrating how to restrict content loaded within iframes.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm (or Yarn/Bun) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd secure-react
   ```
2. Install dependencies:
   ```bash
   bun install
   # or npm install
   # or yarn install
   ```

### Running the Application

To run the development server:

```bash
bun dev
# or npm run dev
# or yarn dev
```

This will start the Vite development server, and you can access the application, usually at `http://localhost:5173/`.

To test the CSP in `test-csp.html`, ensure you have a server running on `http://localhost:8787/` that serves content.

## Building for Production

To build the application for production:

```bash
bun build
# or npm run build
# or yarn build
```

This will generate the production-ready files in the `dist/` directory.

## Linting

To run ESLint checks:

```bash
bun lint
# or npm run lint
# or yarn lint
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

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

export default tseslint.config([
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