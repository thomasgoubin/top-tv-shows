#!/bin/bash
# Script pour préparer un déploiement optimisé pour Railway

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "Node.js n'est pas installé. Veuillez l'installer pour continuer."
    exit 1
fi

echo "==== PRÉPARATION DU DÉPLOIEMENT RAILWAY OPTIMISÉ ===="

# Créer un dossier temporaire pour le déploiement
DEPLOY_DIR="railway-optimized-deploy"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# 1. Construire le frontend localement
echo "Construction du frontend localement..."
cd frontend
npm install
NODE_OPTIONS=--max_old_space_size=4096 npm run build
cd ..

# 2. Copier le backend
echo "Préparation du backend..."
cp -r backend-ts/* $DEPLOY_DIR/
cp -r backend-ts/.env* $DEPLOY_DIR/ 2>/dev/null || :
cp -r backend-ts/.npmrc $DEPLOY_DIR/ 2>/dev/null || :
cp backend-ts/nixpacks.toml $DEPLOY_DIR/
cp backend-ts/Dockerfile $DEPLOY_DIR/

# 3. Créer le dossier public pour les fichiers statiques
mkdir -p $DEPLOY_DIR/public

# 4. Copier le build du frontend dans le dossier public du backend
echo "Copie du frontend build dans le backend..."
cp -r frontend/build/* $DEPLOY_DIR/public/

# 5. Modifier le fichier index.ts pour servir les fichiers statiques
echo "Mise à jour du fichier index.ts pour servir les fichiers statiques..."
cat > $DEPLOY_DIR/src/index.ts << EOF
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import showsRoutes from './routes/showsRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// API routes
app.use('/api', showsRoutes);

// Serve static files from the frontend build folder
app.use(express.static(path.join(__dirname, '../public')));

// Handle any requests that don't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`API available at http://localhost:\${PORT}/api/shows\`);
});
EOF

# 6. Initialiser git pour le déploiement
echo "Initialisation du repository git..."
cd $DEPLOY_DIR
git init
git add .
git commit -m "Optimized deployment package"

echo "===================================================="
echo "Préparation terminée !"
echo "===================================================="
echo ""
echo "Pour déployer sur Railway :"
echo "1. Créez un nouveau projet sur Railway"
echo "2. Exécutez les commandes suivantes :"
echo ""
echo "   cd $DEPLOY_DIR"
echo "   railway link"
echo "   railway up"
echo ""
echo "3. N'oubliez pas de configurer les variables d'environnement sur Railway :"
echo "   - RAPID_API_KEY : votre clé API Streaming Availability"
echo "   - NODE_ENV : production"
echo ""
echo "La version optimisée ne déploie que le backend avec les fichiers statiques du frontend,"
echo "ce qui devrait éviter les problèmes de mémoire lors du build sur Railway."
echo "" 