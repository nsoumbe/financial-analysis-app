@echo off
REM Script de démarrage rapide pour l'application d'analyse financière

echo.
echo ========================================
echo  Analyse Financière - Application
echo ========================================
echo.

REM Vérifier que .env existe
if not exist ".env" (
    echo Création du fichier .env...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Éditez le fichier .env et ajoutez votre clé API Anthropic
    echo    Clé à ajouter: ANTHROPIC_API_KEY=sk-your-api-key
    echo.
    pause
)

REM Démarrer le backend
echo Démarrage du backend...
start cmd /k "cd backend && npm install && npm start"

REM Attendre un peu que le backend démarre
timeout /t 3

REM Démarrer le frontend
echo Démarrage du frontend...
start cmd /k "cd frontend && npm install && npm start"

echo.
echo ========================================
echo  Application en démarrage!
echo
echo  Backend: http://localhost:5000
echo  Frontend: http://localhost:3000
echo ========================================
echo.

pause
