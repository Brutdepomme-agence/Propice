# PROPICE — Outil de souscription

Application web de souscription pour PROPICE, tiers lieu insulaire (SCIC) à Belle-Île-en-Mer. Permet aux futurs sociétaires de souscrire des parts sociales ou titres participatifs, de générer leur bulletin PDF, et aux administrateurs de suivre les engagements.

## Fonctionnalités

- Formulaire en 4 étapes : choix du titre → montant → coordonnées → récapitulatif
- Génération automatique d'un bulletin de souscription PDF (jsPDF)
- Stockage local (localStorage) — aucun serveur requis
- Interface admin protégée par mot de passe (session)
  - Tableau des souscriptions avec changement de statut au clic
  - Export CSV avec BOM UTF-8
  - Téléchargement PDF individuel
  - Barre de progression vers l'objectif de collecte

---

## Installation

```bash
# Cloner ou copier le dossier, puis :
cd propice-souscription
npm install
```

## Configuration

Copier `.env.example` en `.env` et remplir les valeurs :

```bash
cp .env.example .env
```

| Variable              | Description                                        |
|-----------------------|----------------------------------------------------|
| `VITE_IBAN`           | IBAN de PROPICE pour les virements                 |
| `VITE_EMAIL_CONTACT`  | Email de contact affiché sur les bulletins         |
| `VITE_ADMIN_PASSWORD` | Mot de passe de l'interface admin (défaut: changeme) |
| `VITE_NOM_STRUCTURE`  | Nom affiché dans le header (défaut: PROPICE)       |
| `VITE_OBJECTIF_TOTAL` | Objectif de collecte en € (ex: 150000). 0 = masqué |

## Développement local

```bash
npm run dev
# → http://localhost:5173/
# Admin : http://localhost:5173/admin
```

## Build de production

```bash
npm run build
# Les fichiers sont dans ./dist/
```

## Déploiement

### Vercel

```bash
npm install -g vercel
vercel
```

Ajouter les variables d'environnement dans l'interface Vercel (Settings → Environment Variables).

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --build
```

Ou glisser-déposer le dossier `dist/` dans l'interface Netlify. Les variables d'environnement se configurent dans Site settings → Environment variables.

> Note : l'application utilise le routage côté client (React Router). Sur Netlify, créer un fichier `public/_redirects` avec :
> ```
> /* /index.html 200
> ```
> Sur Vercel, le fichier `vercel.json` n'est pas nécessaire — Vite gère le SPA par défaut.

---

## Architecture

```
src/
├── pages/
│   ├── Formulaire.jsx   # Parcours souscription (4 étapes)
│   └── Admin.jsx        # Interface admin protégée
├── components/
│   ├── StepIndicator.jsx
│   ├── TitreCard.jsx
│   ├── MontantSelector.jsx
│   ├── CoordForm.jsx
│   ├── Recapitulatif.jsx
│   └── ConfirmationPage.jsx
└── utils/
    ├── validators.js    # Schémas Zod
    ├── storage.js       # CRUD localStorage + export CSV
    └── generatePDF.js   # Génération bulletin jsPDF
```

## Remarques légales

Les données saisies sont stockées uniquement dans le navigateur de l'utilisateur (localStorage). Aucun serveur ne reçoit ces données. Le bulletin PDF est généré localement. Aucun paiement en ligne n'est effectué via cette application.
