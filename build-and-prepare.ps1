# Script pour construire le frontend localement et le préparer pour Railway

# 1. Construire le frontend
Write-Host "Compilation du frontend..."
Set-Location -Path frontend
npm install
$env:NODE_OPTIONS = "--max_old_space_size=4096"
npm run build
Set-Location -Path ..

# 2. Créer le dossier public dans le backend
Write-Host "Création du dossier public dans le backend..."
$publicDir = "backend-ts\public"
if (!(Test-Path $publicDir)) {
    New-Item -Path $publicDir -ItemType Directory -Force | Out-Null
}

# 3. Copier les fichiers du build dans le dossier public
Write-Host "Copie des fichiers statiques..."
Copy-Item -Path "frontend\build\*" -Destination $publicDir -Recurse -Force

Write-Host "Terminé ! Vous pouvez maintenant committer les changements avec :"
Write-Host "git add backend-ts/public"
Write-Host "git commit -m 'Add compiled frontend static files'"
Write-Host "git push origin main"
Write-Host ""
Write-Host "Ensuite, déployez sur Railway en suivant les instructions dans le README.md" 