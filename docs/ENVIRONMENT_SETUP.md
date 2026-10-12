# Dax Collective — Environment Setup Guide

## Where Secrets Live

All real secrets must be stored in **Replit Secrets** (not `.env` files). The `.env` files in this repo contain **only placeholders** for local development convenience.

| Environment | File | Purpose |
|------------|------|---------|
| Frontend | `dax-main/.env` | React `REACT_APP_*` placeholders (keys only, no values) |
| Backend | `dax-backend/.env` | Server config placeholders |
| Templates | `dax-main/.env.example` | Safe reference for all frontend variables |
| Templates | `dax-backend/.env.example` | Safe reference for all backend variables |

## Naming Conventions

### Frontend (browser-safe, `REACT_APP_*` prefix)
These are embedded into the production bundle. Only use them for:
- Firebase client config (public by design)
- Google API keys with **HTTP referrer restrictions** (your domain only)
- Public content IDs (Sheet IDs, Drive folder IDs, YouTube channel IDs)
- Feature toggles and non-sensitive config

**NEVER expose AI provider keys to the frontend.**
OpenAI, ElevenLabs, Claude, Gemini, and similar keys must stay backend-only (no `REACT_APP_` prefix). The frontend should call your backend API for any AI-powered features. Exposing these keys in the browser bundle is a critical security risk.

### Backend (private, no prefix)
These never leave the server. Use them for:
- Google API keys with **IP restrictions** (backend server only)
- OAuth client secrets and refresh tokens
- AI provider keys (OpenAI, Claude, Gemini, ElevenLabs)
- Social media access tokens
- Service account credentials

## Google Cloud Project: Dax-Automation

### Required API Keys

| Key Name | Used In | Restrictions |
|----------|---------|-------------|
| `REACT_APP_GOOGLE_API_KEY` | Frontend Google Maps, Sheets fallback | HTTP referrer → your domains |
| `BACKEND_GOOGLE_API_KEY` | Backend proxy calls (Sheets, Drive, YouTube) | IP → your server IPs |
| `YOUTUBE_DATA_API_KEY` | YouTube Data API calls | IP-restricted |

### Required OAuth Clients

| Client | Scopes | Callback URI |
|--------|--------|-------------|
| **DAX_PHOTOS** | `photoslibrary.readonly` | `/auth/google/photos/callback` |
| **DAX_TECH** | `drive.file`, `sheets` | n8n or backend callback |
| **TZ_TRAVEL** | `drive.file` | n8n or backend callback |
| **ANI_DAX** | `drive.file` | n8n or backend callback |
| **GODS_VESSEL** | `drive.file`, `sheets` | n8n or backend callback |
| **DAX_TRAVELER** | `drive.file` | n8n or backend callback |
| **Dax-Main** | `drive.file`, `youtube.upload` | n8n or backend callback |

## Replit Secrets Checklist

Set these in Replit Secrets (not `.env` files):

### Frontend
- `REACT_APP_GOOGLE_API_KEY` — restricted browser key
- `REACT_APP_YOUTUBE_API_KEY` — restricted browser key
- `REACT_APP_FIREBASE_API_KEY` — Firebase web key
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_SHEET_GODS_VESSEL_QUOTES` — public sheet ID
- `REACT_APP_SHEET_DAX_TRAVELER_BLOGS`
- `REACT_APP_SHEET_TIMEZONE_TRAVELERS_BLOGS_ITINERARIES`

### Backend
- `GOOGLE_API_KEY` — backend-only unrestricted/IP-restricted key
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_REDIRECT_URI`
- `YOUTUBE_API_KEY` — backend-only YouTube key
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `N8N_API_KEY`
- `N8N_WEBHOOK_URL`

### Google Photos OAuth (DAX_PHOTOS)
The backend does **not** currently have a Google Photos OAuth route.
Proposed callback path: `/auth/google/photos/callback`
Required scopes: `https://www.googleapis.com/auth/photoslibrary.readonly`

## Security Rules

1. **Never commit real keys** to `.env`, `.env.local`, or any file in version control.
2. **Never log secret values** — only log whether a key is present (boolean).
3. **Frontend keys get exposed** in the build — only use restricted browser keys.
4. **Backend keys stay private** — use IP restrictions where possible.
5. **Service accounts** (`firebase-adminsdk.json`) are server-side only — never serve them.
6. **Google Photos must use OAuth** — never use a service account for Google Photos API.

## Current Known Issue

The existing Google Cloud project credentials (API key + service account) are under a **suspended consumer** (`CONSUMER_SUSPENDED` / `API_KEY_HTTP_REFERRER_BLOCKED`). The devotional section and Sheets proxy are fully wired in code, but a new Google Cloud project or restored credentials are required for live data.
