# Environment Configuration

This repository uses separate environment files for the browser, backend, and
automation runtime. Real environment files are local-only and ignored by Git.
Only `.env.example` templates are tracked.

## File Locations

| Location | Purpose | May contain secrets? | Commit? |
|---|---|---:|---:|
| `dax-main/.env` | React browser configuration | No | Never |
| `dax-main/.env.example` | Frontend placeholder names | No | Yes |
| `dax-backend/.env` | Local backend/server configuration | Yes | Never |
| `dax-backend/.env.example` | Backend placeholder names | No | Yes |
| `functions/.env` | Local Firebase Functions configuration, if used | Yes | Never |
| n8n Credentials / `C:\Users\Daniel Rollins\.n8n\.env` | n8n runtime and integration secrets | Yes | Never place in this repo |

Do not create a root `.env`. Keeping each file beside the application that
loads it makes updates predictable and prevents frontend/backend mixing.

## Frontend Rules

Create React App embeds every `REACT_APP_*` value into JavaScript delivered to
website visitors. Git ignore rules protect the file from Git, but they do not
make those values secret after a build.

Allowed in `dax-main/.env`:

- Firebase web configuration
- Public measurement IDs
- Public channel, folder, and voice identifiers
- Public, unauthenticated webhook URLs
- Browser API keys restricted by HTTP referrer and API scope
- The backend base URL

Never place these in `dax-main/.env`:

- OpenAI, Anthropic, Gemini, OpenRouter, or ElevenLabs API keys
- n8n API keys
- OAuth client secrets or refresh tokens
- Instagram, Facebook, TikTok, or X access tokens
- Firebase Admin service accounts or private keys
- Payment, email-provider, database, or session secrets

Those values belong in `dax-backend/.env`, Firebase/Google Secret Manager for
production, or n8n Credentials when n8n owns the integration.

## Backend Rules

Create `dax-backend/.env` only when running the backend locally:

```powershell
Copy-Item dax-backend/.env.example dax-backend/.env
```

Fill only the variables required by the feature being tested. Do not copy the
whole file to another machine, chat, issue, workflow JSON, or source file.

For deployed Firebase Functions, use managed production secrets rather than
uploading the local `.env` file.

## Updating Values

1. Stop the local frontend or backend process.
2. Edit the appropriate real `.env` file locally.
3. Never edit a real value into an `.env.example` file.
4. Restart the process. React values are read at build/start time.
5. Run the targeted ignore checks below.
6. Rebuild and test before deploying.

```powershell
git check-ignore -v dax-main/.env
git check-ignore -v dax-backend/.env
git check-ignore -v functions/.env
git ls-files -- ".env" "*.env" "*.env.*"
```

