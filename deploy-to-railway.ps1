# Script pour préparer un déploiement optimisé pour Railway (PowerShell version)

# Vérifier que Node.js est installé
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js n'est pas installé. Veuillez l'installer pour continuer."
    exit 1
}

Write-Host "==== PRÉPARATION DU DÉPLOIEMENT RAILWAY OPTIMISÉ ===="

# Créer un dossier temporaire pour le déploiement
$DEPLOY_DIR = "railway-optimized-deploy"
if (Test-Path $DEPLOY_DIR) {
    Remove-Item -Path $DEPLOY_DIR -Recurse -Force
}
New-Item -Path $DEPLOY_DIR -ItemType Directory -Force | Out-Null

# 1. Construire le frontend localement
Write-Host "Construction du frontend localement..."
Set-Location -Path frontend
npm install
$env:NODE_OPTIONS = "--max_old_space_size=4096"
npm run build
Set-Location -Path ..

# 2. Copier le backend
Write-Host "Préparation du backend..."
Copy-Item -Path "backend-ts\*" -Destination $DEPLOY_DIR -Recurse -Force

# Copier les fichiers cachés (.env, .npmrc, etc.)
if (Test-Path "backend-ts\.env") {
    Copy-Item -Path "backend-ts\.env" -Destination $DEPLOY_DIR -Force
}
if (Test-Path "backend-ts\.env.example") {
    Copy-Item -Path "backend-ts\.env.example" -Destination $DEPLOY_DIR -Force
}
if (Test-Path "backend-ts\.npmrc") {
    Copy-Item -Path "backend-ts\.npmrc" -Destination $DEPLOY_DIR -Force
}
Copy-Item -Path "backend-ts\nixpacks.toml" -Destination $DEPLOY_DIR -Force
Copy-Item -Path "backend-ts\Dockerfile" -Destination $DEPLOY_DIR -Force

# 3. Créer le dossier public pour les fichiers statiques
New-Item -Path "$DEPLOY_DIR\public" -ItemType Directory -Force | Out-Null

# 4. Copier le build du frontend dans le dossier public du backend
Write-Host "Copie du frontend build dans le backend..."
Copy-Item -Path "frontend\build\*" -Destination "$DEPLOY_DIR\public" -Recurse -Force

# 5. Modifier le fichier index.ts pour servir les fichiers statiques
Write-Host "Mise à jour du fichier index.ts pour servir les fichiers statiques..."
$indexContent = @"
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
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/shows`);
});
"@

Set-Content -Path "$DEPLOY_DIR\src\index.ts" -Value $indexContent

# 6. Initialiser git pour le déploiement
Write-Host "Initialisation du repository git..."
Set-Location -Path $DEPLOY_DIR
git init
git add .
git commit -m "Optimized deployment package"

Write-Host "===================================================="
Write-Host "Préparation terminée !"
Write-Host "===================================================="
Write-Host ""
Write-Host "Pour déployer sur Railway :"
Write-Host "1. Créez un nouveau projet sur Railway"
Write-Host "2. Exécutez les commandes suivantes :"
Write-Host ""
Write-Host "   cd $DEPLOY_DIR"
Write-Host "   railway link"
Write-Host "   railway up"
Write-Host ""
Write-Host "3. N'oubliez pas de configurer les variables d'environnement sur Railway :"
Write-Host "   - RAPID_API_KEY : votre clé API Streaming Availability"
Write-Host "   - NODE_ENV : production"
Write-Host ""
Write-Host "La version optimisée ne déploie que le backend avec les fichiers statiques du frontend,"
Write-Host "ce qui devrait éviter les problèmes de mémoire lors du build sur Railway."
Write-Host ""

# Revenir au répertoire d'origine
Set-Location -Path .. 