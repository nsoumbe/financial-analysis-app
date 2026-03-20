# 💼 Application d'Analyse Financière - Fusion & Acquisition

Une application web locale pour analyser les fusions et acquisitions entre deux entreprises using Claude AI.

## 📋 Fonctionnalités

- **Recherche d'entreprises** avec autocomplete basée sur les noms et tickers
- **Analyse financière comparative** utilisant Claude AI
- **Rapport HTML interactif** avec visualisation des données
- **Téléchargement de rapport** en format HTML

## 🏗️ Architecture

```
financial-analysis-app/
├── backend/              # Node.js/Express API
│   ├── server.js        # Serveur principal
│   └── package.json     # Dépendances Node
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── pages/       # Pages principales
│   │   └── App.js       # Composant principal
│   └── public/          # Assets statiques
│
├── python-service/      # Service d'analyse Claude
│   ├── analyzer.py      # Script d'analyse IA
│   └── requirements.txt # Dépendances Python
│
└── .env.example        # Configuration d'exemple
```

## 📦 Stack Technique

- **Frontend**: React 18, CSS3 moderne
- **Backend**: Node.js, Express.js
- **AI/Analysis**: Python, Gemini API
- **Base de données**: Mock in-memory (extensible)

## 🚀 Installation et Démarrage

### Prérequis

- Node.js (v14+)
- Python (v3.8+)
- Clé API Gemini (Google)
- npm ou yarn

### 1. Cloner et configurer

```bash
cd financial-analysis-app
cp .env.example .env
```

Éditez `.env` et ajoutez votre clé API :
```
ANTHROPIC_API_KEY=sk-your-api-key
```

### 2. Installer les dépendances

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**Python Service:**
```bash
cd python-service
pip install -r requirements.txt
```

### 3. Démarrer l'application

**Terminer 1 - Backend:**
```bash
cd backend
npm start
```
Serveur disponible sur `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Application ouverte sur `http://localhost:3000`

## 📊 Utilisation

1. **Accueil**: Cliquez sur "Commencer l'analyse"
2. **Sélection**: Cherchez et sélectionnez deux entreprises
   - Acquéreuse (celle qui achète)
   - Cible (celle à acquérir)
3. **Génération**: Cliquez sur "Générer le Rapport d'Analyse"
4. **Résultats**: Consultez le rapport interactif avec:
   - Comparaison financière
   - Points forts et risques
   - Recommandations
5. **Export**: Téléchargez le rapport en HTML

## 🏢 Entreprises Disponibles

L'application inclut les données de ces entreprises (extensible):

- **Apple (AAPL)** - Technologie
- **Microsoft (MSFT)** - Logiciels
- **Google (GOOGL)** - Internet
- **Tesla (TSLA)** - Automobile/Énergie
- **Amazon (AMZN)** - E-commerce

Pour ajouter des entreprises, modifiez `companiesDatabase` dans `backend/server.js`.

## 🤖 Intégration Claude AI

Le service Python (`python-service/analyzer.py`):
1. Reçoit les données financières des deux entreprises
2. Génère un prompt détaillé
3. Appelle l'API Claude Anthropic
4. Retourne un JSON structuré avec l'analyse

## 🎯 Métriques Financières Analysées

- **Marge Bénéficiaire**: Profit Net / Revenue
- **ROA**: Retour sur Actifs
- **ROE**: Retour sur Capitaux Propres
- **Ratio de Dette**: Passifs / Actifs
- **Rotation d'Actifs**: Revenue / Actifs

## 📝 Structure du Rapport

Chaque rapport contient:

- **Résumé Exécutif**: Vue d'ensemble
- **Comparaison**: Données financières côte à côte
- **Analyse**: Forces, faiblesses, risques
- **Projection**: ROI et synergies
- **Recommandation**: Avis d'acquisition

## 🔐 Notes de Sécurité

- Ne commitez pas votre `.env` avec la clé API réelle
- L'application est conçue pour un usage local/éducatif
- Pour la production, implémentez:
  - Authentification utilisateur
  - Rate limiting
  - Validation d'entrée robuste
  - Base de données réelle

## 📚 Pour Votre Cours

Cette application démontre:
- L'analyse financière comparée
- Les métriques clés d'évaluation
- Les synergies de fusion
- L'intégration IA dans les processus métier

## 🛠️ Troubleshooting

**Important: Installer les dépendances**
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# Python
cd python-service && pip install -r requirements.txt
```

**Erreur de port (5000 occupé)**
```bash
# Modifier dans backend/.env
PORT=5001
```

**Erreur Python/ANTHROPIC_API_KEY**
- Vérifier que `.env` existe et contient votre clé
- Redémarrer le backend après modification de `.env`

## � Exécution avec Docker

1. Créez un fichier `.env` à la racine avec votre clé API Claude :

```bash
ANTHROPIC_API_KEY=sk-your-api-key
```

2. Construisez et démarrez avec Docker Compose :

```bash
docker compose up --build
```

3. Ouvrez l’app :
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/health`

4. Arrêtez :

```bash
docker compose down
```

## �📄 Licence

Pour un usage éducatif et de cours.

---

**Créée avec ❤️ pour votre cours de Gestion Financière**
