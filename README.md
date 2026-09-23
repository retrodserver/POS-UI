# Retrod POS

Restaurant point-of-sale SPA (Vite · React 19 · TypeScript · TanStack Router/Query).

**Agents / contributors:** read [AGENTS.md](./AGENTS.md). Product map: [docs/POS_SRS.md](./docs/POS_SRS.md). Layers: [docs/architecture.md](./docs/architecture.md).

## Scripts

| Command         | Description          |
| --------------- | -------------------- |
| `npm install`   | Install dependencies |
| `npm run dev`   | Dev server           |
| `npm run build` | Production build     |
| `npm run lint`  | ESLint               |
| `npm test`      | Vitest               |

## Environment

```bash
VITE_API_BASE_URL=/api/
```

## App entry

- `/login` — auth (isolated under `features/auth`)
- `/` → redirects to `/pos`
- `/pos` — **Dashboard** (SRS §1) — default after login
- `/pos/orders`, `/pos/menu`, `/pos/kot`, `/pos/inventory`, … — module screens

## Reuse

Dashboard panels (`PosSalesStatsPanel`, `PosLeakagePanel`, …) and shells (`PosPanel`, `PosStatTile`, `PosOrdersListManager`, `PosModuleHubManager`) live in `components/shared/pos/`. Prefer composing these over new one-off layouts.
