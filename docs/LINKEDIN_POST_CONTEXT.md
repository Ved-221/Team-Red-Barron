# Context & Prompt Guide for Claude — Drafting Ved's LinkedIn Post

You can copy-paste the prompt and context below directly into Claude to generate high-performing, authentic LinkedIn posts about your work with Team Red Baron.

---

```markdown
Hi Claude,

I recently architected, designed, and built the official modern web platform for Team Red Baron (PCCOE's premier collegiate off-road BAJA SAE racing team), live at https://www.teamredbaron.in.

I want to share this achievement on LinkedIn to highlight my engineering depth, design sensibility, problem-solving skills, and my experience collaborating with a high-performance student racing team.

Please draft 3 variations of an engaging LinkedIn post based on the context below:
1. Variation 1: The Engineering & Architecture Deep-Dive (focusing on Next.js 16, Supabase CMS, 3D WebGL, and edge caching under quota constraints).
2. Variation 2: The Leadership & Product Story (focusing on stakeholder collaboration, transforming legacy systems, and empowering the team with their own CMS).
3. Variation 3: Punchy & High-Impact (fast-paced, visual, hook-driven, highlighting key numbers and before/after metrics).

---

### Core Context & Story Points

1. WHO AM I & WHO IS THE CLIENT:
- Developer: Ved Dhapodkar (Full-Stack Developer / Solo Architect).
- Client: Team Red Baron (Official Collegiate Motorsports Team of PCCOE, Pune). They design, build, and race electric & combustion All-Terrain Vehicles (ATVs) at national/international BAJA SAE competitions.

2. THE CHALLENGE:
- Their legacy website was an outdated, sluggish WordPress site that didn't reflect the speed, precision, and championship prestige of their ATVs.
- The team needed a platform to attract corporate sponsors, recruit top engineering talent, and showcase 14+ years of vehicle history (Albatros 1.0 to XIV).
- Zero-budget constraint: Had to deliver a tier-1, 60fps experience entirely on free-tier cloud infrastructure without recurring hosting fees.

3. HOW I COORDINATED WITH TEAM RED BARON:
- Worked closely with Faculty Advisor (Dr. Ummid Shaikh) and team leads across Powertrain, Vehicle Dynamics, Electronics, and Rollcage.
- Gathered, structured, and archived 14 generations of vehicle specs, competition rankings, and telemetry data.
- Built workflows with the media division to process 30+ team member cutouts, historical race galleries, and sponsor decks.
- Ran iterative design and responsive feedback sprints directly with team members to perfect mobile ergonomics and layout.

4. TECHNICAL FEATS & INNOVATIONS:
- Framework: Next.js 16 (App Router + React 19 + Turbopack).
- 3D WebGL with Mobile Gyroscope: Modeled an interactive 3D Red Baron emblem using Three.js/WebGL that tracks mouse physics on desktop AND uses smartphone DeviceOrientation (gyroscope) to tilt realistically when users tilt their phones.
- Custom Supabase Admin Panel: Built a full CMS from scratch with auth, vehicle spec management, roster seasons, gallery albums, and a two-stage soft delete / trash recovery system so non-technical members can update everything.
- Zero-Egress Edge Caching Hack: Right before launch, Supabase cached egress reached 80% quota. Instead of paying or risking downtime, I engineered a zero-egress edge media caching layer (`toLocalMediaUrl`) mirroring 125+ assets to Vercel's global Edge CDN, cutting live visitor egress to 0 bytes with sub-second speeds.
- Creative Micro-Interactions: WebGL melt-shader MorphSlider for the "Off the Map" team expedition, Warp typography, gooey navigation, and ambient glassmorphism (Mach-Red Kinetic theme: Pitch Black #000000 and Race Red #DE1615).

5. OUTCOME & IMPACT:
- Replaced slow WordPress (4.8s load time) with a sub-800ms, Lighthouse 95+ performance site.
- Live at: https://www.teamredbaron.in
- Zero cash infrastructure cost.
- Handed over a turnkey platform the team can manage for years to come.
```
