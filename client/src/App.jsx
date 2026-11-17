import { useState } from 'react';
import Discover from './components/Discover.jsx';

const TABS = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'discover', label: 'Discover', icon: '♡' },
];

export default function App() {
  const [tab, setTab] = useState('discover');

  return (
    <div className="app">
      <main className="screen">
        {tab === 'home'
          ? <div className="home-blank" aria-label="Home (placeholder)" />
          : <Discover />}
      </main>
      <nav className="tabbar" aria-label="Main">
        {TABS.map(t => (
          <button
            key={t.id}
            className={tab === t.id ? 'active' : ''}
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => setTab(t.id)}
          >
            <span className="tab-icon" aria-hidden="true">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
