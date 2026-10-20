# CampusCore Day 36 — VS Code setup (Windows PowerShell)

## Folder layout
D:\Projects\campuscore\campuscore\ = IntelliJ Spring Boot backend
D:\Projects\campuscore\campuscore-frontend\ = VS Code React frontend

## Steps
1. Install Node.js 22 LTS or newer compatible version, VS Code, and Git. Restart terminals after installing Node.
2. Extract this ZIP into `D:\Projects\campuscore\` so the `campuscore-frontend` folder sits **beside** `campuscore`, not inside it.
3. In VS Code choose File > Open Folder > `D:\Projects\campuscore\campuscore-frontend`. Trust the workspace if it is your own project.
4. Open Terminal > New Terminal, choose PowerShell, and run:

```powershell
node -v
npm -v
Copy-Item .env.example .env
npm install
npm run dev
```

5. Open `http://localhost:5173` and test navigation.
6. In another VS Code terminal run:

```powershell
npm run typecheck
npm run build
```

7. Open the backend in IntelliJ and run Spring Boot on `http://localhost:8081` when API testing is needed. Vite forwards `/api` requests to the backend during development.

## GitHub — separate frontend repository
After tests pass, in the VS Code terminal:

```powershell
git init
git branch -M main
git add .
git commit -m "Day 36: Initialize CampusCore VS Code frontend"
```

Create an empty `campuscore-frontend` repository on GitHub without initializing README or gitignore. Copy its real HTTPS URL, then:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/campuscore-frontend.git
git push -u origin main
git status
```

Replace `YOUR_USERNAME` with your actual username. `.env`, `node_modules`, and `dist` must stay untracked. Do not put backend passwords or JWT signing secrets into frontend files.

## Important
- Day 36 login is a UI placeholder; actual authentication is Day 37.
- `.vscode` includes editor recommendations, formatting, and a Chrome debugging launch profile.
- If PowerShell blocks npm scripts, use `npm.cmd install`, `npm.cmd run dev`, `npm.cmd run typecheck`, and `npm.cmd run build` instead.
- See `README.md` for architecture and backend integration details.
