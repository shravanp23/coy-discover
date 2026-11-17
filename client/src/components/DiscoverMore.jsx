import { useState } from 'react';

const STEPS = [
  { n: '1', title: 'Swipe on who you like', text: 'Drag right to like, left to pass. Take your time.' },
  { n: '2', title: 'Nothing is shown', text: 'We never list who has liked you. Your inbox stays quiet.' },
  { n: '3', title: 'Match only when mutual', text: 'When you both like each other, you get the match screen.' },
];

const FAQS = [
  {
    q: 'Can I see who liked me?',
    a: 'No. Coy never shows likes that are not mutual. You only learn about a like when it becomes a match.',
  },
  {
    q: 'What happens when I pass?',
    a: 'The profile is removed from your feed for good. It will not come back.',
  },
  {
    q: 'Where is my data stored?',
    a: 'In this demo, swipes are saved in a small JSON file on the server. A real launch would use a proper database and accounts.',
  },
  {
    q: 'Can I undo a swipe?',
    a: 'Not yet. Undo for the last card is on the roadmap.',
  },
];

export default function DiscoverMore({ referralCode = '8CPKRZA' }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const link = `${window.location.origin}/invite/${referralCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked on some browsers. The code is still visible above the button.
    }
  }

  function backToTop() {
    document.querySelector('.screen')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="more">
      <div className="more-divider">
        <span>Keep scrolling</span>
      </div>

      <section className="panel invite">
        <div className="invite-head">
          <div className="small-emoji">🎁</div>
          <div>
            <h3>Bring a friend, skip the wait</h3>
            <p>Invite 3 friends. When they join and add a crush, you unlock a bonus slot.</p>
          </div>
        </div>

        <div className="progress">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
          <b>0/3</b>
        </div>

        <div className="code-card">
          <span className="label">Your referral code</span>
          <strong className="code">{referralCode}</strong>
          <button className="btn pink wide" onClick={copyLink}>
            {copied ? 'Copied!' : 'Copy invite link'}
          </button>
        </div>
      </section>

      <section className="more-block">
        <p className="eyebrow">How it works</p>
        <h2>Three steps. <em>No drama.</em></h2>
        <ol className="steps">
          {STEPS.map(s => (
            <li key={s.n} className="step">
              <span className="step-num">{s.n}</span>
              <div>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="dark-card">
        <p className="eyebrow light">The Coy promise</p>
        <h2>Nobody sees your likes. <em>Ever.</em></h2>
        <p>
          Likes stay private until they're mutual. No "who likes you" list, no
          awkward pressure, no public rejection.
        </p>
        <div className="avatars">
          <span className="av" style={{ background: '#ff3d7f' }} />
          <span className="av" style={{ background: '#ffd166' }} />
          <span className="av" style={{ background: '#a78bfa' }} />
          <span className="lock" aria-hidden="true">🔒</span>
        </div>
      </section>

      <section className="stats">
        <div><strong>32</strong><span>demo profiles</span></div>
        <div><strong>8</strong><span>secret admirers</span></div>
        <div><strong>0</strong><span>early reveals</span></div>
      </section>

      <section className="more-block">
        <p className="eyebrow">Questions</p>
        <h2>Good to know</h2>
        {FAQS.map(f => (
          <details key={f.q} className="faq">
            <summary>
              {f.q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <footer className="footer">
        <div className="logo">coy<span className="dot" /></div>
        <nav>
          <a href="#">About</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </nav>
        <p>Demo build · React + Express</p>
        <p>© 2026 Coy Discover</p>
        <button className="btn small" onClick={backToTop}>Back to top ↑</button>
      </footer>
    </div>
  );
}