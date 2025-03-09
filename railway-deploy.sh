#!/bin/bash
# Script pour préparer le déploiement Railway

# Vérifier que Git est installé
if ! command -v git &> /dev/null; then
    echo "Git n'est pas installé. Veuillez l'installer pour continuer."
    exit 1
fi

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "Node.js n'est pas installé. Veuillez l'installer pour continuer."
    exit 1
fi

# Créer un dossier temporaire pour le déploiement
TEMP_DIR="railway-deploy"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

echo "Préparation du déploiement Railway..."

# Copier les fichiers du backend
echo "Copie des fichiers backend..."
cp -r backend-ts/* $TEMP_DIR/
cp -r backend-ts/.env* $TEMP_DIR/ 2>/dev/null || :

# Créer le dossier pour le frontend build
mkdir -p $TEMP_DIR/frontend

# Construire le frontend
echo "Construction du frontend..."
cd frontend
npm install
npm run build
cd ..

# Copier le build du frontend
echo "Copie des fichiers frontend..."
cp -r frontend/build/* $TEMP_DIR/frontend/

# Créer un repo git pour le déploiement
echo "Initialisation du repository git..."
cd $TEMP_DIR
git init
git add .
git commit -m "Initial deploy to Railway"

echo ""
echo "===================================================="
echo "Préparation terminée !"
echo "===================================================="
echo ""
echo "Pour déployer sur Railway :"
echo "1. Créez un nouveau projet sur Railway"
echo "2. Exécutez les commandes suivantes :"
echo ""
echo "   cd $TEMP_DIR"
echo "   railway link"
echo "   railway up"
echo ""
echo "3. N'oubliez pas de configurer les variables d'environnement :"
echo "   - RAPID_API_KEY : votre clé API Streaming Availability"
echo "   - NODE_ENV : production"
echo ""
echo "Bonne chance !" 