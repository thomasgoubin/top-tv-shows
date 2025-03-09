# Top TV Shows

Application pour découvrir les séries TV populaires sur différentes plateformes de streaming.

## Fonctionnalités

- Affichage des séries populaires par plateforme (Netflix, Prime, Disney+, etc.)
- Filtrage par période (jour, semaine, mois, année)
- Filtrage par pays
- Mode sombre
- Détails des séries avec notes IMDb
- Liens vers IMDb et Rotten Tomatoes

## Développement local

### Installation

```bash
# Installer toutes les dépendances
npm run install:all
```

### Démarrage rapide

```bash
# Démarrer le backend et le frontend en une commande (Windows)
.\dev.ps1

# OU démarrer le frontend et le backend séparément
npm run dev:backend  # Dans un terminal
npm run dev:frontend # Dans un autre terminal
```

### Accès à l'application

- Frontend: http://localhost:3000
- API Backend: http://localhost:8080/api/shows

## Déploiement sur Railway

1. **Créer un projet sur Railway**
   - Se connecter à [Railway](https://railway.app/)
   - Créer un nouveau projet en utilisant l'option "Deploy from GitHub repo"
   - Sélectionner le dépôt GitHub

2. **Configurer les variables d'environnement**
   - `RAPID_API_KEY` : Votre clé API Streaming Availability
   - `NODE_ENV` : `production`

3. **Déployer**
   - Railway détectera automatiquement le projet et déploiera l'application

## Structure du projet

- `frontend/` : Application React
- `backend-ts/` : API Node.js/Express avec TypeScript
- `package.json` : Scripts pour le projet global

## Commandes disponibles

```bash
# Démarrage en production
npm start

# Développement
npm run dev:backend  # Démarrer le backend en mode dev
npm run dev:frontend # Démarrer le frontend en mode dev

# Build
npm run build        # Build du backend et frontend
npm run build:backend
npm run build:frontend

# Installation
npm run install:all
npm run install:backend
npm run install:frontend
```

## Technologies

- **Backend:** Go with gorilla/mux for routing
- **Frontend:** React.js
- **API:** [Streaming Availability API](https://github.com/movieofthenight/go-streaming-availability)
- **Deployment:** Docker, Railway

## Prerequisites

- Go 1.19 or later
- Node.js 16 or later
- npm
- RapidAPI key for Streaming Availability API

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/top-tv-shows.git
   cd top-tv-shows
   ```

2. Backend setup:
   ```bash
   cd backend
   
   # Create a .env file with your RapidAPI key
   echo "RAPID_API_KEY=your_rapidapi_key_here" > .env
   
   # Download dependencies
   go mod tidy
   
   # Run the backend server
   go run main.go
   ```

3. Frontend setup:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## API Usage Notes

- The Streaming Availability API is limited to 1000 calls per month on the free tier
- This application implements efficient caching to minimize API calls
- Data is refreshed only on user request via the "Refresh Data" button
- Cache persists between server restarts using the file system

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Movie of the Night](https://github.com/movieofthenight/go-streaming-availability) for the Streaming Availability API
- All streaming services for providing their content
