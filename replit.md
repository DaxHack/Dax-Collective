# Dax Collective

A multi-brand content hub and automation platform serving as a unified web application for several brands: Dax the Traveler (travel blogs), Timezone Travelers (SEO travel content), God's Vessel (faith-based content), and Ani-Dax (anime content).

## Architecture

- **Frontend**: React 18 (Create React App) in `dax-main/` — runs on port 5000
- **Backend**: Express.js API in `dax-backend/` — runs on port 3001
- **Firebase**: Firestore, Auth, and Storage (credentials in `dax-backend/credentials/`)
- **Automation**: n8n workflows in `n8n/` directory

## Development Setup

### Frontend (port 5000)
```bash
cd dax-main && npm start
```
Configured via `dax-main/.env` with `PORT=5000`, `HOST=0.0.0.0`, `DANGEROUSLY_DISABLE_HOST_CHECK=true`.

### Backend (port 3001)
```bash
cd dax-backend && npm start
```
Configured via `dax-backend/.env` with `PORT=3001`.

### Both together (from root)
```bash
npm run dev
```

## Key Files

- `dax-main/src/App.jsx` — Main React router with all page routes
- `dax-main/src/config/firebase.js` — Firebase client initialization (graceful fallback if no API keys)
- `dax-main/src/config/apiConfig.js` — All API/environment configuration
- `dax-main/src/contexts/AuthContext.js` — Firebase Auth context with graceful fallback
- `dax-backend/server.js` — Express server entry point
- `dax-backend/routes/uploadApi.js` — Google Drive upload, Firebase Storage, image optimization routes
- `dax-backend/credentials/firebase-adminsdk.json` — Firebase Admin SDK service account

## Environment Variables

### Frontend (`dax-main/.env`)
- `REACT_APP_FIREBASE_API_KEY` — Firebase Web API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, etc.
- `REACT_APP_GOOGLE_API_KEY` — Google APIs key
- `REACT_APP_YOUTUBE_API_KEY` — YouTube Data API key
- `REACT_APP_API_BASE_URL` — Backend API URL (default: http://localhost:3001)

### Backend (`dax-backend/.env`)
- `PORT` — Backend port (3001)
- `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` — Google Drive OAuth
- Social media tokens: TikTok, Facebook, Instagram, YouTube

## Brands / Pages

- `/` — Home (landing page with all brands)
- `/dax-the-traveler` — Travel content brand
- `/ani-dax` — Anime content brand
- `/timezone-travelers` — Productivity/travel content brand
- `/gods-vessel` — Faith-based content brand
- `/automation` — Dashboard (admin automation panel)
- `/dax-the-investor` (and aliases) — Private investor page

## Deployment

Configured as **static** deployment:
- Build: `cd dax-main && npm run build`
- Public dir: `dax-main/build`

## Dependencies

- React 18, React Router v7, Tailwind CSS, Framer Motion
- Firebase SDK v11, Firebase Admin SDK v12
- Express.js, Multer, Sharp, Google APIs
- Headless UI, Heroicons, Lucide React
