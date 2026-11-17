import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const THRESHOLD = 110; // px of drag before a release counts as a swipe
const EXIT_MS = 320;   // fly-off animation time

const SwipeCard = forwardRef(function SwipeCard({ profile, isTop, depth, onSwipe }, ref) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const startRef = useRef(null);
  const exitingRef = useRef(false);

  const move = (x, y) => {
    posRef.current = { x, y };
    setPos({ x, y });
  };

  // Shared by drag release and the desktop buttons.
  function finish(action) {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setDragging(false);
    const dir = action === 'like' ? 1 : -1;
    move(dir * (window.innerWidth + 300), posRef.current.y);
    setTimeout(() => onSwipe(action), EXIT_MS);
  }

  useImperativeHandle(ref, () => ({ swipe: finish }), [onSwipe]);

  const onPointerDown = (e) => {
    if (!isTop || exitingRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  };

  const onPointerMove = (e) => {
    if (!startRef.current) return;
    move(e.clientX - startRef.current.x, (e.clientY - startRef.current.y) * 0.4);
  };

  const onPointerUp = () => {
    if (!startRef.current) return;
    startRef.current = null;
    const { x } = posRef.current;
    if (Math.abs(x) > THRESHOLD) {
      finish(x > 0 ? 'like' : 'pass');
    } else {
      setDragging(false);
      move(0, 0); // snap back
    }
  };

  const likeOpacity = Math.min(Math.max(pos.x / THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-pos.x / THRESHOLD, 0), 1);

  const transform = isTop
    ? `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.x / 18}deg)`
    : `translateY(${depth * 14}px) scale(${1 - depth * 0.05})`;

  return (
    <article
      className={`card ${isTop ? 'top' : ''}`}
      style={{
        transform,
        transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(.2,.8,.2,1)',
        zIndex: 10 - depth,
        backgroundImage: `url(${profile.photo})`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label={`${profile.name}, ${profile.age}, ${profile.city}`}
    >
      <div className="stamp like" style={{ opacity: likeOpacity }}>LIKE</div>
      <div className="stamp nope" style={{ opacity: nopeOpacity }}>NOPE</div>

      <div className="card-info">
        <div className="card-name">
          <h2>{profile.name}, {profile.age}</h2>
        </div>
        <p className="city">{profile.city}</p>
        <p className="bio">{profile.bio}</p>
        <div className="chips">
          {profile.interests.map(i => <span key={i}>{i}</span>)}
        </div>
      </div>
    </article>
  );
});

export default SwipeCard;
