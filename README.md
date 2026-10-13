### 1️⃣ Installation

```bash
npm install
```

### 2️⃣ Variables d'environnement

Crée un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> ⚠️ L'API backend doit tourner en parallèle → voir [README_API.md](./README_API.md)

### 3️⃣ Lancer le serveur

```bash
npm run dev
```

<div align="center">

🌐 **http://localhost:3000**

</div>

---

## 📁 Structure du projet

```txt
src/
├── 📂 app/
│   ├── 🌍 (site)/              # Site vitrine public
│   ├── 🔑 (auth)/auth/         # Login admin
│   └── 🛡️ (dashboard)/         # Dashboard admin
│
├── 📂 components/
│   ├── 🎨 ui/                  # Design system
│   ├── 📊 dashboard/           # Composants dashboard
│   └── 🔒 auth/                # Guards
│
├── 📂 contexts/
│   └── 🔐 AuthContext.tsx
│
├── 📂 hooks/
│   ├── useAuth.ts
│   ├── useCrud.ts
│   ├── useStats.ts
│   └── useNav.ts
│
├── 📂 services/
│   ├── ⚙️ core/                # HTTP + CRUD générique
│   └── 🔌 */                   # Par module
│
├── 📂 endpoints/               # Chemins API centralisés
├── 📂 types/                   # Types TS partagés
└── 📂 lib/                     # Utils
```

---

## 🔐 Authentification

<div align="center">

| 🍪 Cookie          | 🔒 HttpOnly | 📁 Path     | ⏱️ Durée  |
| ------------------ | :---------: | ----------- | --------- |
| `on.accessToken`   |     ✅      | `/`         | 15 min    |
| `on.refreshToken`  |     ✅      | `/api/auth` | 7 jours   |
| `on.user`          |     ❌      | `/`         | 7 jours   |

</div>

### 🔄 Flux

```txt
1️⃣  POST /api/auth/login       →  🍪 cookies posés
2️⃣  GET  /api/auth/me          →  👤 profil chargé
3️⃣  RequireAuth vérifie        →  🚫 sinon redirect /auth
4️⃣  http.service gère 401      →  ↩️ redirect auto
5️⃣  POST /api/auth/logout      →  🧹 clear cookies
```

---

## 🧭 Pages du dashboard

<div align="center">

| 🖥️ Page                      | 📝 Rôle                 | 🔐 Accès  |
| ---------------------------- | ----------------------- | --------- |
| 🏠 `/dashboard`              | Vue d'ensemble (stats)  | 🔵 Auth   |
| 📦 `/dashboard/projects`     | Projets                 | 🔵 Auth   |
| 🧰 `/dashboard/services`     | Services                | 🔵 Auth   |
| 👥 `/dashboard/team`         | Équipe                  | 🔵 Auth   |
| 🏢 `/dashboard/clients`      | Clients                 | 🔵 Auth   |
| 💬 `/dashboard/testimonials` | Témoignages             | 🔵 Auth   |
| 🔗 `/dashboard/socials`      | Réseaux                 | 🔵 Auth   |
| 🧭 `/dashboard/navigation`   | Menus (DnD)             | 🔵 Auth   |
| 📬 `/dashboard/contacts`     | Messages                | 🔵 Auth   |
| 📄 `/dashboard/quotes`       | Devis                   | 🔵 Auth   |
| 🖼️ `/dashboard/uploads`      | Médias                  | 🔵 Auth   |
| 👤 `/dashboard/profile`      | Mon profil              | 🔵 Auth   |
| 🛡️ `/dashboard/admins`       | Admins                  | 🔴 ADMIN  |

</div>

---

## 🧩 Pattern CRUD

Chaque entité suit le même pattern en 3 étapes :

### 1️⃣ Service

```ts
class XService extends CrudService<X, XCreateInput, XUpdateInput> {}
export const xService = new XService();
```

### 2️⃣ Hook

```ts
const { items, loading, create, update, remove } = useCrud(xService);
```

### 3️⃣ Page

```tsx
<DataTable data={items} columns={columns} config={{ actions }} />
<XFormModal open={...} onSubmit={...} />
<ConfirmDialog open={...} onConfirm={...} />
```

---

## 📦 Scripts

```bash
npm run dev        # 🚀 Développement
npm run build      # 📦 Build production
npm run start      # ▶️  Production
npm run lint       # 🔍 ESLint
npm run typecheck  # 🟦 tsc --noEmit
```

---

## 🚀 Déploiement

<div align="center">

| 🌐 Cible | 🛠️ Plateforme                         |
| -------- | ------------------------------------- |
| Frontend | ▲ Vercel                              |
| API      | 🚂 Railway · 🪰 Fly.io · 🖥️ VPS       |
| Images   | ☁️ Cloudflare R2 · 🖼️ Cloudinary      |

</div>

---

## 📚 Documentation liée

<div align="center">

| 📄 Fichier                          | 📝 Contenu                      |
| ----------------------------------- | ------------------------------- |
| [README_API.md](./README_API.md)     | Backend NestJS + Prisma         |
| [README_ADMIN.md](./README_ADMIN.md) | Guide développeur dashboard     |

</div>

---

<div align="center">

## 📄 License

**UNLICENSED** — Projet privé Open Numeric.

Fait avec ❤️ par **Open Numeric**

</div>