import React, { useEffect, useState } from 'react';
import DepthSection from './DepthSection';
import ClerkScene from './ClerkScene';
import Odometer from './Odometer';
import { fetchTallies, SHARE_ID, type TallyStats } from '../lib/umamiShare';

type TallyState = 'pending' | 'off-duty' | TallyStats;

const CLERK_LINES = [
  'Have we thought about what happens next?',
  'Fast is useful. False speed is expensive.',
  'A better argument is always welcome.',
  'The ledger is balanced. The garden is not.',
  'No personal data in these books. House rules.',
] as const;

/**
 * The clerk who keeps the books. Real numbers from the site's own
 * self-hosted Umami, fetched read-only via its public share token.
 * Any failure - or no share id configured yet - sends him off duty;
 * the page never suffers for it.
 */
const CountingHouse: React.FC = () => {
  const [tallies, setTallies] = useState<TallyState>('pending');
  const [clerkLine, setClerkLine] = useState<number | null>(null);
  const [wakeSignal, setWakeSignal] = useState(0);

  useEffect(() => {
    if (!SHARE_ID) {
      setTallies('off-duty');
      return;
    }
    let cancelled = false;
    fetchTallies(SHARE_ID).then((stats) => {
      if (!cancelled) setTallies(stats ?? 'off-duty');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const active = typeof tallies === 'object' ? tallies : null;

  useEffect(() => {
    if (clerkLine === null) return;
    const timer = window.setTimeout(() => setClerkLine(null), 5200);
    return () => window.clearTimeout(timer);
  }, [clerkLine]);

  const askClerk = () => {
    setClerkLine((current) => current === null ? 0 : (current + 1) % CLERK_LINES.length);
    setWakeSignal((current) => current + 1);
  };

  return (
    <DepthSection label="The counting house" depthM={-40} depthFromM={-35}>
      <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr]">
        <div className="relative">
          <ClerkScene
            visitorsToday={active ? active.visitorsToday : null}
            wakeSignal={wakeSignal}
            onActivate={askClerk}
          />
          {clerkLine !== null && (
            <p
              role="status"
              aria-live="polite"
              className="clerk-bubble absolute left-4 top-2 max-w-[15rem] rounded-lg border border-sun/45 bg-abyss/95 px-4 py-3 font-mono text-xs leading-relaxed text-moon shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
            >
              {CLERK_LINES[clerkLine]}
            </p>
          )}
        </div>

        <div className="max-w-md">
          <p className="font-serif text-lg leading-relaxed text-moon/90">
            This is the clerk. He keeps the books on the owner's own server:
            visits, not people. No cookies and no names.
          </p>

          {active ? (
            <dl className="mt-8 grid grid-cols-2 gap-x-10 gap-y-5">
              <div className="col-span-2">
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-moon/70">
                  Pages turned, all time
                </dt>
                <dd className="mt-2 text-xl">
                  <Odometer value={active.pageviews} />
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-moon/70">
                  Souls, all time
                </dt>
                <dd className="mt-1 font-mono text-2xl text-biolume/90 tabular-nums">
                  {active.visitors}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-moon/70">
                  Souls today
                </dt>
                <dd className="mt-1 font-mono text-2xl text-biolume/90 tabular-nums">
                  {active.visitorsToday}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-6 font-mono text-sm leading-relaxed text-moon/60">
              {tallies === 'pending'
                ? 'The clerk is fetching the ledgers…'
                : 'Off duty. The clerk has been hired and the machine is installed; the ledger key arrives shortly.'}
            </p>
          )}
        </div>
      </div>
    </DepthSection>
  );
};

export default CountingHouse;
