# Coy Discover

Swipe-based Discover tab (Bumble/Tinder style) with a placeholder Home tab.
React + Vite frontend, Express API, JSON file database.

## Local run

    cd server && npm install && npm start        # API on :4000
    cd client && npm install && npm run dev      # app on :5173

## Production (single server)

    npm install --prefix server && npm install --prefix client && npm run build --prefix client
    node server/index.js                         # app on :4000

## API

- GET /api/feed: profiles not yet swiped on
- POST /api/swipe: { profileId, action: "like" | "pass" } → { match, profile }
- GET /api/matches: mutual matches only
- POST /api/reset: re-seed demo data
