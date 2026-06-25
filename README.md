# Fiançailles de Sarah & Jordan

Application privée de gestion de projet événementiel pour les fiançailles de Sarah & Jordan (25 juillet 2026) : tâches, référents, planning, déroulé, logistique, invités, documents.

## Stack

React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui (style `radix-nova`) + React Router + TanStack Query + React Hook Form + Zod + Framer Motion + Supabase.

## Démarrage

```bash
npm install
npm run dev
```

Tant que `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` ne sont pas renseignées (voir `.env.example`), l'application fonctionne entièrement avec une couche de données mock persistée dans le `localStorage` du navigateur — aucun backend n'est requis pour développer ou faire une démo.

Connexion par code d'accès personnel (pas de mot de passe). Codes de démonstration (voir `src/services/mock/data/people.ts`) :

| Personne | Rôle      | Code        |
| -------- | --------- | ----------- |
| Sarah    | Fiancée   | `SARAH2026` |
| Jordan   | Fiancé    | `JORDAN2026`|
| Camille  | Référente décoration | `DECO2026` |
| Hugo     | Référent boissons    | `BOISSON2026` |
| Nina     | Référente DJ         | `DJ2026` |
| Léa      | Proche    | `LEA2026` |

Pour tester le mode "jour J" sans attendre la vraie date, ajoutez `?simulatePhase=jour-j` à l'URL (valeurs possibles : `prep`, `j-1`, `jour-j`, `j+1`, `post`).

## Brancher Supabase

1. Créer un projet Supabase (ou utiliser un projet existant — voir note ci-dessous).
2. Appliquer les migrations dans `src/supabase/migrations/` (dans l'ordre numéroté), puis les fichiers de `src/supabase/seed/` (également dans l'ordre numéroté — un fichier par module métier, pour pouvoir les coller au fur et à mesure que les données réelles sont disponibles).
3. Copier `.env.example` vers `.env` et renseigner `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Relancer `npm run dev` — l'app bascule automatiquement sur Supabase (voir `src/supabase/client.ts`).

Toutes les tables créées par cette application sont préfixées par `_20260725_` (ex. `_20260725_people`, `_20260725_tasks`) afin de pouvoir cohabiter sans collision dans un projet Supabase partagé avec d'autres tables.

⚠️ L'authentification se fait par code d'accès, pas par Supabase Auth : la RLS appliquée dans `0009_rls_policies.sql` est volontairement permissive (app privée, non indexée). Voir les commentaires de ce fichier pour le détail du compromis et la piste d'évolution.

## Organisation du code

```
src/
  app/        routage et providers globaux
  pages/      une page par route, composent les modules
  layouts/    coquille de l'application (sidebar, bottom nav, garde-fous de rôle)
  components/ ui/ (primitives shadcn) + shared/ + un dossier par module métier
  hooks/      hooks, dont hooks/queries/ (TanStack Query par domaine)
  services/   interface + implémentation mock par domaine, bascule Supabase automatique
  context/    identité (code d'accès) et configuration de l'événement
  types/      types du domaine, permissions, types Supabase
  supabase/   client, migrations SQL, seed
  lib/        utilitaires (dates, liens tel/whatsapp/sms, constantes)
```

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — typecheck + build de production
- `npm run lint` — ESLint
- `npm run preview` — prévisualiser le build de production
