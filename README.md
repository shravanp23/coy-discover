<div align="center">

# 💘 Coy Discover

**A swipe-based discovery feature where nobody sees who likes them until it's mutual.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Node](https://img.shields.io/badge/Node-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

[Live demo](https://coy-discover.onrender.com) · [Report a bug](https://github.com/YOUR_USERNAME/coy-discover/issues) · [Request a feature](https://github.com/YOUR_USERNAME/coy-discover/issues)

<!-- Add a screenshot or GIF of the swipe flow here -->
<!-- ![Coy Discover demo](docs/demo.gif) -->

</div>

---

## ✨ Why Coy Discover?

Most dating apps show you who already liked you, which turns every swipe into a power play. **Coy** flips that. You swipe on people you're interested in, and you only find out about a match when it's mutual. Nobody sees a "likes you" list, so nobody gets pressured or rejected in public.

This repository is a standalone implementation of the **Discover** tab: the swipe feed, match detection, the match screen, and a matches list, with state persisted across reloads.

## 🚀 Features

- **Swipe deck:** drag cards left or right with a mouse or finger, or use the ✕ and ♥ buttons. Cards rotate and show LIKE/NOPE stamps as you drag.
- **Smooth animations:** cards fly off screen, and the stack keeps the next profile visible underneath.
- **Never repeats:** a profile you've swiped on never comes back, enforced on the server.
- **Mutual matching only:** a "It's a match!" screen appears only when both people have liked each other.
- **Private likes:** the API never reveals who has liked you. Likers stay hidden until a match.
- **Matches view:** a list of all your mutual matches.
- **Persistent state:** swipes and matches survive page reloads and server restarts.
- **Empty states:** a friendly "You're all caught up" screen when the deck runs out, with a reset option for demos.
- **Mobile-first:** designed as a phone-width app and centered on desktop, with a bottom tab bar.

## 🧱 Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, Vite, plain CSS (no UI framework) |
| Backend  | Node.js, Express |
| Storage  | JSON file (`server/data/db.json`), written atomically |
| Hosting  | Render (single web service serves both API and app) |

## 📁 Project Structure

```
coy-discover/
├── server/
│   ├── index.js        # Express API + static file serving
│   ├── seed.js         # 32 mock profiles (8 have already liked you)
│   └── package.json
├── client/
│   ├── index.html
│   ├── vite.config.js  # Dev proxy: /api → localhost:4000
│   └── src/
│       ├── App.jsx             # Tab bar: Home (placeholder) + Discover
│       ├── api.js              # Fetch wrapper for the REST API
│       ├── styles.css
│       └── components/
│           ├── Discover.jsx    # Feed, matches view, match modal
│           └── SwipeCard.jsx   # Drag gestures and card animation
├── .gitignore
└── README.md
```

## ⚡ Quick Start

**Prerequisites:** [Node.js 20+](https://nodejs.org) and [Git](https://git-scm.com).

```bash
git clone https://github.com/shravanp23/coy-discover
cd coy-discover
```

Run the API and the frontend in two separate terminals.

**Terminal 1: API (port 4000)**

```bash
cd server
npm install
npm start
```

**Terminal 2: App (port 5173)**

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**.

> **Windows users:** run these commands in PowerShell or Command Prompt from inside the `coy-discover` folder. Make sure `server` and `client` appear when you run `dir`.

### Try the demo flow

1. Swipe through the feed, or press ♥ on **Jordan** (the second profile). Jordan has already liked you, so the match screen appears.
2. Tap **Matches** to see Jordan listed.
3. Reload the page. Your swipes are still there.
4. Use **Reset demo** on the "caught up" screen, or delete `server/data/db.json` and restart the server, to start over.

## 🏭 Production Build

The server can serve the built frontend, so you only need one process:

```bash
npm install --prefix server
npm install --prefix client
npm run build --prefix client
node server/index.js
```

Then open **http://localhost:4000**.

## 🔌 API Reference

Base path: `/api`. All request and response bodies are JSON.

| Method | Endpoint       | Description | Example response |
|--------|----------------|-------------|------------------|
| `GET`  | `/feed`        | Profiles you haven't swiped on yet | `{ "profiles": [...] }` |
| `POST` | `/swipe`       | Record a like or pass | `{ "match": true, "profile": {...} }` |
| `GET`  | `/matches`     | Mutual matches only | `{ "profiles": [...] }` |
| `POST` | `/reset`       | Re-seed the demo data | `{ "ok": true }` |

**Swipe request body:**

```json
{ "profileId": "p2", "action": "like" }
```

`action` must be `"like"` or `"pass"`. The API returns `409` if you swipe on the same profile twice, and `404` for unknown profiles.

## 🧠 Design Decisions

**Privacy by design.** The server stores a `likedMe` flag on each seeded profile, which stands in for another user's like. It's removed in `toPublic()` before any response is sent, and no endpoint exposes it. A match is created only when the user likes a profile that has already liked them, so the "who likes me" list can't leak through the API.

**Server-enforced rules.** The client removes a card as soon as it's swiped, but the server is the source of truth. It filters swiped profiles out of `/feed`, rejects duplicate swipes, and decides matches. A reload can't bring back a profile.

**Gesture handling without libraries.** `SwipeCard` uses pointer events with `setPointerCapture`, so the same code handles mouse and touch. Position is tracked in a ref for accurate release logic and in state for rendering. Releasing past 110px counts as a swipe, and anything less snaps back.

**Atomic persistence.** Writes go to a temp file and are renamed into place, so a crash mid-write can't corrupt the database.

## 🗺️ Roadmap

- [ ] Real user accounts and authentication
- [ ] Real other-user likes (replace the seeded flag with a likes table)
- [ ] Chat for matches
- [ ] Swipe-undo for the last card
- [ ] Filters (age, distance, interests)
- [ ] Move storage to PostgreSQL or SQLite for multi-user use
- [ ] Automated tests for the matching rules

## 🤝 Contributing

Contributions are welcome. Fork the repo, create a branch (`git checkout -b feature/your-idea`), commit your changes, and open a pull request.

## 📄 License

Released under the [MIT License](LICENSE).

---

<div align="center">
Built with React, Express, and a lot of ♥
</div>