# 🚀 Guide de Démarrage Rapide

Lancez l'application d'analyse financière en quelques minutes!

## ⚡ Démarrage en 3 étapes

### 1️⃣ Configurer la clé API

Avant tout, vous avez besoin d'une clé API Anthropic pour Claude.

```bash
# Créer le fichier .env
cp .env.example .env

# Ouvrir .env et ajouter votre clé
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
```

**Comment obtenir votre clé?**
- Aller sur https://console.anthropic.com/
- Créer un compte ou se connecter
- Générer une nouvelle clé API
- Copier la clé dans `.env`

### 2️⃣ Installer les dépendances

#### Sur Windows:
```bash
# Double-cliquez sur start.bat
start.bat
```

#### Sur Mac/Linux:
```bash
chmod +x start.sh
./start.sh
```

#### Ou manuellement:

**Backend (Terminal 1):**
```bash
cd backend
npm install
npm start
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm start
```

**Python (automatique via le backend):**
```bash
cd python-service
pip install -r requirements.txt
```

### 3️⃣ Ouvrir l'application

Une fois démarrée, ouvrez votre navigateur:

```
http://localhost:3000
```

## 📊 Utilisation Rapide

1. **Cliquez** sur "Commencer l'analyse"
2. **Recherchez** la première entreprise (acquéreuse)
   - Exemple: "Apple" → Sélectionnez Apple Inc. (AAPL)
3. **Recherchez** la deuxième entreprise (cible)
   - Exemple: "Microsoft" → Sélectionnez Microsoft (MSFT)
4. **Cliquez** sur "Générer le Rapport d'Analyse"
5. **Attendez** quelques secondes (l'IA analyse)
6. **Téléchargez** le rapport en HTML

## 🏢 Entreprises Incluses

L'application pré-charge ces entreprises:

| Nom | Ticker | Secteur |
|-----|--------|---------|
| Apple | AAPL | Technologie |
| Microsoft | MSFT | Logiciels |
| Alphabet (Google) | GOOGL | Internet |
| Tesla | TSLA | Automobile |
| Amazon | AMZN | E-commerce |

Cherchez simplement la première lettre (ex: "A" pour Apple).

## ❓ Troubleshooting

### "Port 5000 est déjà utilisé"
```bash
# Modifiez le port dans .env
PORT=5001
```

### "Module anthropic not found"
```bash
cd python-service
pip install anthropic==0.28.1
```

### "npm command not found"
- Installer Node.js depuis https://nodejs.org/
- Vérifier l'installation:
```bash
node --version
npm --version
```

### L'application reste chargée
- Vérifiez que votre clé API est correcte dans `.env`
- Vérifiez la connexion internet
- Vérifiez les logs du terminal

## 📚 Pour le Cours

À titre d'exemple, vous pouvez analyser:

- **Acquisition imaginaire 1**: Microsoft acquière Apple
- **Acquisition imaginaire 2**: Amazon acquière Tesla
- **Acquisition imaginaire 3**: Google acquière Microsoft

Chaque rapport montre:
- Les forces et faiblesses comparées
- Les synergies possibles
- Les risques potentiels
- Les projections financières

## 🎯 Prochaines Étapes

Une fois familiarisé:

1. **Ajouter des entreprises** (modifier `companiesDatabase` dans `backend/server.js`)
2. **Personnaliser le rapport** (éditer les prompts dans `python-service/analyzer.py`)
3. **Ajouter une base de données** (remplacer mock data par une vraie DB)
4. **Intégrer des données réelles** (API financière comme Alpha Vantage, Yahoo Finance)

## 💡 Tips Utiles

- **Rapport PDF**: Utilisez l'imprimante du navigateur (Ctrl+P)
- **Recherche rapide**: Tapez juste la première lettre
- **Partager le rapport**: Téléchargez et envoyez le HTML
- **Mode présenation**: Ouvrez le rapport HTML en plein écran

## 📞 Besoin d'aide?

Consultez le fichier `README.md` pour la documentation complète.

---

**Vous êtes prêt! Lancez l'application et commencez votre première analyse!** 🎉
