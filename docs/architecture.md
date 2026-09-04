# Architecture

## Product

Retrod **POS-only** SPA. Authenticated chrome is always `PosShell`. Home after login is `/pos` (SRS Dashboard §1). See [POS_SRS.md](./POS_SRS.md).

## Layers

```
routes/pos* (thin)
  → components/shared/pos/*Manager | panels
    → hooks/queries (when wired)
      → services/{domain}Service
        → utils/httpClient
```

UI reuse: `components/ui` + `Primitives` → `form` → `forms` → `shared/pos`.

## Auth

App-wide auth lives at src level (not under a feature domain):

| Piece | Location |
|---|---|
| Provider | `src/components/providers/AuthProvider.tsx` |
| Hook | `src/hooks/useAuth.ts` |
| RBAC helpers | `src/lib/auth/` |
| Login UI | `src/features/auth/components/` (screen only) |

Do not put auth into `ui/` or per-service Axios. Thin re-exports under `features/auth/{hooks,providers,lib}` remain for compatibility.
