# Application d'Analyse Financiere - Fusion & Acquisition

Application web d'analyse financiere assistee par IA permettant de comparer deux entreprises cotees et de generer automatiquement un rapport de fusion-acquisition.

Le projet utilise actuellement Gemini par defaut, avec un support optionnel d'Anthropic si besoin.

## Description Du Projet

Ce projet a pour objectif de montrer comment une application metier peut etre enrichie par l'intelligence artificielle.

L'application permet a un utilisateur de :

- rechercher des entreprises cotees
- comparer leurs informations financieres lorsqu'elles sont disponibles
- generer un rapport structure de fusion-acquisition
- exporter ce rapport en PDF

L'IA est utilisee comme une couche d'interpretation. Elle ne remplace pas la donnee brute, mais aide a transformer des chiffres et des informations de marche en une synthese lisible, argumentee et exploitable.

## Fonctionnalites

- recherche d'entreprises cotees
- support des societes americaines via SEC
- support des societes Euronext Paris et autres marches Euronext pour la recherche
- analyse financiere comparee assistee par IA
- rapport detaille genere automatiquement
- telechargement du rapport en PDF
- execution locale ou via Docker

## Architecture

```text
financial-analysis-app/
|- backend/           # API Node.js / Express
|- frontend/          # application React
|- python-service/    # orchestration IA et generation du rapport
|- Dockerfile         # image Docker unique
|- docker-compose.yml # lancement simplifie
```

## Stack Technique

- Frontend : React 18
- Backend : Node.js, Express
- Service IA : Python
- IA : Google Gemini par defaut, Anthropic en option
- Donnees boursieres :
  - SEC pour les societes americaines
  - Euronext pour la recherche des societes cotees europeennes
- Export : PDF
- Conteneurisation : Docker

## Pourquoi l'IA est utile ici

L'IA ne sert pas seulement a afficher du texte. Elle permet de transformer des donnees financieres en une synthese exploitable :

- mise en contexte des chiffres
- identification des forces et faiblesses
- mise en avant des risques
- formulation d'une recommandation lisible

L'objectif est donc de passer d'une simple consultation de donnees boursieres a une aide a la decision.

## Description Courte Pour GitHub

Application web d'analyse de fusion-acquisition assistee par IA, combinant React, Node.js, Python, sources de donnees boursieres et export PDF.  
Le projet illustre l'integration d'une API d'IA dans un cas d'usage metier concret, avec conteneurisation Docker pour faciliter le partage et l'execution.

## Configuration

Copiez `.env.example` en `.env`, puis renseignez votre cle API.

Exemple avec Gemini :

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Option Anthropic :

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

## Lancement Local

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

### Python

```bash
cd python-service
pip install -r requirements.txt
```

## Lancement Docker

Le projet peut etre lance avec une image Docker unique.

### Build

```bash
docker build -t financial-analysis-app:latest .
```

### Run

```bash
docker run --rm -p 5000:5000 --env-file .env financial-analysis-app:latest
```

Puis ouvrez :

```text
http://localhost:5000
```

### Avec Docker Compose

```bash
docker compose up --build
```

## Partage De L'Image Docker

Pour envoyer l'image a quelqu'un :

```bash
docker save -o financial-analysis-app.tar financial-analysis-app:latest
```

Sur le PC de destination :

```bash
docker load -i financial-analysis-app.tar
docker run --rm -p 5000:5000 --env-file .env financial-analysis-app:latest
```

## Sources De Donnees

- SEC : donnees et societes cotees americaines
- Euronext : recherche de societes cotees europeennes

Note importante :
- les societes US ont generalement plus de fondamentaux disponibles via SEC
- les societes Euronext peuvent avoir des donnees plus limitees dans l'etat actuel du projet

## Comment Les Donnees Entreprises Sont Recuperees

Le projet utilise deux circuits de donnees differents selon le marche boursier.

### 1. Entreprises Americaines

Pour les entreprises americaines, les donnees proviennent de la SEC.

Sources utilisees :

- annuaire des societes cotees : `company_tickers_exchange.json`
- donnees financieres detaillees : API `companyfacts`
- metadonnees societes : API `submissions`

Concretement :

- le backend recherche l'entreprise dans l'annuaire SEC
- recupere son identifiant `CIK`
- appelle les endpoints SEC pour extraire des donnees comme :
  - chiffre d'affaires
  - benefice net
  - actifs
  - passifs
  - depenses de R&D
  - parfois le nombre d'employes
- ces donnees sont ensuite normalisees avant d'etre envoyees au service IA

### 2. Entreprises Francaises Et Euronext

Pour les entreprises francaises et plus largement les entreprises cotees sur Euronext, le projet utilise le repertoire officiel Euronext.

Source utilisee :

- export actions Euronext : `https://live.euronext.com/pd_es/data/stocks/download?mics=dm_all_stock`

Concretement :

- le backend telecharge le CSV officiel Euronext
- parse les lignes cote serveur
- indexe les entreprises notamment par `ISIN`
- utilise ces donnees pour :
  - la recherche d'entreprises
  - la place de cotation
  - certaines donnees de marche comme prix, volume ou turnover

### Limite Actuelle

- pour les entreprises US, on dispose de fondamentaux financiers plus riches via SEC
- pour les entreprises Euronext, la recherche est bonne, mais les donnees financieres detaillees peuvent etre plus limitees selon la source disponible

En pratique :

- SEC sert surtout aux fondamentaux financiers americains
- Euronext sert a l'univers des entreprises cotees europeennes et a la recherche
- Gemini genere ensuite l'analyse a partir des donnees collectees par le backend

## Securite

- `.env` est ignore par Git
- ne commitez jamais de cle API reelle
- utilisez `.env.example` comme modele

## Competences Mises En Evidence

Ce projet montre des competences en :

- integration d'API IA
- orchestration frontend / backend / service Python
- traitement et normalisation de donnees externes
- generation de rapports PDF
- conteneurisation Docker
- gestion des variables d'environnement
- preparation d'une application portable pour demonstration et test

## Etat Actuel

- Gemini est le fournisseur IA principal utilise dans le projet
- Anthropic reste supporte au niveau du code, mais n'est pas le mode par defaut
- une image Docker locale unique a ete construite

## Licence

Projet a vocation pedagogique et demonstrative.
