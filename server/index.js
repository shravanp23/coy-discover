import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedProfiles } from './seed.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(here, 'data', 'db.json');
const DIST = path.join(here, '..', 'client', 'dist');
const PORT = process.env.PORT || 4000;

function freshDb() {
  return { profiles: seedProfiles(), swipes: {}, matches: [] };
}

function save(data) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const tmp = DB_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_PATH); // atomic replace
}

function load() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    const d = freshDb();
    save(d);
    return d;
  }
}

// Single logged-in user, so swipe state is one object.
let db = load();

// Strip server-only fields. likedMe must never reach the client.
function toPublic({ id, name, age, city, bio, interests, photo }) {
  return { id, name, age, city, bio, interests, photo };
}

const app = express();
app.use(express.json());

app.get('/api/feed', (_req, res) => {
  const profiles = db.profiles.filter(p => !(p.id in db.swipes)).map(toPublic);
  res.json({ profiles });
});

app.post('/api/swipe', (req, res) => {
  const { profileId, action } = req.body || {};
  if (action !== 'like' && action !== 'pass') {
    return res.status(400).json({ error: 'action must be "like" or "pass"' });
  }
  const profile = db.profiles.find(p => p.id === profileId);
  if (!profile) return res.status(404).json({ error: 'Unknown profile' });
  if (profileId in db.swipes) {
    return res.status(409).json({ error: 'Already swiped on this profile' });
  }

  db.swipes[profileId] = action;

  // Match only when both sides liked. The seeded likedMe flag stands in for the other side's like.
  const match = action === 'like' && profile.likedMe === true;
  if (match) db.matches.push(profileId);

  save(db);
  res.json({ match, profile: match ? toPublic(profile) : null });
});

app.get('/api/matches', (_req, res) => {
  const profiles = db.matches
    .map(id => db.profiles.find(p => p.id === id))
    .filter(Boolean)
    .map(toPublic);
  res.json({ profiles });
});

app.post('/api/reset', (_req, res) => {
  db = freshDb();
  save(db);
  res.json({ ok: true });
});

// In production, serve the built React app from the same server.
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(DIST, 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Coy Discover running on http://localhost:${PORT}`));
