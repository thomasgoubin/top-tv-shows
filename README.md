# Top TV Shows Application

Une application pour afficher les séries populaires sur différentes plateformes de streaming.

## ⚠️ Configuration à deux environnements

Cette application utilise deux configurations différentes :
- **Mode développement local** : Utilise React Scripts 5.0.1 compatible avec Node.js récent
- **Mode production Railway** : Utilise React Scripts 4.0.3 compatible avec Node.js 16 de Railway

## Développement local

### 1. Passer en mode développement

```powershell
.\switch-env.ps1 dev
```

Ce script va :
- Configurer le frontend pour le développement local
- Installer les dépendances nécessaires

### 2. Démarrer le backend

```bash
cd backend-ts
npm install
npm run dev
```

### 3. Démarrer le frontend (dans un autre terminal)

```bash
cd frontend
npm start
```

## Déploiement sur Railway

### 1. Passer en mode production

```powershell
.\switch-env.ps1 prod
```

Ce script va :
- Configurer le frontend pour être compatible avec Node.js 16 de Railway
- Préparer les fichiers pour le déploiement

### 2. Committer les changements

```bash
git add .
git commit -m "Prêt pour déploiement Railway"
git push origin main
```

### 3. Déployer sur Railway

1. Connectez-vous à [Railway](https://railway.app/)
2. Créez un nouveau projet et sélectionnez "Deploy from GitHub repo"
3. Sélectionnez votre dépôt GitHub
4. Configurez les variables d'environnement :
   - `RAPID_API_KEY` : Votre clé API Streaming Availability
   - `NODE_ENV` : `production`

## Précompilation locale du frontend (alternative)

Si vous rencontrez des problèmes lors du déploiement sur Railway, vous pouvez précompiler le frontend localement :

```powershell
.\clean-and-rebuild.ps1
```

Puis committez le dossier `backend-ts/public` qui contient les fichiers statiques compilés.

## Fonctionnalités

- Affichage des séries populaires par plateforme (Netflix, Prime, Disney+, etc.)
- Filtrage par période (jour, semaine, mois, année)
- Filtrage par pays
- Mode sombre
- Détails des séries avec notes IMDb
- Liens vers IMDb et Rotten Tomatoes

## Features

- Browse top TV shows from Netflix, Prime Video, Disney+, HBO, Hulu, Apple TV+, and Paramount+
- Filter shows by timeframe: today, this week, past week, past month, past year
- View show details including posters, summaries, and IMDb ratings
- Efficient caching system to minimize API calls
- Manual refresh button to control when to update data
- Responsive design for all device sizes

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
