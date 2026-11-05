# SS® — Creative Technologist Portfolio

A responsive, motion-led portfolio for Shubhnit, built with React, Vite, GSAP, React Three Fiber, Drei and Lucide. The visual direction combines minimal editorial structure, a cinematic intro, an abstract CSS-built identity graphic, interactive 3D studies and expandable project case files.

## Run locally

Install Node.js (LTS), then open Terminal in this folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Before publishing, run:

```bash
npm run build
npm run preview
```

## Personalise the site

- Update the contact placeholder `YOUR.EMAIL@example.com` in `src/App.jsx`.
- Edit the `projects` array near the top of `src/App.jsx` to change project titles, summaries, descriptions and tool tags.
- Replace the procedural objects in the `Model` component with your own optimised Blender GLB exports when ready.
- Replace the two illustrations in `public/images/` if you want a different visual mood.
- The project case files are currently editable starter templates; add real screenshots, repository links, demos and process details as each project is ready. No achievements or project outcomes have been invented.

## Images and deployment path

Images are referenced with Vite's `import.meta.env.BASE_URL`, so they follow the configured deployment base path.

For a GitHub Pages project repository such as `username.github.io/portfolio/`, set the Vite `base` in `vite.config.js` to `/portfolio/`. For a user/organisation site repository named `username.github.io`, keep `base: '/'`. The included GitHub Actions workflow builds `dist` and deploys it to GitHub Pages. In the repository, choose **Settings → Pages → Build and deployment → GitHub Actions**.

## Notes

- No portrait is used.
- The 3D objects are procedural placeholders and can be rotated with mouse or touch.
- The intro and scroll animations respect `prefers-reduced-motion`.
- The email address is intentionally a placeholder. Replace it before publishing.
- Google Fonts are loaded remotely; the system sans-serif fallback remains available if the fonts cannot load.
