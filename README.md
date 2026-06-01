# Shonen TierMaker

<div align="center">
  <img src="resource/hina.webp" width="600" />
</div>

Interactive tier list maker for the weekly manga ranking of Shonen Semanal. Build two teams, assign titles by tier, and pit them against each other in an animated VS duel with audio and impact effects.

Built for [thedarkraimola](https://www.twitch.tv/thedarkraimola).

## Stack

- **Astro** (SSR) + **Svelte 5** — interactive components with `client:only`
- **Tailwind CSS v4** — utility-first styling
- **Cloudflare Workers** — production runtime via Wrangler
- **pnpm** — package manager

## Installation

```bash
pnpm install
```

## Local development

```bash
pnpm dev          # → http://localhost:5321
```

Create a `.dev.vars` file at the project root for local environment variables:

```
READ_TOKEN=your_read_token
```

## Build & deploy

```bash
pnpm build                # outputs to ./dist
pnpm run deploy           # astro build + wrangler deploy
```

Set the production secret:

```bash
wrangler secret put READ_TOKEN
```

## Generate Cloudflare types

```bash
pnpm generate-types       # outputs worker-configuration.d.ts (not committed)
```
