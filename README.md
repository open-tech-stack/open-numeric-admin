# Dashboard Admin — Guide dev

Accès : `/dashboard` (login via `/auth`).

## Guards

- `<RequireAuth>` protège `/dashboard/*`
- `<RequireAdmin>` protège `/dashboard/admins`
- `http.service` → redirect `/auth` sur 401

Rôles : `ADMIN` (tout) · `EDITOR` (contenu uniquement)

## Structure

    app/(dashboard)/dashboard/
    ├── layout.tsx          Sidebar + header
    ├── page.tsx            Stats
    ├── projects/ services/ team/
    ├── clients/ testimonials/ socials/
    ├── navigation/         Arbre + DnD
    ├── contacts/ quotes/
    ├── uploads/ profile/
    └── admins/             ADMIN only

## Pattern CRUD

1. **Service** étend `CrudService<X, XCreateInput, XUpdateInput>`
2. **Hook** `useCrud(xService, { successCreate, ... })`
3. **Page** → `DataTable` + `XFormModal` + `ConfirmDialog`
4. **Composants** dans `components/dashboard/x/`

## Design system

`Button` · `Input` · `Select` · `Toggle` · `Modal` · `Card` · `Badge` ·
`StatusBadge` · `RoleBadge` · `ConfirmDialog` · `DataTable` ·
`EmptyState` · `ProgressBar` · `Toast`

## Traductions

Chaque entité traduite :

    translations: [
      { locale: "fr", title: "...", description: "..." },
      { locale: "en", title: "...", description: "..." },
    ]

5 onglets via `SUPPORTED_LOCALES` (fr, en, de, zh, es).

## Modules spécifiques

- **Dashboard** — `GET /api/stats`
- **Navigation** — arbre + `@dnd-kit` + `PATCH /api/nav/reorder`
- **Contacts** — filtres statut + modal détail + delete (ADMIN)
- **Admins** — CRUD + masque delete sur son propre compte
- **Profile** — nom/email + changement mot de passe (révoque sessions)

## Ajouter un module

1. `types/<entity>.types.ts` + export dans `types/index.ts`
2. `endpoints/<entity>.endpoints.ts`
3. `services/<entity>/<entity>.service.ts`
4. `hooks/use<Entity>.ts`
5. `components/dashboard/<entity>/<Entity>FormModal.tsx`
6. `app/(dashboard)/dashboard/<entity>/page.tsx`
7. Entrée dans la sidebar

## Conventions

- Fichiers composants : `PascalCase.tsx`
- Services/hooks/utils : `camelCase.ts`
- Endpoints : `X_ENDPOINTS`
- Imports : externes → UI → dashboard → services → types → utils
- Erreurs : toujours `ApiError` + toast

## Docs liées

- `README.md` — Frontend
- `README_API.md` — Backend

License : UNLICENSED