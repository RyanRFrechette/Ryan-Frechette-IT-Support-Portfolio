# Ryan Frechette — IT Support Portfolio

A clean, fast, recruiter-friendly single-page portfolio for **entry-level remote IT support / help desk** roles. Plain HTML, CSS, and a few lines of vanilla JS — no build step, no framework, no dependencies.

## Purpose

Show that Ryan is an entry-level IT support candidate with unusually strong, documented proof:
Microsoft 365 / Entra ID lab work, Windows troubleshooting, osTicket ticketing practice,
read-only PowerShell support checks, Active Directory basics, and GitHub-documented workflows.

## Preview locally

No tooling needed — open `index.html` directly in a browser, or serve it for clean relative paths:

```bash
# Python (any OS)
python -m http.server 8000
# then visit http://localhost:8000
```

```powershell
# Windows / PowerShell, if you have Node installed
npx serve .
```

## Deploy

Any static host works. Pick one:

- **GitHub Pages** — push to a repo, then Settings → Pages → deploy from `main` / root. Free, simplest if the code already lives on GitHub.
- **Netlify** — drag-and-drop the folder at app.netlify.com, or connect the repo. Free, instant.
- **Vercel** — `vercel` CLI or import the repo. Framework preset: **Other** (static). Free.

**Recommendation:** GitHub Pages — the projects are already on GitHub, so it keeps everything in one place with a clean `RyanRFrechette.github.io`-style URL.

## File structure

```
Ryan-Frechette-IT-Support-Portfolio/
├── index.html              # the whole site
├── styles.css              # styles + responsive layout
├── script.js               # mobile nav toggle + footer year
├── README.md
└── assets/
    ├── README-assets.md
    └── Ryan-Frechette-IT-Support-Resume.pdf   # TODO: add this file
```

## Assets status

- [x] **Headshot added** — `assets/ryan-headshot.png` (used in the hero).
- [x] **Public email confirmed** — `ryanrjfrechette@gmail.com` (Contact `mailto:` link).
- [x] **Resume PDF added** — `assets/Ryan-Frechette-IT-Support-Resume.pdf` (download buttons point here).
- [ ] **Project screenshots** — optional future polish from the featured repos.
- [ ] **Favicon** — optional future polish.
- [ ] **Confirm domain / deployment choice** (GitHub Pages vs Netlify vs Vercel).
- [ ] **Manually test the LinkedIn link** — confirm it resolves to the correct profile.
- [ ] **Test in Chrome and Edge** (and on a phone-width window).
- [ ] **Add the final deployed URL** to the resume, LinkedIn, and GitHub profile README.

## Final polish checklist

- [ ] All "View Project →" links open the correct GitHub repos.
- [ ] Resume button downloads the real PDF (not a 404).
- [ ] Contact email is real, not the placeholder.
- [ ] Hero passes the 10-second test: target role, strongest proof, top project links, GitHub/LinkedIn/resume buttons all visible without scrolling.
- [ ] No console errors; mobile nav opens/closes.
- [ ] Add a `favicon` (optional).

## Notes

- Copy is intentionally conservative and honest — entry-level positioning, no overclaiming, no "senior/founder/guru" language.
- Atlas is framed as a **help desk workflow** project, not an AI-engineering project.
- Inbox Scout lives only under **Additional Builder Proof** and is described as a prototype, not a production platform.
