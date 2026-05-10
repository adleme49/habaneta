# Habaneta clients

Monorepo for Habaneta's web and mobile clients. The Rust backend (`habaneta-backend`) and the Terraform/IaC project (`habaneta-infra`) live in sibling repos.

## Layout

```
apps/
  web/          # Vite + React tile editor (current production app)
  mobile/       # Expo + React Native pattern-hunter app  (added in v1)
packages/
  api-types/    # Shared TypeScript types for the backend wire contract
```

## Tooling

- **pnpm workspaces** — strict, fast, plays well with Expo/Metro hoisting.
- **TypeScript** everywhere.
- Each workspace member owns its own scripts; the root `package.json` is a thin orchestration layer.

## Common commands

```bash
pnpm install                  # install all workspaces

pnpm dev:web                  # vite dev server for the web app
pnpm dev:mobile               # expo start (mobile)
pnpm build:web                # type-check + vite production build
pnpm build:types              # tsc on the shared api-types package
pnpm test:smoke               # web app's playwright smoke suite
```

## Backend

The image-processing service (`habaneta-backend`) and the cloud infra (`habaneta-infra`) are separate repos. The web and mobile apps reach the backend via `VITE_HABANETA_API` (web) / `expo-constants extra.HABANETA_API` (mobile). See `apps/web/.env.example`.
