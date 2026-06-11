import React, { useEffect, useState } from 'react';
import DepthSection from './DepthSection';
import ClerkScene from './ClerkScene';
import Odometer from './Odometer';
import { fetchTallies, SHARE_ID, type TallyStats } from '../lib/umamiShare';

type TallyState = 'pending' | 'off-duty' | TallyStats;

/**
 * The clerk who keeps the books. Real numbers from the site's own
 * self-hosted Umami, fetched read-only via its public share token.
 * Any failure - or no share id configured yet - sends him off duty;
 * the page never suffers for it.
 */
const CountingHouse: React.FC = () => {
  const [tallies, setTallies] = useState<TallyState>('pending');

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

  return (
    <DepthSection label="The counting house" depthM={-40} depthFromM={-35}>
      <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr]">
        <ClerkScene visitorsToday={active ? active.visitorsToday : null} />

        <div className="max-w-md">
          <p className="font-serif text-lg leading-relaxed text-moon/90">
            This is the clerk. He sits on the actual server in the
            owner's actual house and keeps the books: visits, not
            people. No cookies, no names - the same numbers anyone with
            the ledger key can see.
          </p>

          {active ? (
            <dl className="mt-8 space-y-5">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-moon/50">
                  Pages turned, all time
                </dt>
                <dd className="mt-2 text-xl">
                  <Odometer value={active.pageviews} />
                </dd>
              </div>
              <div className="flex gap-10">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-moon/50">
                    Souls, all time
                  </dt>
                  <dd className="mt-1 font-mono text-2xl text-biolume/90 tabular-nums">
                    {active.visitors}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-moon/50">
                    Souls today
                  </dt>
                  <dd className="mt-1 font-mono text-2xl text-biolume/90 tabular-nums">
                    {active.visitorsToday}
                  </dd>
                </div>
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
