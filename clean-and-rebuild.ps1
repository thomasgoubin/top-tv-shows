Write-Host "=== Nettoyage et reconfiguration complète du projet ==="

# 1. Supprimer tous les node_modules et les fichiers de lock
Write-Host "1. Suppression des dépendances et fichiers de lock..."
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "frontend/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "frontend/package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend-ts/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend-ts/package-lock.json" -Force -ErrorAction SilentlyContinue

# 2. Nettoyer les builds
Write-Host "2. Nettoyage des builds..."
Remove-Item -Path "frontend/build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend-ts/dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backend-ts/public" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Installer npm-check-updates si nécessaire
Write-Host "3. Installation des outils de compatibilité..."
npm install -g npm-check-updates --force

# 4. Installer les dépendances du backend
Write-Host "4. Installation des dépendances du backend..."
Set-Location -Path backend-ts
npm install --legacy-peer-deps --force
Set-Location -Path ..

# 5. Construire le backend
Write-Host "5. Compilation du backend..."
Set-Location -Path backend-ts
npm run build
Set-Location -Path ..

# 6. Installer les dépendances du frontend avec des options de compatibilité
Write-Host "6. Installation des dépendances du frontend avec des options de compatibilité..."
Set-Location -Path frontend
npm install --legacy-peer-deps --force --no-fund --no-audit
Set-Location -Path ..

# 7. Construire le frontend
Write-Host "7. Compilation du frontend..."
Set-Location -Path frontend
npm run build
Set-Location -Path ..

# 8. Copier les fichiers du frontend dans le dossier public du backend
Write-Host "8. Copie des fichiers statiques du frontend vers le backend..."
$publicDir = "backend-ts\public"
if (!(Test-Path $publicDir)) {
    New-Item -Path $publicDir -ItemType Directory -Force | Out-Null
}
Copy-Item -Path "frontend\build\*" -Destination $publicDir -Recurse -Force

Write-Host "=== Terminé ! ==="
Write-Host "Le projet est maintenant prêt pour le déploiement sur Railway."
Write-Host "Vous pouvez committer les changements avec :"
Write-Host "git add ."
Write-Host "git commit -m 'Nettoyer et reconfigurer pour la compatibilité Node.js 16'"
Write-Host "git push origin main" 