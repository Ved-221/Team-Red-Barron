# Product Requirements Document — Team Red Baron Website Rebuild

**Version:** 1.0 (draft)
**Status:** Living document — will be updated once `design.md` and `animationcomponents.md` are provided
**Owner:** Ved (solo, unpaid build)

---

## 1. Overview

Rebuild the Team Red Baron website (current: WordPress, `teamredbaron.com`) as a modern, fast, animated site benchmarked against `teamautomatons.in`. Team Red Baron is PCCOE's collegiate offroad/ATV team. The new site must retain and improve on all existing content while presenting it with a more premium, dynamic design.

**Goals:**
- Replace WordPress with a modern React/Next.js stack
- Preserve 100% of existing content (team history, journey, sponsors, contact)
- Improve visual design and interactivity to sponsor/recruit-attracting standard
- Zero cash cost — free tooling and free-tier services only
- Solo build via prompt engineering (Antigravity IDE)

**Non-goals (for v1):**
- No CMS/admin panel — content is hardcoded/structured data, not editable via UI
- No e-commerce or merchandise store
- No user accounts/login system

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) | Matches teamautomatons.in benchmark |
| UI library | React 19 | |
| Styling | Tailwind CSS v4 | |
| Component library | shadcn/ui | Base components — nav, forms, cards, tabs |
| Animated components | Aceternity UI, Magic UI | Hero, timeline, hover cards, marquee, bento grid |
| Animation (custom) | Framer Motion + **react-bits** (pending `animationcomponents.md`) | Scroll reveals, micro-interactions |
| 3D/visual (optional) | Spline (free tier) — deferred, not required for v1 | Real photos/video preferred over custom 3D given zero budget |
| Media hosting/optimization | Cloudinary (free tier) | |
| Forms/email | Nodemailer (Gmail SMTP) or Resend (free tier) | |
| Hosting | Vercel (Hobby/free tier) | |
| Version control | GitHub | |
| Build environment | Antigravity IDE (prompt-driven, Gemini 3) | |

---

## 3. Functional Requirements

### 3.1 Pages

| Page | Required content | Priority |
|---|---|---|
| Home | Hero (image/video), tagline, quick stats (years active, vehicles built, best rank), sponsor logo strip, nav to all sections | Must-have |
| About | Origin story, PCCOE Motorsports affiliation, mission | Must-have |
| Our Journey | All vehicle entries (Albatros 1.0–XIII, 2011–2025) — year, name, event(s), rankings, awards, photo, as a timeline | Must-have |
| Team | Member list grouped by year/sub-team | Must-have |
| Gallery | Build/event photo grid with lightbox | Must-have |
| Sponsors | Logos, tiers if applicable | Must-have |
| Contact | Form with inquiry-type field (Sponsorship / Joining the team / Other), address, socials | Must-have |
| Blog | Optional — fold existing posts into Journey instead unless explicitly requested | Nice-to-have |

### 3.2 Content Migration

- All text and images from `teamredbaron.com` must be extracted and structured (JSON/MDX) before build begins
- 301 redirects from old WP URL paths (`/our-journey/`, `/team/`, `/our-sponsors/`, `/photos/`, etc.) to new equivalent paths — required for SEO continuity
- Existing domain (`teamredbaron.com`) is repointed via DNS to Vercel — no new domain purchase needed

### 3.3 Interactivity / Animation

- Scroll-triggered reveals (Framer Motion)
- Animated hero section (Aceternity "Hero Highlight" or similar)
- Animated stat counters (Magic UI "Number Ticker")
- Sponsor logo marquee (Magic UI "Marquee")
- Timeline component for Our Journey (Aceternity "Timeline")
- **Additional animated components — pending `animationcomponents.md` (source: reactbits.dev)**

### 3.4 Forms

- Contact form: name, email, inquiry type, message
- Client-side validation (react-hook-form + zod)
- Server-side handling via Next.js API route → email delivery (Nodemailer/Resend)

---

## 4. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Cost | ₹0 — free tier tools/services only |
| Performance | Lighthouse performance score ≥ 90 on mobile |
| Responsiveness | Fully responsive — mobile, tablet, desktop |
| SEO | Meta tags, sitemap.xml, robots.txt, preserved rankings via redirects |
| Accessibility | Reasonable contrast, alt text on images, keyboard-navigable nav |
| Browser support | Latest Chrome, Firefox, Safari, Edge |
| Hosting uptime | Vercel free tier SLA (best-effort) |

---

## 5. Design (pending)

Design direction, color theme, typography, and layout specifics will be defined in `design.md` (to be provided). This PRD will be updated to reference the finalized design system once received.

## 6. Animated Components (pending)

Specific component selections and implementation notes from [reactbits.dev](https://reactbits.dev/get-started/index) will be documented in `animationcomponents.md` (to be provided). This PRD's Section 3.3 will be expanded with the finalized component list once received.

---

## 7. Build Plan Summary

| Step | Task | Days |
|---|---|---|
| 0 | Setup (repo, Vercel, Antigravity scaffold) | 0.5 |
| 1 | Content extraction from teamredbaron.com | 2–3 |
| 2 | Layout shell (nav, footer) | 1 |
| 3 | Home page | 1.5–2 |
| 4 | Our Journey timeline | 3–4 |
| 5 | Team page | 1–1.5 |
| 6 | Gallery | 1.5–2 |
| 7 | Sponsors page | 1 |
| 8 | Contact page | 1 |
| 9 | SEO + redirects + QA | 2 |
| 10 | Deploy | 0.5 |

**Total: ~15–18 working days (4–5 weeks part-time, solo)**

---

## 8. Open Items / Change Log

| Item | Status |
|---|---|
| `design.md` (color theme, style) | Pending |
| `animationcomponents.md` (react-bits selections) | Pending |
| Cloudinary usage ceiling check (if gallery grows large) | Deferred, monitor post-launch |

*This document will be revised in place as pending inputs arrive — version number will increment with each substantive update.*
