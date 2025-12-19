<div align="center">
  <br />
  <img src="https://www.simplon.ma/images/Simplon_Maghreb_Rouge.png" alt="Simplon Maghreb Logo" width="300"/>
  <br />
  <h1>Documentation Backend API</h1>
  <p><strong>Architecture FastAPI & Base de Données</strong></p>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-FastAPI-black?style=for-the-badge&logo=fastapi&logoColor=white&color=009688" />
    <img src="https://img.shields.io/badge/-Python_3.11-black?style=for-the-badge&logo=python&logoColor=white&color=3776AB" />
    <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logo=postgresql&logoColor=white&color=4169E1" />
    <img src="https://img.shields.io/badge/-SQLAlchemy-black?style=for-the-badge&logo=sqlalchemy&logoColor=white&color=D71F00" />
    <img src="https://img.shields.io/badge/-Pytest-black?style=for-the-badge&logo=pytest&logoColor=white&color=0A9EDC" />
  </div>
</div>

---

## 🔌 1. Architecture de l'API

L'API est structurée en routers modulaires pour assurer la maintenabilité.

### Structure des Dossiers

```

backend/
├── core/          # Config BDD, Sécurité (Hash, JWT)
├── models/        # Modèles SQLAlchemy (Tables)
├── routers/       # Endpoints (Auth, Predict, GenAI)
├── schemas/       # Modèles Pydantic (Validation)
├── tests/         # Tests unitaires (Pytest)
└── main.py        # Point d'entrée

```

---

## 🛡️ 2. Sécurité & Authentification

- **OAuth2 & JWT** : Les endpoints sensibles (`/ml`, `/genai`) sont protégés. L'utilisateur doit fournir un Token Bearer obtenu via `/auth/login`.
- **Hashing** : Les mots de passe sont hashés avec **Bcrypt** avant stockage.
- **CORS** : Configuration stricte pour n'autoriser que le Frontend Next.js.

---

## 📡 3. Endpoints Principaux

| Méthode | Endpoint | Description | Auth Requise |
|---------|----------|-------------|--------------|
| `POST` | `/auth/register` | Création de compte RH | ❌ |
| `POST` | `/auth/login` | Connexion & Récupération Token | ❌ |
| `POST` | `/ml/predict` | Analyse risque employé (ML) | ✅ |
| `GET` | `/ml/history` | Historique des prédictions | ✅ |
| `POST` | `/genai/plan` | Génération plan rétention | ✅ |

---

## 🧪 4. Tests & CI/CD

Le backend dispose d'une suite de tests automatisés via **GitHub Actions**.

- **Tests Auth** : Inscription, Login, Token invalide.
- **Tests ML** : Vérification du chargement modèle, cohérence des probabilités.
- **CI Pipeline** : À chaque push, une base de données temporaire est créée pour valider le code.

```bash
# Lancer les tests localement
docker-compose exec backend pytest -v


fix this one too
```