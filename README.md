# CampusCore Frontend — Day 36

React 19 + TypeScript + Vite 6 + Tailwind CSS 4 starter. This project is a **frontend scaffold**, not a finished authenticated application.

## Requirements
- Node.js 20.19+ or 22.12+ (recommended Node 22 LTS)
- npm
- CampusCore Spring Boot backend at `http://localhost:8081` (for API integration)

## Install and run (PowerShell)
```powershell
cd D:\Projects\campuscore
# Extract the campuscore-frontend folder here, alongside the existing campuscore backend folder.
cd .\campuscore-frontend
Copy-Item .env.example .env
npm install
npm run dev
```
Open http://localhost:5173.

## Verify
```powershell
npm run typecheck
npm run build
```

## Backend integration
The API client in `src/lib/api.ts` calls `/api/*`. Vite proxies those requests to `http://localhost:8081` in development. `VITE_BACKEND_TARGET` sets the proxy target; `VITE_API_BASE_URL` defaults to `/api`.

Example (only after backend is running and an endpoint is available):
```ts
import { apiRequest } from './lib/api';
const data = await apiRequest<unknown>('/students', { token: '<access-token>' });
```
Never commit credentials or put JWT signing secrets in `VITE_*` variables. This helper accepts a token supplied by a future authentication layer; it does not persist tokens. For deployment, use a reverse proxy routing `/api` to Spring Boot, or configure secure cross-origin access on the backend.

The initial Dashboard and module pages use no fake metrics or API calls. The login page is a nonfunctional placeholder by design; Day 37 will implement authentication based on the actual backend request and response contract. Swagger is linked at http://localhost:8081/swagger-ui/index.html.

## Git options
**Option A: existing backend repository (monorepo)**
From `D:\Projects\campuscore\campuscore`, put `campuscore-frontend` inside that repository (rather than beside it), then run:
```powershell
git add campuscore-frontend
git commit -m "Day 36: Add React TypeScript Vite Tailwind frontend scaffold"
git push origin main
git status
```
**Option B: separate frontend repository (recommended if frontend is alongside backend)**
From `D:\Projects\campuscore\campuscore-frontend`:
```powershell
git init
git branch -M main
git add .
git commit -m "Day 36: Initialize CampusCore frontend"
# Create an empty GitHub repository, then use its actual URL:
git remote add origin <YOUR_NEW_FRONTEND_REPOSITORY_URL>
git push -u origin main
git status
```
Do not paste the placeholder URL literally. `npm install` creates package-lock.json; commit it for reproducible installs. Do not stage `.env`, `node_modules`, or `dist`.

## Folder map
- `src/components/` shared app shell and sidebar
- `src/pages/` dashboard, modules and login placeholder
- `src/lib/api.ts` reusable fetch API helper
- `src/styles.css` Tailwind CSS v4 import
- `vite.config.ts` Vite dev proxy

## Day 37
Connect actual Spring Boot `/api/auth` contract, add authentication context, protected routes, session handling, and login form validation. Review backend CORS and error response compatibility before production deployment.
