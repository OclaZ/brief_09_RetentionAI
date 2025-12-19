<div align="center">
  <br />
  <img src="https://www.simplon.ma/images/Simplon_Maghreb_Rouge.png" alt="Simplon Maghreb Logo" width="300"/>
  <br />
  <h1>Documentation Frontend</h1>
  <p><strong>Dashboard RH & Expérience Utilisateur</strong></p>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white&color=000000" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logo=typescript&logoColor=white&color=3178C6" />
    <img src="https://img.shields.io/badge/-TailwindCSS-black?style=for-the-badge&logo=tailwindcss&logoColor=white&color=06B6D4" />
    <img src="https://img.shields.io/badge/-Axios-black?style=for-the-badge&logo=axios&logoColor=white&color=5A29E4" />
    <img src="https://img.shields.io/badge/-Lucide_Icons-black?style=for-the-badge&logo=lucide&logoColor=white&color=F56565" />
  </div>
</div>

---

## 🖥️ 1. Interface Utilisateur (UI)

Le design suit une approche **"SaaS Premium"** avec un style **Glassmorphism**.

### Charte Graphique
- **Background** : Dégradé sombre profond (`#0a0a0a`) avec effet "Aurora" subtil.
- **Cartes** : Transparence (`backdrop-blur-xl`), bordures fines blanches.
- **Accents** : 
  - 🟢 **Vert** (Safe/Stable) : Employé à faible risque.
  - 🟣 **Violet** (AI/Risk) : Employé à risque / Actions IA.

### Composants Réutilisables
Nous utilisons une architecture de composants atomiques dans `components/ui/` :
- `<Input />` : Champs de formulaire stylisés.
- `<Button />` : Boutons avec états de chargement (spinners).
- `<Card />` : Conteneurs effet verre.

---

## 🧭 2. Parcours Utilisateur (UX)

1. **Auth Guard** : Redirection automatique vers `/login` si aucun token n'est détecté.
2. **Dashboard** :
   - **Formulaire RH** : Saisie des données employés (30 champs).
   - **Switchers** : Boutons Oui/Non ergonomiques.
   - **Score en Temps Réel** : Jauge de risque animée.
3. **Smart Feedback** :
   - Si risque > 50%, le plan d'action Gemini s'affiche automatiquement avec une animation `slide-in`.
4. **Historique** : Tableau des dernières analyses accessible en bas de page.

---

## 🛠️ 3. Stack Technique

### Next.js App Router
Nous utilisons la dernière version de Next.js avec le dossier `app/`.
- `app/layout.tsx` : Configuration globale (Polices, CSS).
- `app/dashboard/page.tsx` : Logique métier (State, Effets).

### Gestion d'État & API
- **React Hooks** (`useState`, `useEffect`) pour gérer les données formulaire.
- **Axios** pour les requêtes HTTP asynchrones vers FastAPI.
- **LocalStorage** pour la persistance du Token JWT.

### Docker Optimisé
Le Frontend utilise une image **Node 20 Alpine** multi-stage build pour réduire la taille finale du conteneur et accélérer le déploiement.