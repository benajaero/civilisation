# Civilisation

A static-first public library project with an austere, archival, editorial, and minimalist visual direction.

## Project Structure

```
civilisation/
├── apps/
│   └── web/              # Next.js web application
├── packages/
│   └── brand/            # Shared brand components and styles
└── docs/                 # Governance and policies
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Packages

### @civilisation/brand
Shared brand package containing canonical components and styling. Located in `packages/brand`.

### @civilisation/web
Next.js web application. Located in `apps/web`.

## Tech Stack

- **Framework**: Next.js
- **Styling**: CSS Modules + Brand package
- **Package Manager**: pnpm
- **Language**: TypeScript

## Development

Run the web app:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## License

TBD