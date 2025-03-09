# Démarrage de l'application en mode développement
Write-Host "Démarrage de l'application en mode développement" -ForegroundColor Green

# Démarrer le backend dans une nouvelle fenêtre
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev:backend"

# Démarrer le frontend
npm run dev:frontend 