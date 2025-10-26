import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

type SequencePhase = 'idle' | 'key' | 'door' | 'navigated';
type LightPhase = 'rest' | 'glow' | 'warm';

const EntryPage = () => {
  const [phase, setPhase] = useState<SequencePhase>('idle');
  const [light, setLight] = useState<LightPhase>('rest');
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(timer => window.clearTimeout(timer));
      timers.current = [];
    };
  }, []);

  const navigateToDisclaimer = () => {
    setPhase('navigated');
    window.location.assign('/disclaimer');
  };

  const handleDoorActivation = () => {
    if (phase !== 'idle') return;

    setPhase('key');
    setLight('glow');

    const doorTimer = window.setTimeout(() => {
      setPhase('door');
      setLight('warm');

      const navigateTimer = window.setTimeout(navigateToDisclaimer, 700);
      timers.current.push(navigateTimer);
    }, 300);

    timers.current.push(doorTimer);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDoorActivation();
    }
  };

  const doorClassName = ['door-panel', phase === 'door' || phase === 'navigated' ? 'open' : '']
    .filter(Boolean)
    .join(' ');
  const keyClassName = ['key-icon', phase !== 'idle' ? 'turning' : '']
    .filter(Boolean)
    .join(' ');
  const lightClassName = ['door-light', light !== 'rest' ? light : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="entry-container">
      <style>{`
        :root, body, #root {
          height: 100%;
        }

        body {
          margin: 0;
          background: radial-gradient(circle at 50% 35%, #2d0d54 0%, #160425 42%, #030005 100%);
          color: #f5f0ff;
          font-family: 'Segoe UI', 'Trebuchet MS', sans-serif;
        }

        .entry-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem 4rem;
          text-align: center;
          background: radial-gradient(circle at 50% 35%, rgba(53, 16, 97, 0.82) 0%, rgba(18, 4, 32, 0.92) 48%, rgba(3, 0, 5, 0.98) 100%);
        }

        .entry-content {
          max-width: 640px;
          width: 100%;
        }

        .entry-header h1 {
          margin: 0;
          font-size: clamp(2.6rem, 5vw, 3.8rem);
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .entry-header p {
          margin: 0.85rem 0 0;
          font-size: clamp(1.1rem, 3vw, 1.35rem);
          letter-spacing: 0.08em;
          color: #dbcfff;
        }

        .scene {
          margin-top: 2.75rem;
          display: flex;
          justify-content: center;
        }

        .door-wrapper {
          position: relative;
          width: min(320px, 68vw);
          padding: 1.8rem;
          border-radius: 28px;
          background: rgba(12, 0, 28, 0.58);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.78);
          cursor: pointer;
          transition: transform 0.3s ease;
          perspective: 1600px;
        }

        .door-wrapper:hover {
          transform: translateY(-6px);
        }

        .door-wrapper:focus-visible {
          outline: 2px solid #f6d7b2;
          outline-offset: 10px;
        }

        .door-panel {
          position: relative;
          z-index: 2;
          transform-origin: left center;
          transform: perspective(1400px) rotateY(0deg);
          transition: transform 0.7s ease-in-out;
        }

        .door-panel.open {
          transform: perspective(1400px) rotateY(-80deg);
        }

        .door-panel img {
          display: block;
          width: 100%;
          border-radius: 18px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7);
        }

        .door-light {
          position: absolute;
          inset: -22%;
          border-radius: 50%;
          background: radial-gradient(circle at 20% 50%, rgba(255, 214, 168, 0.9) 0%, rgba(255, 188, 124, 0.58) 38%, rgba(255, 155, 82, 0.28) 58%, rgba(255, 140, 70, 0) 78%);
          filter: blur(10px);
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 0.7s ease-in-out, transform 0.7s ease-in-out;
          z-index: 1;
          pointer-events: none;
        }

        .door-light.glow {
          opacity: 0.45;
          transform: scale(1);
        }

        .door-light.warm {
          opacity: 0.8;
          transform: scale(1.08);
        }

        .key-sign {
          position: absolute;
          right: -90px;
          top: 54%;
          transform: translateY(-50%) rotate(-5deg);
          padding: 0.5rem 0.85rem;
          background: rgba(24, 6, 52, 0.86);
          color: #f9dcb9;
          border-radius: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.9rem;
          z-index: 3;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.5);
        }

        .key-icon {
          position: absolute;
          right: 26px;
          top: 54%;
          width: 74px;
          transform: translate(50%, -50%) rotate(0deg);
          transform-origin: 38% 50%;
          transition: transform 0.3s ease-in-out;
          z-index: 4;
          filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.6));
        }

        .key-icon.turning {
          transform: translate(50%, -50%) rotate(90deg);
        }

        @media (max-width: 700px) {
          .door-wrapper {
            padding: 1.5rem;
            border-radius: 22px;
          }

          .key-sign {
            right: 50%;
            top: 100%;
            transform: translate(50%, 1.6rem) rotate(-3deg);
            font-size: 0.8rem;
          }

          .key-icon {
            right: 18px;
            width: 64px;
          }
        }
      `}</style>
      <div className="entry-content">
        <header className="entry-header">
          <h1>Break Fear Decoder</h1>
          <p>When fear speaks, it reveals the next door.</p>
        </header>
        <div className="scene">
          <div
            className="door-wrapper"
            onClick={handleDoorActivation}
            role="button"
            aria-label="Open the Break Fear Decoder door"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <div className={lightClassName} />
            <div className={doorClassName}>
              <img src="/door.jpg" alt="Black door" />
            </div>
            <span className="key-sign">Turn the</span>
            <img className={keyClassName} src="/key.png" alt="Key icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => <EntryPage />;

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);
