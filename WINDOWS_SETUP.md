# 🪟 Guide Complet Windows

Guide détaillé pour faire fonctionner l'application sur Windows.

## 📋 Prérequis

Avant de commencer, assurez-vous que vous avez:

### 1. Node.js et npm
```bash
# Vérifier que Node.js est installé
node --version
npm --version
```

**Si pas installé:**
- Télécharger depuis https://nodejs.org
- Installer la version LTS (Long Term Support)
- Redémarrer votre ordinateur

### 2. Python
```bash
# Vérifier que Python est installé
python --version
```

**Si pas installé:**
- Télécharger depuis https://python.org
- **IMPORTANT**: Cocher "Add Python to PATH" lors de l'installation
- Redémarrer votre ordinateur

### 3. Clé API Anthropic
- Aller sur https://console.anthropic.com
- Créer un compte
- Générer une nouvelle clé API
- Copier la clé (ex: `sk-ant-v0-j8a9b8c...`)

## 🚀 Installation Pas à Pas

### Étape 1: Ouvrir un Terminal PowerShell

1. Appuyez sur `Win + X`
2. Choisissez "Windows PowerShell" ou "Terminal"
3. Allez au dossier du projet:

```powershell
cd "C:\Users\curum\Desktop\Cour Majeur\DevSecOps\DevSecOps_Mission_Impossible\financial-analysis-app"
```

### Étape 2: Créer le fichier .env

```powershell
# Copier le fichier example
copy .env.example .env
```

Maintenant ouvrez `.env` avec un éditeur de texte (Notepad, VSCode, etc.):

```
ANTHROPIC_API_KEY=sk-ant-votre-clé-ici
```

Remplacez `sk-ant-votre-clé-ici` par votre vraie clé API.

### Étape 3: Installer les dépendances Backend

```powershell
cd backend
npm install
```

Cela peut prendre 2-3 minutes. Attendez que ce soit terminé.

### Étape 4: Installer les dépendances Frontend

Dans un nouvel onglet PowerShell:

```powershell
cd "C:\Users\curum\Desktop\Cour Majeur\DevSecOps\DevSecOps_Mission_Impossible\financial-analysis-app\frontend"
npm install
```

### Étape 5: Installer les dépendances Python

Dans un nouvel onglet PowerShell:

```powershell
cd "C:\Users\curum\Desktop\Cour Majeur\DevSecOps\DevSecOps_Mission_Impossible\financial-analysis-app\python-service"
pip install -r requirements.txt
```

## ▶️ Démarrage

Vous devriez maintenant avoir 3 onglets PowerShell ouverts dans ces dossiers:
- `financial-analysis-app\backend`
- `financial-analysis-app\frontend`
- `financial-analysis-app\python-service` (optionnel)

### Option 1: Script Automatique (Recommandé)

Fermez les 3 onglets et double-cliquez simplement sur:

```
start.bat
```

Cela démarrera tout automatiquement.

### Option 2: Démarrage Manuel

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

Attendez le message: `Backend server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

Une fenêtre de navigateur devrait s'ouvrir automatiquement.

## 🌐 Accès à l'Application

Une fois démarrée, l'application est disponible sur:

```
http://localhost:3000
```

Si ça ne s'ouvre pas automatiquement, ouvrez votre navigateur et tapez l'URL.

## 📊 Première Utilisation

1. Cliquez sur **"Commencer l'analyse"**
2. Tapez **"Apple"** dans le premier champ
3. Sélectionnez **"Apple Inc. (AAPL)"**
4. Tapez **"Microsoft"** dans le deuxième champ
5. Sélectionnez **"Microsoft (MSFT)"**
6. Cliquez **"Générer le Rapport d'Analyse"**
7. Attendez 10-20 secondes pour l'analyse
8. Consultez le rapport généré

## 🔧 Troubleshooting Windows

### PowerShell dit "npm command not found"

**Solution:**
- Node.js n'est pas installé ou pas dans le PATH
- Réinstallez Node.js en cochant "Add to PATH"
- Redémarrez PowerShell après installation

### Erreur "ANTHROPIC_API_KEY not found"

**Solution:**
- Ouvrez `.env` et vérifiez que vous avez ajouté votre clé
- Pas d'apostrophes autour de la clé
- Pas d'espaces avant/après le signe `=`

Exemple CORRECT:
```
ANTHROPIC_API_KEY=sk-ant-v0-xxxxx
```

Exemple INCORRECT:
```
ANTHROPIC_API_KEY = "sk-ant-v0-xxxxx"
ANTHROPIC_API_KEY = sk-ant-v0-xxxxx
```

### Port 5000 est déjà utilisé

**Solution:**
1. Ouvrez `.env` et remplacez:
```
PORT=5001
```

2. Redémarrez le backend

### "npm ERR! ERR! code E404"

**Solution:**
- Votre connexion internet est faible ou interruptée
- Réessayez:
```powershell
npm install --no-optional
```

### Application reste sur "Chargement..."

**Solution 1:** Vérifiez que le backend est bien lancé
- Le terminal backend doit dire: `Backend server running on http://localhost:5000`

**Solution 2:** Vérifiez votre clé API
- La clé doit commencer par `sk-ant-`
- Assurez-vous qu'elle est correctement copiée

**Solution 3:** Vérifiez la console
- Appuyez sur F12 pour ouvrir les outils de développement
- Allez à "Console"
- Cherchez les messages d'erreur en rouge
- Regardez aussi l'onglet "Network" pour voir les requêtes

### "Module 'anthropic' not found"

**Solution:**
```powershell
cd python-service
pip install anthropic==0.28.1
```

## 💻 Arrêt de l'Application

1. Allez dans chaque terminal PowerShell
2. Appuyez sur `Ctrl + C`
3. Confirmez avec `y` si demandé

## 📁 À Savoir

- **Les données sont locales**: Tout se fait sur votre ordinateur
- **Pas de sauvegarde**: Les rapports générés ne sont sauvegardés que SI vous les téléchargez
- **Port utilisé**: L'app utilise les ports 5000 (backend) et 3000 (frontend)

## 🎓 Pour Votre Cours

Cette application montre:
- ✅ Intégration d'APIs (frontend → backend)
- ✅ Communication client-serveur
- ✅ Utilisation d'IA dans une application web
- ✅ Analyse financière comparée
- ✅ Architecture full-stack moderne

## 📞 Besoin D'Aide?

Consultez:
1. `QUICKSTART.md` - Guide rapide
2. `README.md` - Documentation complète
3. `PROJECT_STRUCTURE.md` - Architecture du projet

---

**C'est terminé! Vous êtes prêt à utiliser l'application! 🎉**
