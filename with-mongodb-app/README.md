# 🎬 Next.js MongoDB Movie API

Un projet **Next.js App Router** avec une API REST connectée à **MongoDB**, permettant de gérer et consulter des films, commentaires et cinémas. Déployé automatiquement sur **Vercel**.

---

## 🚀 Technologies utilisées

- [Next.js 13+](https://nextjs.org/docs) (App Router)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [TypeScript](https://www.typescriptlang.org/)
- [Vercel](https://vercel.com/) (déploiement)
- [Swagger](https://swagger.io/) pour la documentation API

---

## 📁 Structure du projet

```
/app/api/movies/               → Routes REST pour les films
  ├── [idMovie]/route.ts       → GET / PUT / DELETE par ID
  └── route.ts                 → GET (liste des films)

              /comments/       
  ├── [idComment]/route.ts     → GET / PUT / DELETE par ID
  └── route.ts                 → GET (liste des commentaires)

              /theaters/
  ├── [idTheater]/route.ts     → GET / PUT / DELETE par ID
  └── route.ts                 → GET (liste des cinémas)

/lib/mongodb.ts                → Connexion MongoDB réutilisable
/public/swagger.json           → Documentation Swagger (si générée)
```

---

## 🧪 Exemples d'appels API

### ✅ Get un film par ID

```http
GET /api/movies/573a1390f29313caabcd4135
```

### ✅ Get un commentaire par ID

```http
GET /api/movies/comments/5a9427648b0beebeb6957a88
```

### ✅ Get un cinéma par ID

```http
GET /api/movies/theaters/59a47286cfa9a3a73e51e72d
```

---

## 📦 Installation

```bash
git clone https://github.com/ton-user/ton-projet.git
cd ton-projet
npm install
```

---

## ⚙️ Configuration environnement

Créer un fichier `.env.local` à la racine :

```ini
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

---

## 🧑‍💻 Lancer en local

```bash
npm run dev
```

---

## 📄 Swagger (documentation API)

Installer la dépendance :

```bash
npm install swagger-ui-react
```

Tu peux ensuite créer une page `/docs` avec ce composant :

```tsx
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function Docs() {
  return <SwaggerUI url="/swagger.json" />
}
```

---

## 🌐 Déploiement Vercel

Le projet est compatible avec Vercel :

- `next build` est automatiquement détecté
- Aucune configuration spéciale requise
- **Ne pas utiliser `next export`**

🛑 **Important** : ne pas utiliser `next export`, cela désactive les routes API dynamiques.

---

## 📌 Remarques

- Les routes dynamiques (`[idMovie]`, `[idComment]`, `[idTheater]`) sont correctement typées avec `context.params`
- Le projet utilise un `clientPromise` MongoDB pour éviter les connexions multiples
- Documentation Swagger en JSON disponible dans `/public/swagger.json`