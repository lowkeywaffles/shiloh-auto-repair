# Shiloh Auto Repair & Tires: website demo

Demo website for Shiloh Auto Repair & Tires, 3315 S Shiloh Rd, Garland, TX 75041 · (469) 782-0069.

- Single static page (`index.html`), English/Spanish (`?lang=es`).
- Gear-shifter language switch, headlight-knob light/dark switch, animated rating gauge, live open/closed status.

## Needed before going live
- [ ] Saturday closing time (listings say 4:00 or 4:30 PM)
- [ ] Logo and photos of the shop, bays and team
- [ ] Full service list (AC, alignment, engine/transmission?), warranty on parts and labor
- [ ] Do they speak Spanish at the counter? (the site offers a Spanish version)
- [ ] Payment options / financing

## Stack
- **Next.js** (static export) + **TypeScript** + **Tailwind CSS v4**
- **Magic UI** (Marquee, MagicCard, BorderBeam), **Motion**, **GSAP**, **Lenis** smooth scroll, **Phosphor** icons
- Strings live in `src/content/strings.json` (English plus each translation); the page is `src/app/page.tsx`

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```
Pushing to `main` builds and deploys to GitHub Pages (`.github/workflows/pages.yml`).
