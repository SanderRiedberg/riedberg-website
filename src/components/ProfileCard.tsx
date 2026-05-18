import React from 'react';
import { Mail, Phone, PenTool, MapPin, Cpu, Linkedin, ArrowDownRight } from 'lucide-react';
import { ContactLink } from '../types';

const ProfileCard: React.FC = () => {
  
  const links: ContactLink[] = [
    {
      label: 'Email',
      value: 'sander@riedberg.se',
      href: 'mailto:sander@riedberg.se',
      icon: <Mail size={18} className="text-japandi-green" />
    },
    {
      label: 'Phone',
      value: '+46 70 720 88 88',
      href: 'tel:+46707208888',
      icon: <Phone size={18} className="text-japandi-green" />
    },
    {
      label: 'Blog',
      value: 'blog.riedberg.se',
      href: 'https://blog.riedberg.se',
      icon: <PenTool size={18} className="text-japandi-green" />
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/sander-riedberg',
      href: 'https://www.linkedin.com/in/sander-riedberg/',
      icon: <Linkedin size={18} className="text-japandi-green" />
    }
  ];

  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div className="
        w-full max-w-md 
        bg-white/60 backdrop-blur-xl 
        border border-white/40 
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
        rounded-3xl 
        p-8 md:p-12 
        text-center 
        animate-fade-in
        transition-all duration-500 ease-out
        hover:shadow-[0_12px_40px_rgb(74,93,79,0.08)]
      ">
        {/* Header Section */}
        <div className="mb-10 mt-2">
          <h1 className="text-3xl md:text-4xl font-bold text-japandi-dark tracking-tight mb-2">
            Sander Riedberg
          </h1>
          
          <p className="text-japandi-brown font-serif italic text-lg">
            Technology & Regulatory Quality
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-16 bg-japandi-dark/10 mx-auto mb-10"></div>

        {/* Links Section */}
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              target={link.label === 'Blog' || link.label === 'LinkedIn' ? '_blank' : '_self'}
              rel={link.label === 'Blog' || link.label === 'LinkedIn' ? 'noopener noreferrer' : ''}
              className="
                group flex items-center justify-between 
                p-4 rounded-xl 
                bg-white/50 hover:bg-white/90
                border border-transparent hover:border-japandi-accent/30
                transition-all duration-300
              "
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-japandi-bg group-hover:bg-japandi-green/10 transition-colors duration-300">
                  {link.icon}
                </div>
                <div className="text-left">
                  <div className="text-xs uppercase tracking-wider text-japandi-brown/70 font-semibold">
                    {link.label}
                  </div>
                  <div className="text-sm md:text-base font-medium text-japandi-dark">
                    {link.value}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Jump Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider">
          <a
            href="#about"
            className="inline-flex items-center gap-1 rounded-full border border-japandi-accent/40 bg-white/40 px-3 py-1 text-japandi-dark transition-colors hover:bg-white/80"
          >
            About <ArrowDownRight size={12} />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-1 rounded-full border border-japandi-accent/40 bg-white/40 px-3 py-1 text-japandi-dark transition-colors hover:bg-white/80"
          >
            Projects <ArrowDownRight size={12} />
          </a>
          <a
            href="#blog"
            className="inline-flex items-center gap-1 rounded-full border border-japandi-accent/40 bg-white/40 px-3 py-1 text-japandi-dark transition-colors hover:bg-white/80"
          >
            Blog <ArrowDownRight size={12} />
          </a>
        </div>
        
        {/* Footer/Status */}
        <div className="mt-12 space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs text-japandi-brown/60 font-medium">
                <MapPin size={12} />
                <span>Based in Sweden</span>
            </div>
            
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-japandi-brown/40 font-mono uppercase tracking-wide opacity-70">
                <Cpu size={10} />
                <span>Yes, of course AI built this homepage</span>
            </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileCard;
