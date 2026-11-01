# Analog Portfolio — React + Three.js

A responsive, expanded 1980s-inspired portfolio for a developer, 3D artist, video editor and game designer. It uses React, Vite, React Three Fiber, Drei, GSAP and Lucide icons. The three interactive 3D objects are temporary procedural models so the site works before you add your own Blender exports.

## 1. What to replace

Open `src/App.jsx` and replace these sample values:
- `Shubhnit` / `SHUBHNIT SINGHAL` — replace with your preferred display name if needed.
- `YOUR.EMAIL@example.com` — your contact email.
- `BASED IN YOUR CITY` — optional city or region.
- Project names, categories, descriptions and years in the `projects` array in `src/App.jsx`.
- About paragraph and skill tags with accurate information about yourself.

No portrait is used. The hero artwork is CSS illustration and the three project viewers are generated 3D placeholders.

## 2. Run locally (Mac / Windows)

Install Node.js LTS from https://nodejs.org/ if you do not already have it. Then open Terminal (Mac) or PowerShell (Windows), move into this folder, and run:

```bash
npm install
npm run dev
```

Open the local address printed by Vite (usually `http://localhost:5173`). Keep the terminal running while you work.

Before publishing, test a production build:

```bash
npm run build
npm run preview
```

## 3. Replace the placeholder objects with your Blender models

1. In Blender, make each model's origin sensible, apply transforms (`Ctrl+A` → Rotation & Scale), and keep the polygon count reasonable for the web.
2. Export each model as **glTF Binary (.glb)**. glTF/GLB is suitable for web 3D and can include materials and textures.
3. Put the files in `public/models/` (create the `models` folder), for example:
   - `orbital.glb`
   - `form-study.glb`
   - `kinetic.glb`
4. In `src/App.jsx`, import `useGLTF` from `@react-three/drei`, then load each file inside a model component with `const { scene } = useGLTF('/models/orbital.glb')` and render `<primitive object={scene} />`.
5. Use the same `OrbitControls` already included. Visitors can drag with a mouse or swipe with a finger. Keep `enablePan={false}` to prevent the object drifting out of view.

The current geometry is deliberately a stand-in. Replace the contents of the `Model` component with your own GLB loader when ready. For best results, optimise textures and geometry and test on a phone.

## 4. Publish free with GitHub Pages

### A. Create the repository
1. Sign in to GitHub.
2. Click **New repository**.
3. Name it `portfolio` (or another name), choose **Public**, and create it.
4. Do not initialise with a README if you already have this project folder.

### B. Set the Vite base path
If your site will be `https://YOUR-USERNAME.github.io/portfolio/`, open `vite.config.js` and change:

```js
base: '/'
```

to:

```js
base: '/portfolio/'
```

The text between slashes must exactly match your repository name. If you name the repository `YOUR-USERNAME.github.io`, keep `base: '/'`.

### C. Push the project to GitHub
Open Terminal in this project folder and run (replace the URL with your repository's actual URL):

```bash
git init
git add .
git commit -m "Create portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git push -u origin main
```

If Git asks you to sign in, complete GitHub's browser authentication prompt.

### D. Turn on GitHub Pages
1. Open your repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. The included workflow at `.github/workflows/deploy.yml` will build and publish the site automatically.
5. Open the **Actions** tab and wait for the Pages workflow to finish successfully.
6. Your site will be available at `https://YOUR-USERNAME.github.io/portfolio/`.

### E. Update the live site later
After editing files, run:

```bash
git add .
git commit -m "Update portfolio"
git push
```

GitHub Actions rebuilds and republishes the website automatically.

## 5. Important notes

- GitHub Pages hosts the front-end site for free. This portfolio does not need a backend or database.
- Do not put passwords, private API keys or personal data in the repository.
- Google Fonts are loaded from Google Fonts, so the fonts need an internet connection. The 3D viewers also require WebGL support.
- If you use a repository name other than `portfolio`, update `base` in `vite.config.js` before building/deploying.
- GitHub Pages is public: only publish contact details you are comfortable making public. You can use a dedicated portfolio email address.


## Added in this revision
- SS monogram branding.
- Expanded About section and retro collage illustrations in `public/images/`.
- Separate sample project cards for Python, C, video editing and game design.
- Skills and tools showcase.
- Three interactive 3D model viewers remain in place.
