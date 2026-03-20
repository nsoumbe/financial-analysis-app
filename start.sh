#!/bin/bash

echo ""
echo "========================================"
echo "  Analyse Financière - Application"
echo "========================================"
echo ""

# Vérifier que .env existe
if [ ! -f ".env" ]; then
    echo "Création du fichier .env..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Éditez le fichier .env et ajoutez votre clé API Anthropic"
    echo "   Clé à ajouter: ANTHROPIC_API_KEY=sk-your-api-key"
    echo ""
    read -p "Appuyez sur Entrée pour continuer..."
fi

# Démarrer le backend en arrière-plan
echo "Démarrage du backend..."
cd backend
npm install
npm start &
BACKEND_PID=$!

# Attendre un peu que le backend démarre
sleep 3

# Démarrer le frontend
echo "Démarrage du frontend..."
cd ../frontend
npm install
npm start

# Cleanup
kill $BACKEND_PID

echo ""
echo "========================================"
echo "  Application arrêtée"
echo "========================================"
echo ""
