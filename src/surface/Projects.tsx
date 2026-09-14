import React from 'react';
import Section from './Section';
import Reveal from './Reveal';

interface ProjectsProps {
  onDive: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ onDive }) => (
  <Section id="projects" index="03" label="Things I've made" altitudeM={6} altitudeFromM={13}>
    <div className="divide-y divide-ink/10">
      <Reveal as="article" className="project-row relative grid gap-3 py-8 first:pt-0 md:grid-cols-[1fr_2fr] md:gap-10">
        <div>
          <h3 className="font-serif text-2xl font-medium text-ink">Midnight Pigeon</h3>
          <a
            className="mt-1 inline-block font-mono text-xs text-seaglass underline-offset-4 hover:underline"
            href="https://github.com/SanderRiedberg/midnight-pigeon"
            target="_blank"
            rel="noopener noreferrer"
          >
            github ↗
          </a>
        </div>
        <p className="leading-relaxed text-granite">
          A lightweight macOS client for Messenger, made when Facebook
          retired its desktop app. Native menus, shortcuts and notifications
          around the web experience.
        </p>
      </Reveal>

      <Reveal as="article" index={1} className="project-row relative grid gap-3 py-8 md:grid-cols-[1fr_2fr] md:gap-10">
        <div>
          <h3 className="font-serif text-2xl font-medium text-ink">Gatlykta</h3>
          <div className="mt-1 flex gap-4 font-mono text-xs">
            <a
              className="text-seaglass underline-offset-4 hover:underline"
              href="https://gatlykta.riedberg.se"
              target="_blank"
              rel="noopener noreferrer"
            >
              play ↗
            </a>
            <a
              className="text-seaglass underline-offset-4 hover:underline"
              href="https://github.com/SanderRiedberg/gatlykta"
              target="_blank"
              rel="noopener noreferrer"
            >
              github ↗
            </a>
          </div>
        </div>
        <p className="leading-relaxed text-granite">
          A browser game for learning the streets of central Stockholm.
          Guess the street, clear the map and get to know the city by name.
        </p>
      </Reveal>

      <Reveal as="article" index={2} className="project-row relative grid gap-3 py-8 last:pb-0 md:grid-cols-[1fr_2fr] md:gap-10">
        <div>
          <h3 className="font-serif text-2xl font-medium text-ink">This website</h3>
          <button
            type="button"
            onClick={onDive}
            data-dive-trigger
            className="mt-1 inline-block font-mono text-xs text-seaglass underline-offset-4 hover:underline"
          >
            full story below ↓
          </button>
        </div>
        <p className="leading-relaxed text-granite">
          The polished page above has another life below the waterline:
          part experiment, part autobiography, and an excuse to make a
          homepage behave like a small world.
        </p>
      </Reveal>
    </div>
  </Section>
);

export default Projects;
