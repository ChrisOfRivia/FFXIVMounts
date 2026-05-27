# FFXIV Mount Tracker

A fan-made React + Vite project for browsing, filtering, and tracking mounts from Final Fantasy XIV.

This app pulls mount data from the public [FFXIV Collect](https://ffxivcollect.com/) API and presents it in a more browseable tracker-style interface with filtering, source links, favorites, and character-based ownership syncing.

## What It Does

- Fetches live mount data from FFXIV Collect
- Displays mount artwork, source details, patch/expansion info, and ownership counts
- Filters mounts by source type and expansion
- Lets you favorite mounts for quicker browsing
- Opens a detailed modal view for each mount
- Links users to relevant external sources when available
- Supports character sync so owned and missing mounts can be highlighted in the UI

## Current Features

- Dynamic API-driven mount list
- Search by mount name or source text
- Source-type filtering
- Expansion filtering from ARR through Dawntrail
- Compact sticky filter sidebar
- Favorites system stored locally
- Character search and sync integration
- Owned / missing collection filtering after sync
- Mount detail modal with richer information
- Responsive layout for desktop and mobile

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- FFXIV Collect API

## Character Sync

Character sync is handled through local API-style middleware in development/preview and uses FFXIV Collect character data to:

- search for characters by name, world, and data center
- refresh character data when possible
- retrieve owned mount data
- compare synced ownership against the mount list in the app

## Running Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build locally:

```bash
npm run preview
```

## Project Notes

- This is a personal hobby project built for learning, experimentation, and portfolio growth.
- The UI and data handling are still evolving.
- Some source linking is direct, while some links are inferred from available source data.

## Disclaimer

This is a non-commercial fan-made project.

Final Fantasy XIV and all related names, media, and assets belong to Square Enix.

Mount data is provided through the public [FFXIV Collect](https://ffxivcollect.com/) service.

## Future Ideas

- More UI/UX polish
- Additional sorting and collection tools
- Better progress tracking views
- More refined mobile interactions
