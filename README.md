# Generic CMS

A cross-platform, mobile-first headless content management system built with Expo and React Native. Connects to a distributed microservices backend and provides a full-featured UI for managing organizations, content, media, users, and more.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Features](#features)
  - [Authentication & Security](#authentication--security)
  - [Organizations](#organizations)
  - [Content Management](#content-management)
  - [Taxonomy (Categories & Tags)](#taxonomy-categories--tags)
  - [Media / Asset Library](#media--asset-library)
  - [API Key Management](#api-key-management)
  - [User & Role Management](#user--role-management)
  - [Organization Members](#organization-members)
  - [Notifications](#notifications)
  - [Profile & Account](#profile--account)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Building & Deployment](#building--deployment)
- [CI/CD](#cicd)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.85 + Expo 56 |
| Language | TypeScript 6 |
| Routing | Expo Router (file-based) |
| Styling | NativeWind 4 (Tailwind CSS for RN) + StyleSheet |
| Animations | React Native Reanimated |
| Gestures | React Native Gesture Handler |
| Secure storage | expo-secure-store |
| Persistent cache | AsyncStorage |
| Real-time | Microsoft SignalR |
| Auth | JWT + refresh token rotation |
| Image handling | expo-image, expo-image-picker |
| Date/time | @react-native-community/datetimepicker |
| Token decoding | jwt-decode |
| Clipboard | expo-clipboard |

---

## Project Structure

```
generic-cms/
├── src/
│   ├── app/                        # Expo Router screens & layouts
│   │   ├── (auth)/                 # Unauthenticated flow
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── two-factor.tsx
│   │   ├── (app)/                  # Authenticated flow
│   │   │   ├── [orgId]/            # Per-organisation screens
│   │   │   │   ├── index.tsx       # Org dashboard
│   │   │   │   ├── entry/
│   │   │   │   │   └── [entryId].tsx  # Content editor
│   │   │   │   └── settings/       # Members, API keys, org config
│   │   │   └── profile/            # User profile & account settings
│   │   └── index.tsx               # Root entry / redirect
│   ├── components/                 # Reusable UI components
│   │   ├── content/                # Entry list, editor, filters
│   │   ├── media/                  # Asset gallery, uploader
│   │   ├── keys/                   # API key management UI
│   │   ├── organisations/          # Org cards, create form
│   │   ├── layout/                 # Navigation shell, tab bars
│   │   └── ui/                     # Primitive components (Button, Input, Toast…)
│   ├── services/                   # API service layer
│   │   ├── authService.ts
│   │   ├── contentService.ts
│   │   ├── assetService.ts
│   │   ├── organisationService.ts
│   │   ├── userService.ts
│   │   ├── roleService.ts
│   │   ├── notificationService.ts
│   │   ├── memberService.ts
│   │   └── apiKeyService.ts
│   ├── viewmodels/                 # Business logic hooks (27 hooks)
│   ├── types/                      # TypeScript interfaces
│   ├── styles/                     # Shared stylesheet definitions
│   ├── utils/                      # auth helpers, cache, toast, notifications
│   ├── hooks/                      # Generic custom hooks
│   └── constants/                  # Design system tokens (colors, spacing)
├── assets/                         # Icons and splash screens
├── android/                        # Gradle configuration
├── .github/workflows/              # GitHub Actions CI
├── app.json                        # Expo app configuration
├── eas.json                        # EAS Build configuration
└── tsconfig.json
```

---

## Architecture

### Routing

Expo Router provides file-based routing. Two route groups separate concerns:

- `(auth)/` — login, register, two-factor. Shown when the user is not authenticated.
- `(app)/` — all authenticated screens. The root redirects based on auth state.

Dynamic segments handle runtime IDs:
- `[orgId]` — switches context to a specific organisation
- `[entryId]` — opens a specific content entry in the editor

### ViewModel Pattern

Business logic lives in 27 custom hooks under `src/viewmodels/`. Components import these hooks and own only presentation state. This keeps screens thin and logic testable in isolation.

```
Component → useXxxViewModel() → Service → Backend API
```

### Layered API Abstraction

A central `executeApiRequest()` utility handles:
- Attaching JWT bearer tokens
- Checking token expiration before every request
- Silently refreshing tokens using the refresh token
- Returning typed responses or throwing on error

Each microservice has its own service module (`contentService.ts`, `assetService.ts`, …) that calls `executeApiRequest()` against the appropriate base URL.

### Caching

A hybrid cache (`utils/cache.ts`) keeps data in memory for the session lifetime and persists to AsyncStorage across app restarts. Reads use a stale-while-revalidate pattern — the cached value is returned immediately while a background fetch updates the store.

---

## Features

### Authentication & Security

**Screens:** `(auth)/login.tsx`, `(auth)/register.tsx`, `(auth)/two-factor.tsx`

- Email + password login and registration
- JWT access token + refresh token stored in `expo-secure-store`
- Automatic silent token refresh before expiration on every API call
- Two-factor authentication (TOTP):
  - Setup flow generates a QR code / secret for an authenticator app
  - Verify screen accepts the 6-digit code on login
  - Disable 2FA from account settings
- 2FA verification state tracked in module-level state so the session survives navigation

**Flow:**
1. User submits credentials → backend returns JWT, refresh token, and optional `twoFactorId`
2. If `twoFactorId` is present, user is routed to the 2FA verification screen
3. Verified JWT stored; user lands on the organisations list
4. Logout clears secure store, AsyncStorage cache, and 2FA state

---

### Organizations

**Screen:** `(app)/[orgId]/index.tsx`

- List all organisations the user belongs to, with pagination
- Create new organisations
- Delete organisations (admin only)
- Switching organisation updates the `[orgId]` route segment and loads org-scoped data

---

### Content Management

**Screens:** `(app)/[orgId]/index.tsx` (list), `(app)/[orgId]/entry/[entryId].tsx` (editor)

Full CRUD for content entries within an organisation:

| Feature | Detail |
|---|---|
| Create entry | Title, slug (auto-generated), body, category, tags, status |
| Edit entry | Rich text editing, all fields editable |
| Delete entry | Soft or hard delete depending on status |
| Entry statuses | New, Draft, Published, Unpublished |
| Auto-save | Entry editor saves automatically after idle period |
| Filtering | By status, category, tags, date range, full-text search |
| Pagination | Server-side pagination on the entry list |
| Author tracking | Creator profile stored and displayed |

---

### Taxonomy (Categories & Tags)

**Accessed via:** Org dashboard taxonomy tabs

- **Categories:** Create, list, update, delete — each with a name and optional description. Entries are associated with one category.
- **Tags:** Create, list, update, delete. Multiple tags can be applied to an entry for cross-cutting organisation.

---

### Media / Asset Library

**Component group:** `src/components/media/`

- Upload images and arbitrary files via `expo-image-picker`
- Image gallery with thumbnail previews using `expo-image`
- Detect image vs. non-image asset types
- Attach metadata tags to assets
- Delete assets
- Scoped per entry or global to the organisation
- Paginated asset list

---

### API Key Management

**Screen:** `(app)/[orgId]/settings/`

API keys allow external systems to access the organisation's content via the backend REST API.

- Generate a new key with an optional expiration date
- Activate or deactivate a key without deleting it
- Reveal and copy the key secret to clipboard
- Delete keys
- Paginated key list

---

### User & Role Management

**Accessed via:** Profile → Admin section (admin users only)

- List all platform users with search and pagination
- View individual user profiles
- Bulk delete users
- Create and manage platform-wide roles
- Assign or remove roles from users

---

### Organization Members

**Screen:** `(app)/[orgId]/settings/` members tab

- List organisation members with their roles
- Add a member by email lookup
- Update a member's role (Admin / Editor / Viewer)
- Remove a member from the organisation
- View member public profiles

---

### Notifications

**Utility:** `src/utils/notifications.ts`, SignalR hub

- Real-time push via a SignalR WebSocket connection established on login
- Notification bell icon in the navigation header with an unread badge count
- Notification list screen with pagination
- Mark individual notifications as read
- Unread count refreshed on focus and via real-time events

---

### Profile & Account

**Screen group:** `(app)/profile/`

- Edit display name, bio, timezone, phone number
- Upload and preview avatar image
- Change email address
- Change username
- Change password
- Enable / disable 2FA
- JWT role extraction used throughout the app to gate admin-only UI

---

## State Management

No global state library is used. State is managed at three levels:

1. **Component state** — `useState` / `useReducer` for UI-local values (form inputs, modal visibility, loading flags)
2. **ViewModel hooks** — fetch, transform, and expose data to screens; encapsulate side effects with `useEffect`
3. **Module-level singletons** — used sparingly for cross-navigation state (2FA verification flag, SignalR connection instance)

---

## API Integration

The app talks to several independently deployed microservices:

| Service | Responsibility |
|---|---|
| Auth service | Login, register, token refresh, 2FA |
| Organisation service | Org CRUD, member management |
| Content service | Entry CRUD, taxonomy |
| Asset service | File upload, asset library |
| User service | User profiles, admin user management |
| Role service | Role definitions and assignment |
| Notification service | Notification delivery and read state |
| API key service | Key generation and lifecycle |

All HTTP calls go through `executeApiRequest()` which attaches the Authorization header, handles 401 → refresh → retry, and normalises error responses.

---

## Environment Variables

Create a `.env.local` file (gitignored) to override service endpoints:

```env
EXPO_PUBLIC_API_URL=https://user.jonfjz.dev/api
EXPO_PUBLIC_ORG_API_URL=https://organisations.jonfjz.dev
EXPO_PUBLIC_CONTENT_API_URL=https://content.jonfjz.dev
EXPO_PUBLIC_ASSET_API_URL=https://nest.jonfjz.dev
```

All variables must be prefixed with `EXPO_PUBLIC_` to be bundled into the client.

---

## Getting Started

**Prerequisites:** Node.js 20+, npm, and either an Android emulator or a physical device.

```bash
# Install dependencies
npm install

# Start the dev server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Lint
npm run lint
```

Expo Router uses file-based routing. Edit files inside `src/app/` and the app hot-reloads automatically.

**TypeScript path aliases** are configured so imports use `@/` instead of relative paths:

```ts
import { executeApiRequest } from '@/utils/auth'
import { useContentViewModel } from '@/viewmodels/useContentViewModel'
```

---

## Building & Deployment

Builds are managed by [EAS Build](https://docs.expo.dev/build/introduction/).

```bash
# Install EAS CLI
npm install -g eas-cli

# Build a preview APK for Android
eas build --profile preview --platform android
```

The `eas.json` `preview` profile outputs an `.apk` directly (not an `.aab`), making it easy to sideload on devices without going through the Play Store.

---

## CI/CD

A GitHub Actions workflow (`.github/workflows/release-apk.yml`) builds and releases an APK on every push to `main` or `master`:

1. Check out code
2. Set up Node.js 20 with npm cache
3. `npm ci`
4. Build APK via EAS CLI (uses the `EXPO_TOKEN` repository secret)
5. Create a GitHub Release tagged `v{run_number}` and attach the APK as a release asset

To enable this, add your `EXPO_TOKEN` as a GitHub Actions secret in the repository settings.
