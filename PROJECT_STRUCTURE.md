financial-analysis-app/
│
├── 📄 README.md                    # Documentation complète
├── 📄 QUICKSTART.md                # Guide de démarrage rapide
├── 📄 .env.example                 # Configuration d'exemple
├── 📄 .gitignore                   # Fichiers à ignorer Git
│
├── 🚀 start.bat                    # Démarrage rapide (Windows)
├── 🚀 start.sh                     # Démarrage rapide (Linux/Mac)
│
├── 📁 backend/                     # ⚙️ API Node.js/Express
│   ├── server.js                   # Serveur principal
│   ├── package.json                # Dépendances Node
│   └── [Endpoints API]
│       ├── GET /api/health         # Vérification santé
│       ├── GET /api/companies/search?q=... # Recherche entreprises
│       ├── GET /api/companies/:id  # Détails entreprise
│       └── POST /api/analysis/generate # Générer rapport
│
├── 📁 frontend/                    # 🖥️ Interface React
│   ├── public/
│   │   └── index.html              # Page HTML principale
│   │
│   ├── src/
│   │   ├── App.js                  # Composant principal
│   │   ├── App.css                 # Styles globaux
│   │   ├── index.js                # Point d'entrée React
│   │   │
│   │   ├── 📁 pages/
│   │   │   └── Home.js             # Page d'accueil
│   │   │   └── Home.css
│   │   │
│   │   └── 📁 components/
│   │       ├── CompanySearch.js    # Recherche + sélection
│   │       ├── CompanySearch.css
│   │       ├── Report.js           # Affichage rapport
│   │       └── Report.css
│   │
│   └── package.json                # Dépendances React
│
└── 📁 python-service/              # 🤖 Service Claude AI
    ├── analyzer.py                 # Script d'analyse
    ├── requirements.txt            # Dépendances Python
    └── [Processus]
        ├── Reçoit données financières
        ├── Génère prompt Claude
        ├── Appelle API Anthropic
        └── Retourne rapport JSON

═══════════════════════════════════════════════════════════════

🔄 FLUX DE L'APPLICATION:

1. L'utilisateur ouvre http://localhost:3000
2. ✏️  Tape le nom de deux entreprises
3. 🔍 Autocomplete recherche dans API backend
4. ✅ Sélectionne Acquéreuse + Cible
5. 🔘 Clique "Générer Rapport"
6. 📡 Frontend envoie requête au backend
7. 🐍 Backend appelle le service Python
8. 🤖 Python utilise Claude API pour l'analyse
9. 📊 Python retourne JSON structuré
10. 💾 Frontend reçoit et affiche le rapport
11. ⬇️  Utilisateur télécharge en HTML

═══════════════════════════════════════════════════════════════

📊 DONNÉES FINANCIÈRES PAR ENTREPRISE:

Chaque entreprise contient:
✓ nom
✓ ticker (symbole bourse)
✓ revenue (revenu annuel)
✓ netIncome (bénéfice net)
✓ totalAssets (actifs totaux)
✓ totalLiabilities (passifs totaux)
✓ employees (nombre d'employés)
✓ marketCap (capitalisation boursière)
✓ recentGrowth (croissance récente %)
✓ rnd (dépenses R&D)

Métriques calculées:
- Profit Margin = NetIncome / Revenue × 100
- ROA = NetIncome / TotalAssets × 100
- ROE = NetIncome / Equity × 100
- Debt Ratio = TotalLiabilities / TotalAssets × 100
- Asset Turnover = Revenue / TotalAssets

═══════════════════════════════════════════════════════════════

🎨 INTERFACE UTILISATEUR:

Écran 1: Accueil
  └─ 4 fonctionnalités clés
  └─ Bouton "Commencer"

Écran 2: Recherche
  ├─ Zone de recherche Acquéreuse
  │  └─ Suggestions en temps réel
  ├─ Zone de recherche Cible
  │  └─ Suggestions en temps réel
  └─ Bouton "Générer Rapport"

Écran 3: Rapport
  ├─ Titre + Actions (Télécharger, Retour)
  ├─ Résumé Exécutif
  ├─ Comparaison Financière
  │  ├─ Données Acquéreuse
  │  └─ Données Cible
  ├─ Analyse (Forces, Risques)
  ├─ Analyse Financière (Synergies, ROI)
  ├─ Recommandation
  └─ Conclusion

═══════════════════════════════════════════════════════════════

⚙️ CONFIGURATION:

.env (à créer):
  PORT=5000
  NODE_ENV=development
  PYTHON_PATH=python
  ANTHROPIC_API_KEY=sk-ant-xxxxx

═══════════════════════════════════════════════════════════════
