# PROFLOCATOR — Deploying to Render (step-by-step)

This README contains concrete steps to deploy PROFLOCATOR to Render using your existing MongoDB Atlas cluster. I prepared a `render.yaml` manifest and a small Atlas test script to make deployment easier.

## What I changed/added
- `render.yaml` — manifest to create a Web Service (API + static files) and a Worker (background cron jobs).
- `scripts/test-atlas-conn.js` — small Node script to verify `DATABASE_URL` connectivity locally.
- Fixed `package.json` so `npm run worker` works.

## Quick checklist (what you need)
- A GitHub repository containing this project (push your local repo to GitHub if not done).
- A MongoDB Atlas cluster and the connection string for a production DB user (we recommend creating a production DB user and DB name such as `profLocatorDB_prod`).
- A Render account.
- A domain (optional) — Render can provide a default one and manage TLS.

---

## Step 1 — Prepare Atlas
1. In Atlas -> Database Access -> Add New Database User
   - Username: `prof_locator_prod_user` (example)
   - Password: generate a strong password and store it.
   - Role: `Read and write to any database` (or grant readWrite on a specific DB for least privilege).
2. In Atlas -> Network Access
   - For quick testing: add IP `0.0.0.0/0` (temporary).
   - For production: restrict to host IPs or configure VPC peering/private endpoints.
3. In Atlas -> Clusters -> Connect -> Connect your application
   - Copy the connection string (Node/4.x), replacing `<username>`, `<password>`, and `<dbname>`.
   - Example:
     ```text
     mongodb+srv://prof_locator_prod_user:yourPass@cluster0.abcdef.mongodb.net/profLocatorDB_prod?retryWrites=true&w=majority
     ```
   - URL-encode password characters if they include `@`, `:`, or `/`.
4. Enable backups and set up alerts in Atlas → Backup & Alerts.

## Step 2 — Test your Atlas connection locally
1. Set the `DATABASE_URL` environment variable locally (PowerShell example):
```powershell
$env:DATABASE_URL = "mongodb+srv://prof_locator_prod_user:yourPass@cluster0.abcdef.mongodb.net/profLocatorDB_prod?retryWrites=true&w=majority"
```
2. Run the test script:
```powershell
node scripts/test-atlas-conn.js
```
You should see `✅ Connected to Atlas`.

## Step 3 — Push repo to GitHub
- Make sure `render.yaml`, `package.json`, and `backend/*` are committed and pushed to your GitHub repository.

## Step 4 — Deploy to Render
1. In Render, create a new Web Service and connect your GitHub repo (or use `render.yaml` to auto-detect):
   - Environment: Node
   - Branch: `main` (or whichever branch you use)
   - Build Command: `npm install`
   - Start Command: `npm run start`
   - Environment variables (set in Render's dashboard):
     - `DATABASE_URL` = your Atlas connection string
     - `SESSION_SECRET` = a strong random string
     - `NODE_ENV` = production
     - `ALLOWED_ORIGIN` = https://yourdomain.example (optional)
2. In Render, create a Worker service (same repo/branch):
   - Start Command: `npm run worker`
   - Set the same environment variables as the Web Service. Optionally set `STATUS_DEBUG = true` for initial debugging.
3. Wait for deploy to finish. Render handles TLS for custom domains.

## Step 5 — Verify
- Open the Web Service URL and confirm the frontend loads.
- Use browser devtools Network tab to confirm API requests return 200.
- Check Render's logs for the worker to verify cron jobs run (set `STATUS_DEBUG=true` if needed).

## Step 6 — CI/CD (GitHub Actions -> Render)

I added a GitHub Actions workflow template at `.github/workflows/deploy-to-render.yml` that will trigger Render deploys on pushes to `main` once you add the required GitHub Secrets. Follow these steps to enable automatic deploys:

1. In Render: get an API key
   - In Render dashboard → Account → API Keys → Create API Key. Copy the key (value shown only once).
2. In Render: get Service IDs
   - For each service (web and worker) go to the service's Settings → General → find `Service ID` and copy it.
3. In GitHub: add repository secrets
   - Go to your repo → Settings → Secrets and Variables → Actions → New repository secret.
   - Add the following secrets:
     - `RENDER_API_KEY` = (the API key from Render)
     - `RENDER_WEB_SERVICE_ID` = (the web service id)
     - `RENDER_WORKER_SERVICE_ID` = (the worker service id)
4. Once those secrets exist, any push to `main` will run the workflow and trigger new deploys on Render.

Notes:
- The workflow runs `npm ci` to install dependencies and then calls Render's deploy API for each service.
- The workflow file is safe to keep in the repo; it does not contain secrets.
- If you prefer Render's auto-deploy via the Render UI, you may skip the Actions integration — both are fine.

## Optional: tighten Atlas security
- Replace `0.0.0.0/0` with VPC peering or restrict to host IPs.
- Create separate DB users for dev/test/prod with minimal permissions.

## Useful commands (PowerShell)
```powershell
# Install deps
npm install
# Run server locally
$env:DATABASE_URL = "mongodb+srv://..."
$env:SESSION_SECRET = "your-secret"
npm run dev
# Run worker locally
$env:STATUS_DEBUG = "true"
npm run worker
```

## If you want me to do more (I can't access your Render/Atlas accounts):
- I can prepare a GitHub Actions workflow that triggers a Render deploy via API if you provide a Render API key (sensitive; do not paste in chat). I can instead add the workflow file and document where to add the secret in GitHub.
- I can create a step-by-step checklist (with screenshots) for the Render dashboard if you'd like.

---

If you'd like, I'll now:
- create a GitHub Actions deploy template (no secret included) and add it to `.github/workflows/` so you can enable CI/CD by adding the Render API key in GitHub Secrets, OR
- walk you through the Render UI step-by-step (I will list exact values to copy/paste).

Which do you prefer? (I recommend the Render UI flow for first-time deploys; the Actions template is useful for automated deploys later.)
