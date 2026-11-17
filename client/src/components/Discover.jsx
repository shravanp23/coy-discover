import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import SwipeCard from './SwipeCard.jsx';
import DiscoverMore from './DiscoverMore.jsx';

export default function Discover() {
  const [view, setView] = useState('swipe'); // 'swipe' | 'matches'
  const [queue, setQueue] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');
  const [match, setMatch] = useState(null);
  const [matches, setMatches] = useState([]);
  const topRef = useRef(null);

  const loadFeed = useCallback(async () => {
    setStatus('loading');
    try {
      const { profiles } = await api.feed();
      setQueue(profiles);
      setStatus('ready');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }, []);

  const loadMatches = useCallback(async () => {
    try {
      const { profiles } = await api.matches();
      setMatches(profiles);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    loadFeed();
    loadMatches();
  }, [loadFeed, loadMatches]);

  async function handleSwipe(profile, action) {
    // Remove first so the profile can never reappear.
    setQueue(q => q.filter(p => p.id !== profile.id));
    try {
      const res = await api.swipe(profile.id, action);
      if (res.match) {
        setMatch(res.profile);
        loadMatches();
      }
    } catch (e) {
      setError(e.message);
    }
  }

  const swipeTop = action => topRef.current?.swipe(action);

  if (view === 'matches') {
    return <MatchesView matches={matches} onBack={() => setView('swipe')} />;
  }

  const visible = queue.slice(0, 2);

  return (
    <section className="discover">
      <header className="topbar">
        <div className="logo">coy<span className="dot" /></div>
        <button className="btn small" onClick={() => { loadMatches(); setView('matches'); }}>
          Matches · {matches.length}
        </button>
      </header>

      <div className="stack">
        {status === 'loading' && <div className="panel-empty">Loading profiles…</div>}

        {status === 'error' && (
          <div className="panel empty">
            <h2>Couldn't reach the server</h2>
            <p className="small">{error}</p>
            <button className="btn" onClick={loadFeed}>Retry</button>
          </div>
        )}

        {status === 'ready' && queue.length === 0 && (
          <div className="panel empty">
            <div className="emoji">🤫</div>
            <h2>You're all caught up</h2>
            <p>You've seen everyone for now. Check back later, or reset the demo to swipe again.</p>
            <div className="row">
              <button className="btn pink" onClick={loadFeed}>Refresh</button>
              <button className="btn" onClick={async () => { await api.reset(); setMatches([]); loadFeed(); }}>
                Reset demo
              </button>
            </div>
          </div>
        )}

        {status === 'ready' && visible.map((p, i) => (
          <SwipeCard
            key={p.id}
            ref={i === 0 ? topRef : null}
            profile={p}
            isTop={i === 0}
            depth={i}
            onSwipe={action => handleSwipe(p, action)}
          />
        ))}
      </div>

      {status === 'ready' && queue.length > 0 && (
        <div className="actions">
          <button className="circle nope" aria-label="Pass" onClick={() => swipeTop('pass')}>✕</button>
          <button className="circle like" aria-label="Like" onClick={() => swipeTop('like')}>♥</button>
        </div>
      )}

      {error && status === 'ready' && <p className="error">{error}</p>}
            <DiscoverMore />

      {match && (
        <MatchModal
          profile={match}
          onClose={() => setMatch(null)}
          onViewMatches={() => { setMatch(null); setView('matches'); }}
        />
      )}
    </section>
  );
}

function MatchModal({ profile, onClose, onViewMatches }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="match-title">
      <div className="modal">
        <p className="eyebrow">Mutual like</p>
        <h2 id="match-title">It's a match!</h2>
        <img src={profile.photo} alt="" />
        <p>You and {profile.name} liked each other.</p>
        <button className="btn pink wide" onClick={onViewMatches}>View matches</button>
        <button className="btn wide" onClick={onClose}>Keep swiping</button>
      </div>
    </div>
  );
}

function MatchesView({ matches, onBack }) {
  return (
    <section className="discover">
      <header className="topbar">
        <button className="btn small" onClick={onBack}>← Back</button>
        <div className="logo">coy<span className="dot" /></div>
        <span />
      </header>

      <h1 className="page-title">Matches</h1>

      {matches.length === 0 ? (
        <div className="panel empty">
          <div className="emoji">💌</div>
          <h2>No matches yet</h2>
          <p>When you and someone like each other, they'll show up here.</p>
        </div>
      ) : (
        <ul className="match-list">
          {matches.map(m => (
            <li key={m.id}>
              <img src={m.photo} alt="" />
              <div>
                <strong>{m.name}, {m.age}</strong>
                <span>{m.city}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
