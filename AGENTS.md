# AGENTS.md

## Purpose
Keep humans and AI agents aligned on structure and reuse. Prefer existing patterns over new abstractions.

## Product scope
**Retrod POS only.** Authenticated app lives under `/pos` (dashboard = SRS §1). Login at `/login`. Do not reintroduce hotel PMS / Retrod One modules unless explicitly requested.

## Stack
Vite · React · TypeScript · TanStack Router · TanStack Query · Axios (`utils/httpClient`) · Tailwind

## Where code goes

| Task | Location |
|---|---|
| New URL | `src/routes/pos*.tsx` (thin) + Manager in `src/components/shared/pos/` |
| Screen / grid / workflow | `components/shared/pos/*Manager.tsx` or reusable panels |
| Entity form | `components/forms/` |
| Design-system control | `components/ui/` (+ `Primitives`) |
| Reusable field control | `components/form/` |
| API calls | `services/{domain}Service.ts` via `httpClient` |
| Wire DTOs | `types/{domain}Api.ts` |
| UI models | `types/{domain}.ts` |
| Query/mutation hooks | `hooks/queries/` |
| Auth provider | `components/providers/AuthProvider.tsx` |
| Auth hook | `hooks/useAuth.ts` |
| RBAC helpers | `lib/auth/` |
| Login screen | `features/auth/components/` |
| Env / BASEURL | `config/variables.ts` |
| SRS map | `docs/POS_SRS.md` |

## Hard rules
1. Routes stay thin — no axios, no large JSX screens.
2. Components never call `httpClient` directly — use services via query hooks.
3. One HTTP client only (`utils/httpClient.ts`).
4. Map Backend → UI in services.
5. `ui/` and `form/` stay domain-agnostic.
6. Reuse `PosPanel`, `PosStatTile`, `PosOrdersListManager`, `PosModuleHubManager` before inventing new shells.
7. Auth is app-wide at `hooks` / `providers` / `lib/auth` — not in `ui/` or per-service Axios. Login UI may stay under `features/auth/components`.
8. Scope changes — don’t reintroduce deleted PMS folders.

## Add a POS screen (checklist)
1. Thin `routes/pos.*.tsx`
2. Manager or panel under `components/shared/pos/`
3. Nav entry in `app/navigation/pos-nav-config.ts`
4. Update `docs/POS_SRS.md` if it is a new SRS section
