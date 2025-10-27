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

      const navTimer = window.setTimeout(navigateToDisclaimer, 700);
      timers.current.push(navTimer);
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
          background: radial-gradient(circle at 50% 30%, #2e0a54 0%, #1d0637 45%, #06010d 100%);
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
          background: radial-gradient(circle at 50% 32%, rgba(70, 26, 124, 0.78) 0%, rgba(34, 9, 60, 0.9) 46%, rgba(6, 1, 13, 0.96) 100%);
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
          color: #d9c8ff;
        }

        .scene {
          margin-top: 2.75rem;
          display: flex;
          justify-content: center;
        }

        .door-wrapper {
          position: relative;
          width: min(320px, 68vw);
          padding: 2.1rem;
          border-radius: 32px;
          background: linear-gradient(150deg, rgba(18, 2, 34, 0.92), rgba(8, 0, 18, 0.76));
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85);
          cursor: pointer;
          transition: transform 0.28s ease;
          perspective: 1600px;
          touch-action: manipulation;
        }

        .door-wrapper:hover {
          transform: translateY(-6px);
        }

        .door-wrapper:focus-visible {
          outline: 2px solid #f6d7b2;
          outline-offset: 10px;
        }

        .door-frame {
          position: relative;
          z-index: 2;
          border-radius: 22px;
          padding: 1.1rem;
          background: linear-gradient(120deg, rgba(40, 18, 70, 0.7), rgba(18, 3, 34, 0.95));
          box-shadow: inset 0 0 0 2px rgba(240, 223, 198, 0.08);
        }

        .door-panel {
          position: relative;
          border-radius: 16px;
          transform-origin: left center;
          transform: perspective(1400px) rotateY(0deg);
          transition: transform 0.7s ease-in-out;
          box-shadow: 0 22px 48px rgba(0, 0, 0, 0.72);
        }

        .door-panel.open {
          transform: perspective(1400px) rotateY(-84deg);
        }

        .door-panel img {
          display: block;
          width: 100%;
          border-radius: 14px;
          object-fit: cover;
          filter: saturate(0.85) brightness(0.92);
        }

        .door-light {
          position: absolute;
          inset: -24%;
          border-radius: 50%;
          background: radial-gradient(circle at 18% 52%, rgba(255, 211, 166, 0.94) 0%, rgba(255, 189, 128, 0.66) 42%, rgba(255, 146, 84, 0.36) 64%, rgba(255, 120, 52, 0) 80%);
          filter: blur(12px);
          opacity: 0;
          transform: scale(0.82);
          transition: opacity 0.7s ease-in-out, transform 0.7s ease-in-out;
          z-index: 1;
          pointer-events: none;
        }

        .door-light.glow {
          opacity: 0.42;
          transform: scale(0.95);
        }

        .door-light.warm {
          opacity: 0.86;
          transform: scale(1.08);
        }

        .key-icon {
          position: absolute;
          right: 24px;
          top: 54%;
          width: 74px;
          transform: translate(50%, -50%) rotate(0deg);
          transform-origin: 38% 50%;
          transition: transform 0.3s ease-in-out;
          z-index: 5;
          filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.65));
        }

        .key-icon.turning {
          transform: translate(50%, -50%) rotate(90deg);
        }

        @media (max-width: 700px) {
          .door-wrapper {
            padding: 1.7rem;
            border-radius: 26px;
          }

          .door-frame {
            padding: 0.8rem;
            border-radius: 18px;
          }

          .door-panel {
            border-radius: 12px;
          }

          .door-panel img {
            border-radius: 10px;
          }

          .key-icon {
            right: 18px;
            width: 64px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .door-wrapper,
          .door-panel,
          .door-light,
          .key-icon {
            transition-duration: 0s !important;
          }
        }
      `}</style>
      <div className="entry-content">
        <header className="entry-header">
          <h1>Break Fear Decoder</h1>
          <p>When fear speaks, it reveals the next door</p>
        </header>
        <div className="scene">
          <div
            className="door-wrapper"
            onClick={handleDoorActivation}
            role="button"
            aria-label="Door to enter"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <div className={lightClassName} />
            <div className="door-frame">
              <div className={doorClassName}>
                <img src="/door.jpg" alt="Black door" />
              </div>
            </div>
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
