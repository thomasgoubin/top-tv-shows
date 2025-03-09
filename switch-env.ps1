param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "prod")]
    [string]$Env
)

Write-Host "=== Passage en mode $Env ==="

Set-Location -Path frontend

if ($Env -eq "dev") {
    # Basculer vers la configuration de développement local
    Write-Host "Passage en mode développement local"
    
    # Sauvegarder l'actuel package.json s'il s'agit de la configuration de production
    if (Test-Path "package.json") {
        $content = Get-Content "package.json" -Raw
        if ($content -match "top-tv-shows-frontend-prod") {
            Rename-Item "package.json" "package.prod.json" -Force
        }
    }
    
    # Vérifier si package.dev.json existe et le copier
    if (Test-Path "package.dev.json") {
        Copy-Item "package.dev.json" "package.json" -Force
        Write-Host "Configuration de développement appliquée"
    } else {
        Write-Host "Erreur: package.dev.json introuvable" -ForegroundColor Red
        exit 1
    }
    
    # Supprimer node_modules et package-lock.json pour une installation propre
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
    
    # Installer les dépendances de développement
    npm install
    
    Write-Host "Mode développement prêt ! Vous pouvez exécuter 'npm start' pour démarrer l'application en local."
}
elseif ($Env -eq "prod") {
    # Basculer vers la configuration de production pour Railway
    Write-Host "Passage en mode production pour déploiement Railway"
    
    # Sauvegarder l'actuel package.json s'il s'agit de la configuration de développement
    if (Test-Path "package.json") {
        $content = Get-Content "package.json" -Raw
        if ($content -match "top-tv-shows-frontend-dev") {
            Rename-Item "package.json" "package.dev.json" -Force
        }
    }
    
    # Vérifier si package.prod.json existe et le copier
    if (Test-Path "package.prod.json") {
        Copy-Item "package.prod.json" "package.json" -Force
        Write-Host "Configuration de production appliquée"
    } else {
        Write-Host "Erreur: package.prod.json introuvable" -ForegroundColor Red
        exit 1
    }
    
    # Revenir au répertoire racine
    Set-Location -Path ..
    
    Write-Host "Mode production prêt ! Vous pouvez maintenant pousser les changements pour déployer sur Railway."
}

# Revenir au répertoire racine
Set-Location -Path .. 