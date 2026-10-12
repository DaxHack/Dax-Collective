# Dax Collective User Action Checklist

Date: 2026-06-03

Use this as the single owner-action checkpoint. Do not paste secrets into chat, workflow JSON, or repo files.

## 1. Public n8n URL

Choose one stable HTTPS URL for n8n before connecting OAuth apps.

- [ ] Public n8n URL chosen.
- [ ] n8n opens from that URL.
- [ ] n8n is not only reachable at `localhost`.
- [ ] n8n public URL is configured for self-hosted webhooks/OAuth.

Recommended n8n environment values when behind a tunnel or reverse proxy:

```text
WEBHOOK_URL=https://YOUR-N8N-DOMAIN/
N8N_EDITOR_BASE_URL=https://YOUR-N8N-DOMAIN/
N8N_PROXY_HOPS=1
```

## 2. n8n OAuth Redirect URL

Use the exact OAuth redirect URL shown in the n8n credential screen. For most self-hosted n8n OAuth credentials, the format is:

```text
https://YOUR-N8N-DOMAIN/rest/oauth2-credential/callback
```

Paste that exact URL into Google, Meta, TikTok, or other developer-app redirect settings when required.

## 3. Existing n8n Webhook Paths

These workflow webhook paths currently exist but are inactive:

```text
GET https://YOUR-N8N-DOMAIN/webhook/69a8674a-a9d4-4817-8293-edd4ba343ad5
GET https://YOUR-N8N-DOMAIN/webhook/content-generation
```

Do not expose or use these publicly until the matching workflows are reviewed and intentionally activated.

## 4. n8n API/Model Environment Values

The live workflows now reference these values by environment variable instead of storing raw key-like strings:

```text
DEEPSEEK_API_KEY=enter in n8n/Docker environment, not chat
GEMINI_API_KEY=enter in n8n/Docker environment, not chat
```

If you prefer n8n credentials instead of Docker environment variables, tell Codex before entering the values so the workflows can be converted to credential nodes.

## 5. Platform Accounts and Pages

- [ ] TikTok account created for each brand that will publish to TikTok.
- [ ] Instagram account created for each brand that will publish to Instagram.
- [ ] Facebook Pages created under your existing Facebook account.
- [ ] YouTube channels created or confirmed for each brand.
- [ ] Blog/CMS destination chosen for blog publishing.

## 6. Developer Apps and OAuth

- [ ] Google Cloud OAuth consent screen has real home page, privacy policy, and terms URLs.
- [ ] Google OAuth client has the n8n OAuth redirect URL.
- [ ] YouTube Data API is enabled for the Google project.
- [ ] Meta app is set up for Facebook Pages and Instagram publishing.
- [ ] TikTok developer app is set up if TikTok publishing is approved.
- [ ] Credentials are created inside n8n UI only.

## 7. Frontend Firebase Values

Paste Firebase web app values into `dax-main/.env` locally only.

- [ ] `REACT_APP_FIREBASE_API_KEY`
- [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN`
- [ ] `REACT_APP_FIREBASE_PROJECT_ID`
- [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET`
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `REACT_APP_FIREBASE_APP_ID`
- [ ] `REACT_APP_FIREBASE_MEASUREMENT_ID`

Do not put service-account private keys in the frontend.

## 8. Final User Check

When you come back, check these four things:

- [ ] n8n opens at the public HTTPS URL.
- [ ] Firebase frontend `.env` has real web app values.
- [ ] Social/video accounts and pages exist.
- [ ] You are ready to enter credentials in n8n UI while Codex guides where they go.

## 9. Optional Personal Travel Photos

The site can already use sourced fallback travel images without extra keys. For personal Dax The Traveler trip photos, either place selected photos in the existing frontend image folders or connect a user-approved Google Drive/Photos workflow later. Do not paste Google account passwords or private tokens into chat.
