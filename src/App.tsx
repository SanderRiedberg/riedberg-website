import React from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import ProfileCard from './components/ProfileCard';

const App: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-japandi-bg overflow-hidden font-sans selection:bg-japandi-green/20 selection:text-japandi-dark">
      {/* 
        The particle system sits at z-0.
        The Profile Card sits at z-10.
        This creates depth while keeping the card functional.
      */}
      <ParticleCanvas />
      <div className="relative z-10">
        <ProfileCard />

        <section id="about" className="mx-auto max-w-3xl px-4 pb-12">
          <div className="rounded-3xl border border-white/40 bg-white/70 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:p-10">
            <h2 className="text-2xl font-semibold text-japandi-dark">About</h2>
            <p className="mt-4 text-base leading-relaxed text-japandi-brown">
              Sander Riedberg has worked in the medical device industry since 2016, with strategic
              regulatory leadership across ISO 13485 certification, PRRC roles, and EU regulatory
              frameworks including the AI Act. He bridges regulatory quality with product delivery
              and technology execution. Based in Nacka, Stockholm, Sweden.
            </p>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-3xl px-4 pb-12">
          <div className="rounded-3xl border border-white/40 bg-white/70 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:p-10">
            <h2 className="text-2xl font-semibold text-japandi-dark">Projects</h2>
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-japandi-accent/30 bg-white/60 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-japandi-dark">Midnight Pigeon</h3>
                  <a
                    className="text-xs font-semibold uppercase tracking-wider text-japandi-green hover:text-japandi-dark"
                    href="https://github.com/SanderRiedberg/midnight-pigeon"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-japandi-brown">
                  Midnight Pigeon is a lightweight macOS Messenger client created after Facebook
                  sunset the official desktop app. It focuses on a native shell with system
                  integration (menus, shortcuts, notifications) while keeping the Messenger web
                  experience intact.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="blog" className="mx-auto max-w-3xl px-4 pb-20">
          <div className="rounded-3xl border border-white/40 bg-white/70 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:p-10">
            <h2 className="text-2xl font-semibold text-japandi-dark">Blog</h2>
            <p className="mt-4 text-base leading-relaxed text-japandi-brown">
              Notes on regulatory strategy, quality systems, and technology in the medical device
              space.
            </p>
            <a
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-japandi-accent/40 bg-white/50 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-japandi-dark transition-colors hover:bg-white/80"
              href="https://blog.riedberg.se"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit blog
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
