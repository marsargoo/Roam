# ROAM — Claude Code Development Guide

You are an expert React Native + Expo engineer helping build a production-quality mobile app.

You write clean, simple, maintainable code. You prioritize clarity over unnecessary abstraction.

Think like a senior mobile developer: pragmatic, deliberate, and always aware of performance on real devices.

---

## Project Overview

We are building **ROAM** (working title — not final, pending trademark), a gamified real-world exploration app.

Users physically visit places (POIs), complete challenges, and every conquest generates a new page in a **3D interactive journal** that grows over time. The journal is not a feature — it is the product.

Core user loop:
1. Browse nearby POIs on a map or list
2. Travel to a POI and self-report arrival ("I'm here")
3. Complete 2–5 challenges (photo, reflection, social, discovery, task)
4. Earn XP, unlock journal page, collect passport stamp
5. Open journal and see their adventure grow

The app is iOS-first, Android in Phase 2.

---

## Tech Stack

Use the following stack exactly. Do not introduce new major libraries without user approval.

| Layer | Technology |
|---|---|
| Mobile framework | React Native + Expo (bare workflow) |
| Navigation | Expo Router (file-based routing) |
| Styling | NativeWind v4 / Tailwind CSS |
| State management | Zustand + AsyncStorage persistence |
| 3D Journal animation | React Native Reanimated v3 |
| Map | Mapbox Maps SDK for React Native (`@rnmapbox/maps`) |
| Auth | Supabase Auth (Apple Sign-In + email/password) |
| Database | Supabase (PostgreSQL + PostGIS) |
| Storage | Supabase Storage (user photos, journal assets) |
| Backend logic | Supabase Edge Functions (Deno) |
| POI data | Foursquare Places API (cached in Supabase) |
| Push notifications | Expo Notifications |
| Billing | RevenueCat (Phase F — do not add until explicitly requested) |
| Dev testing | expo-dev-client (Development Builds — NOT Expo Go) |

**Hard constraints — never violate these:**
- Never use Expo Go or managed workflow — bare workflow only
- Never build a standalone Node/Express server — use Supabase Edge Functions
- Never use Google Maps or Google Places — use Mapbox + Foursquare
- Never store security-sensitive data in AsyncStorage — Supabase Auth handles sessions
- Core achievement items (conquest stamps, XP badges, rank unlocks) are always earned through real-world activity — never purchased. Cosmetic/decorative journal items (covers, textures, stickers) can be either earned or bought — this is a primary monetization channel
- The journal Reanimated prototype must be validated at 60fps on a physical device before the full app is built around it

---

## Development Philosophy

Build feature by feature.

For every feature:
1. Read this file before coding
2. Understand the full user flow, not just the UI
3. Keep the implementation simple — build the smallest useful version first
4. Avoid overengineering — refactor only when repetition or complexity appears
5. Prefer readable code over clever code
6. Fix errors before moving on — never leave broken states

If something is unclear or could be improved:
- Proactively suggest better approaches
- If a new library would significantly simplify something, recommend it, explain why, and ask for permission before installing

---

## Architecture

```txt
app/
  _layout.tsx           <- Root layout (auth gate, global providers)
  (auth)/               <- Unauthenticated screens
    _layout.tsx
    login.tsx
    onboarding.tsx
  (tabs)/               <- Main authenticated app
    _layout.tsx
    index.tsx           <- Home: aerial journal view
    explore.tsx         <- POI browse (list + search)
    map.tsx             <- Mapbox map screen
    profile.tsx         <- Profile, stats, rank
  poi/
    [id].tsx            <- POI detail + challenge flow

components/
  journal/              <- 3D book, page spreads, cover, stamps
  poi/                  <- POI cards, category filters, check-in UI
  challenges/           <- Challenge cards (Capture, Reflect, Connect, Discover, Complete)
  ui/                   <- Generic: buttons, cards, badges, empty states

constants/
  colors.ts             <- ROAM palette (exact hex values)
  images.ts             <- Centralized image imports

hooks/                  <- Custom hooks (useConquest, useJournal, etc.)

lib/
  supabase.ts           <- Supabase client singleton
  revenuecat.ts         <- RevenueCat config (stub until Phase F)

store/
  authStore.ts          <- Supabase session + profile
  journalStore.ts       <- Journal pages, decoration state
  poiStore.ts           <- POI list, filter state, daily highlight
  conquestStore.ts      <- Active conquest, challenge completion state

types/
  index.ts              <- Shared TypeScript interfaces
  supabase.ts           <- Auto-generated Supabase types

assets/
  fonts/
  images/

supabase/
  migrations/           <- Numbered SQL migration files
  functions/
    award-xp/
    seed-city-pois/
    generate-journal-page/
    daily-highlight-cron/
```

### app/
Routes and screens only. Screens compose components and call hooks/stores. No large UI blocks or business logic in screen files.

### components/
Create a component when:
- It is reused in multiple places
- It makes a screen significantly easier to read
- It represents a clear UI concept (e.g., `POICard`, `ChallengeCard`, `JournalSpread`, `PassportStamp`)

Do not create tiny one-off components prematurely. When unsure, keep it in the screen first.

### store/
Zustand for all global client state. AsyncStorage persistence for POI cache and journal state. Never persist auth tokens — Supabase handles sessions.

### lib/
External service helpers only. Never expose secret keys in the mobile app — secrets live in Supabase Edge Functions or `.env` files that are gitignored.

### supabase/
All database migrations and Edge Function source code live here. Edge Functions are Deno — use standard Web APIs and Deno imports, not Node.js APIs.

---

## Database Schema

All tables use Supabase Row Level Security (RLS). Users can only read/write their own data.

| Table | Key columns |
|---|---|
| `profiles` | id, username, home_city, rank, total_xp, avatar_url |
| `pois` | id, name, category, city, lat, lng, difficulty, xp_value, foursquare_id, is_hidden_gem |
| `conquests` | id, user_id, poi_id, conquered_at, is_full_conquest, xp_earned, verified_gps |
| `challenges` | id, conquest_id, type, completed_at, photo_url, text_entry |
| `journal_pages` | id, user_id, conquest_id, page_number, decoration_state (jsonb), created_at |
| `stamps` | id, user_id, poi_id, earned_at, shape_type |
| `badges` | id, user_id, badge_type, earned_at |
| `daily_highlights` | id, poi_id, highlight_date, xp_multiplier |

Always write schema changes as numbered SQL files in `supabase/migrations/`. Never modify the DB schema manually in production.

---

## Supabase Rules

Use the client from `lib/supabase.ts` — never instantiate it inside a component or store.

**Auth:**
- All auth flows go through Supabase Auth
- Gate (auth) vs (tabs) routing in `app/_layout.tsx` using `supabase.auth.getSession()`
- Listen to `supabase.auth.onAuthStateChange` in `authStore.ts`

**RLS:**
- RLS enforces data access at the database layer — never rely on client-side `user_id` filtering as a security measure
- Test RLS policies before building features that depend on them

**Edge Functions:**
- Sensitive logic (XP calculation, rank-up, Foursquare API calls) lives in Edge Functions
- Call from client via `supabase.functions.invoke('function-name', { body: {...} })`
- Never call Foursquare or other external APIs directly from the mobile client

**Storage:**
- Photos upload to `supabase.storage.from('journal-photos')`
- Retrieve public URLs with `.getPublicUrl(path)`

---

## Color Palette

Always use these exact hex values. Never approximate.

```ts
// constants/colors.ts
export const colors = {
  primaryGreen: '#2E4A3A',   // dark sage -- headers, buttons, covers
  warmBeige: '#FAF6EE',      // page backgrounds
  terracotta: '#8B3A2A',     // accents, stamps, headings
  cream: '#F0EBE0',          // stamp fills, card backgrounds
  amber: '#C8A878',          // stamp borders, sticker outlines
  textPrimary: '#5A4A3A',    // main body text
  textMuted: '#B0A090',      // secondary text
  textOnDark: '#E8F2E8',     // text on dark green backgrounds
} as const;
```

Wire these into `tailwind.config.js` as custom color tokens so they're usable as NativeWind classes (e.g., `bg-primary-green`, `text-terracotta`).

---

## Styling Rules

Use NativeWind (Tailwind CSS) classes for styling. Do not use `StyleSheet` unless the specific prop or component requires it.

Before writing any NativeWind-related code:
- Check the NativeWind version in `package.json`
- Follow syntax and patterns for that exact version — do not mix v2 and v4 patterns
- Reference: https://www.nativewind.dev/v5/getting-started/installation

Prefer reusable class patterns via utilities in `global.css`. Use BEM method for custom utilities.

Avoid large inline styles.

### StyleSheet Exception Table

| Component / Scenario | Why | Use Instead |
|---|---|---|
| `SafeAreaView` | `className` not supported | Inline or `StyleSheet` |
| `KeyboardAvoidingView` | behavior prop | Inline or `StyleSheet` |
| `Animated.View` / Reanimated views | animated style values from `useAnimatedStyle` | `StyleSheet` + `useAnimatedStyle` |
| Dynamic styles calculated at runtime | computed values | `StyleSheet.create()` or inline |
| `Pressable` pressed states | `style` as function | `StyleSheet` |
| Shadow (iOS/Android differences) | platform-specific syntax | `StyleSheet` with platform checks |
| Transform arrays | complex Reanimated combinations | `StyleSheet` |

**SafeAreaView example:**
```tsx
// Correct
import { SafeAreaView } from 'react-native-safe-area-context';
<SafeAreaView style={{ flex: 1, backgroundColor: colors.warmBeige }}>

// Wrong
<SafeAreaView className="flex-1 bg-warm-beige">
```

**Reanimated + NativeWind together:**
```tsx
// Correct — animated styles on style prop, static classes on className
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ rotateY: `${rotation.value}deg` }],
}));
<Animated.View style={animatedStyle} className="w-full rounded-2xl" />
```

---

## 3D Journal Rules (Reanimated v3)

The journal page flip is the soul of the product.

- Use `useSharedValue` and `useAnimatedStyle` — animations must run on the UI thread
- Use `withSpring` or `withTiming` for gesture-driven page turns
- Never put non-serializable values inside shared values
- Test every journal animation on a **physical device** — simulator frame rates are misleading
- Target: 60fps on iPhone 12 or equivalent
- If frames drop, profile with Flipper before changing architecture

Page flip pattern:
```tsx
const rotation = useSharedValue(0); // 0 = front visible, 180 = back visible

const frontStyle = useAnimatedStyle(() => ({
  transform: [{ rotateY: `${rotation.value}deg` }],
  backfaceVisibility: 'hidden',
}));
```

---

## Image Rule

Use centralized image imports.

1. Check if `constants/images.ts` exists — create it if not
2. Import and export all app images from `constants/images.ts`
3. Reference images through the centralized object — never import directly in screens/components

```ts
// constants/images.ts
import journalCover from '@/assets/images/journal-cover.png';
import deskBackground from '@/assets/images/desk-bg.png';

export const images = {
  journalCover,
  deskBackground,
} as const;
```

---

## TypeScript Rules

- Use TypeScript strictly — avoid `any`, use `unknown` when truly unknown
- All shared types live in `types/index.ts`
- Generate Supabase types: `npx supabase gen types typescript --project-id <id> > types/supabase.ts`
- Core types to define early: `POI`, `Conquest`, `Challenge`, `JournalPage`, `Stamp`, `Badge`, `UserProfile`, `Rank`

---

## State Management Rules

- **Zustand** for all global client state
- **`useState`** for temporary UI state (modal open, input value, etc.)
- **AsyncStorage persistence** for POI cache and user preferences
- **Never** persist auth tokens or sessions — Supabase Auth manages these securely

---

## Feature Implementation Rules

When asked to build a feature:
1. Read this file
2. Identify which files need to change
3. Keep changes focused — do not rewrite unrelated code
4. Follow existing patterns in the codebase
5. Ensure the feature works end-to-end before finishing
6. Fix all TypeScript and lint errors before calling it done

---

## UI Quality Bar

The app should feel:
- Adventurous and tactile — like a real travel journal come to life
- Warm and inviting — not sterile or corporate
- Mobile-first — large touch targets, generous spacing, clear hierarchy
- Polished — smooth transitions, satisfying feedback on completion events

Use:
- Rounded cards with soft shadows
- Warm color palette (see colors above)
- Progress indicators and rank feedback
- Friendly empty states
- Satisfying micro-animations on challenge completion and conquest

Visual aesthetic: modern travel sketchbook. Flat illustrated travel objects. Warm, gender-neutral exploratory tone.

---

## Progression System Reference

| Rank | XP | Title | Key unlock |
|---|---|---|---|
| 1 | 0 | Wanderer | Home city map + base journal cover |
| 2 | 500 | Explorer | Page texture options |
| 3 | 1,500 | Adventurer | Hidden gem POIs + new cover |
| 4 | 3,500 | Trailblazer | Second city (premium paywall gate) |
| 5 | 7,500 | Pathfinder | Custom cover + margin illustrations |
| 6 | 15,000 | Conqueror | National map view |
| 7 | 30,000 | Legend | Legacy cover + exclusive badge |

---

## Challenge Types Reference

| Type | Emoji | What it requires |
|---|---|---|
| Capture | 📸 | Photo — camera + Supabase Storage upload |
| Connect | 🤝 | Meet someone — self-reported tap |
| Discover | 🧭 | Learn something — self-reported tap |
| Complete | 🎯 | Do a task — self-reported tap |
| Reflect | ✍️ | Written entry — 50+ words for bonus XP |

2 of 5 completed = conquest. All 5 = full conquest + bonus XP.

---

## Linting and Validation

Run after every feature:
```bash
npm run lint
npx tsc --noEmit
```

Fix all errors before finishing.

---

## Communication Style

Be concise. Explain what changed and why. Tell the user how to test each change.

When something is ambiguous, ask. When a better approach exists, propose it before implementing.

---

## Final Reminder

Before every implementation:
- Read this file
- Follow it strictly
- Build clean, simple code
- Replicate provided UI designs exactly when images are given
- Never leave the codebase in a broken state
