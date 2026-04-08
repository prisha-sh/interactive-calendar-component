# 📅 Editorial Calendar Component

A highly polished, interactive, and production-ready calendar component built with Next.js, React, Tailwind CSS, & date-fns. 
Designed strictly with a modern editorial wall-calendar aesthetic focusing heavily on fluid UX and subtle micro-interactions.

## 🌟 Key Features

- **Editorial UI Layout:** Clean, maximalist hero typography merged with a highly structured split-content layout mirroring physical wall calendars.
- **Smart Adaptive Theming:** The calendar dynamically parses the active hero image (changes per month natively) and mathematically extracts the prominent color scheme to intelligently dye the component controls in sync with the current season aesthetic via `.getColor()`.
- **Airbnb-tier Range Selection:** Features precise date-range selection with live hover-ahead trails, soft edge bounding, and unified gradient backdrops mapping precisely to Date intervals.
- **Persistent Memos & JSON Export:** Write customized notes for specific individual dates or ranges. Stored natively via browser `localStorage` complete with contextual bubble indicators bridging your interface and memory seamlessly. Supports 1-click **Export to JSON**.
- **Framer Motion Micro-interactions:** Buttery smooth 60fps animations tied to route/month snapping, selection pop-ins, layout rendering shifts, and date hover scaling.
- **Flawless Responsiveness:** Auto-collapses strictly from an expanded side-by-side deskview split into a fully vertically stacked touchscreen interface flawlessly without sacrificing functional bounds.
- **Night-Owl Dark Mode:** Zero-flash transition from brilliant paper-white to deep-slate dark styling utilizing tailwind abstractions.

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Library:** React 18
- **Styling:** Tailwind CSS V3
- **Animations:** Framer Motion
- **Date Math:** date-fns
- **Icons:** Lucide React
- **Color Extraction:** colorthief

## 🚀 How to Run

Because this project uses advanced tooling inside highly isolated dependencies natively locally, please use the following commands directly inside the root directory to boot the local testing environment:

```bash
# 1. Install standard dependencies natively
npm install

# 2. Boot the development compilation server
npm run dev
```

Navigate cleanly to [http://localhost:3000](http://localhost:3000) or whichever local port opens to view it!

---
*Built focusing obsessively on beautiful product sense architecture.*
