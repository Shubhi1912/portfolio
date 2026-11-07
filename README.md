# SS® — Creative Technologist Portfolio (v2)

React 18 · Vite · GSAP + ScrollTrigger · Lenis · React Three Fiber · three.js

An editorial-meets-liquid-glass portfolio: a living shader field and mouse-reactive 3D orb in the hero,
kinetic variable-weight typography, smooth inertial scrolling, a hidden terminal, and a client-friendly
contact card with a built-in project brief.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs ./dist
npm run preview    # test the production build locally
```

## Make it yours (one file: `src/data.js`)

| What | Where |
| --- | --- |
| Email address | `EMAIL` |
| GitHub / LinkedIn / Instagram buttons (hidden until you add an `href`) | `SOCIALS` |
| Project titles, copy, stack, status | `projects` |
| "View source" / "Open demo" buttons on a case file | `projects[n].links.source` / `.demo` |
| Brief / Process / Build / Reflection text on a case file | `projects[n].notes` (keys: `Brief`, `Process`, `Build`, `Reflection`) |
| Terminal `theme` colours | `ACCENTS` |

### Replacing the placeholders with real work

* **Tile + case-file art** — the animated UI mock-ups are in `src/components/ProjectArt.jsx`. To use a real
  screenshot, put the image in `public/images/` and, in `src/components/Sections.jsx` (tile) and
  `src/components/CasePage.jsx` (gallery), swap `<ProjectArt … />` for an `<img>` that points at
  `import.meta.env.BASE_URL + 'images/your-file.jpg'` (this keeps the path correct on GitHub Pages).
* **3D studies** — the three procedural objects live in `src/components/Models.jsx`. Export a `.glb` from Blender,
  place it in `public/models/`, and load it with `useGLTF` from `@react-three/drei`.
* **Hero orb / background** — `src/components/HeroScene.jsx` (GLSL background + liquid orb).

## Interaction notes

* **Cursor (desktop):** a liquid-glass ring that stretches with speed, swells over links and shows a label for
  anything tagged `data-cursor="LABEL"`.
* **iPhone / touch:** no cursor — a spring-animated liquid-glass blob blooms under the finger. iOS also gets stronger
  glass highlights and a quick-squeeze / springy-release press feel. The layout and features are identical on every device.
* **Scrolling:** Lenis smooths mouse-wheel and trackpad scrolling. Touch screens keep the native momentum scroll
  (it already feels right, especially on iOS).
* **Hidden terminal:** press `` ` `` · enter the Konami code · or tap the **SS®** logo five times.
  Try `help`, `ls`, `open python`, `theme clay`, `spin`, `party`, `glitch`.
* **Shareable case files:** every project has a link such as `…/#project-python`.
* **Accessibility:** `prefers-reduced-motion` turns off the intro, smooth scroll, cursor effects and heavy animation.
  If WebGL is unavailable the 3D areas fall back gracefully instead of breaking the page.
* WebGL canvases pause automatically when they are off-screen.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository (branch `main`).
2. In the repo go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push — `.github/workflows/deploy.yml` builds and publishes automatically.

Why it won't break on Pages:

* `vite.config.js` uses `base: './'`, so assets resolve correctly on both `username.github.io` and
  `username.github.io/repo-name/`.
* Navigation uses `#hash` links only, so there is no 404 fallback to configure.
* No runtime downloads except Google Fonts — the 3D lighting is generated in code (no HDR files).
* `public/.nojekyll` is included.
