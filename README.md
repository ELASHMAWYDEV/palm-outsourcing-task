# Health Check-In App

A simple daily health tracking app where users can log their mood, energy levels, and daily notes.

## Setup

**Frontend (React Native)**

```bash
cd app
npm install
npx expo start
```

**Backend (Express Server)**

```bash
cd server
npm install
npm run dev
```

**Important Note When Running**

- Make sure to change the `EXPO_PUBLIC_API_URL` in `.env` file inside `/app` to your machine ip address, ex: `http://192.168.1.195:3001/api` as `http://localhost:3001/api` won't work at most cases

- Make sure to run the Backend first to avoid unusual experiences with the app
-

## Tech Stack

- **Frontend**: React Native with Expo, TypeScript, Tamagui UI
- **Backend**: Node.js, Express, MongoDB with Mongoose
- **State Management**: React Query
- **Animations**: Lottie for smooth animations in the splash screen, and simle animations with React Native _Animated_

## Implementation Approach

- Built a mobile-first experience with auto-saving functionality - no submit buttons needed
- Used debounced saves (3 second delay) to reduce server requests while typing or modifying the energy slider
- Implemented a date picker wheel to view historical check-ins with visual mood indicators (with max of 10 days)

## Design Decisions

**Auto-save with visual feedback**: Instead of requiring users to manually save, the app auto-saves after 3 seconds of inactivity. A subtle loading indicator shows when data is being saved, making the experience feel seamless.

**Mood visualization through colors**: Each mood option has a distinct color that appears throughout the UI - from selection buttons to historical view indicators. This creates visual consistency and makes it easier to quickly identify mood patterns over time.

## What I'd Improve

If I had more time, I'd add push notifications to remind users to complete their daily check-in, since consistency is key for health tracking apps.
