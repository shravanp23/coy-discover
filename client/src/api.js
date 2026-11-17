async function json(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const api = {
  feed: () => fetch('/api/feed').then(json),
  matches: () => fetch('/api/matches').then(json),
  swipe: (profileId, action) =>
    fetch('/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, action }),
    }).then(json),
  reset: () => fetch('/api/reset', { method: 'POST' }).then(json),
};
