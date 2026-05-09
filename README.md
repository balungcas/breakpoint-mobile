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

## Supabase configuration

Set these variables to point the mobile app at the same Supabase project as the web app:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

If they are not set, the app uses a small local fallback catalog so the UI remains runnable.

## Validation

```bash
npm run typecheck
```
