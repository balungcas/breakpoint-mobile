# Breakpoint Mobile

React Native mobile app for Breakpoint, built with Expo and TypeScript. This app mirrors the public web app at `balungcas/breakpointpodcast` as a mobile-first detective console for interactive cyber-safety cases.

## Features

- Detective Console home screen with featured case, continue listening, daily drill, and mini player
- Case Library with search, bookmarks, flashcards, and mastered-card tracking
- Case detail screen with source-style cover, bookmark, play/share actions, checkpoints, invite, and guest XP completion
- Daily Drills with scam/safe decisions, feedback, progress, and guest XP
- Vault with dossiers, mission unlock flow, mission quiz modal, and local completion tracking
- Profile dossier with guest rank, mission log, trophy badges, and cloud-save prompt
- Supabase REST fetchers for the same public tables used by the web app, with local fallback data for development

## Getting started

```bash
npm install
npm run start
```

Then open the app in Expo Go, an iOS simulator, or an Android emulator.

When running from a cloud VM or any machine that is not on the same local network as your phone, use tunnel mode:

```bash
npm run start:tunnel
```

Expo Go must scan the tunnel QR / `exp.direct` URL. The normal `localhost` web URL is only reachable inside the machine that is running Metro.

## Supabase configuration

The app is preconfigured with the same Supabase project and publishable anon key used by the web app. For local overrides, copy `.env.example` to `.env` and set the Expo public names:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

The mobile fetcher also accepts the web app names (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_PUBLISHABLE_KEY`). If Supabase is unreachable, the app uses a small local fallback catalog so the UI remains runnable.

## Validation

```bash
npm run typecheck
```
