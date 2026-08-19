import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowRight, Check, ChevronDown, Circle, Clock3, Command, Crosshair, Inbox, Layers3, Menu, MoveRight, Sparkles, X, Zap } from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import DashboardApp from './dashboard';
import nebulaVideo from '@assets/Website-Builder-Pro-Aug-20-00-32-39_1787168525987.mp4';

const queryClient = new QueryClient();

type VideoState = 'loading' | 'ready' | 'error';

function useScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [videoState, setVideoState] = useState<VideoState>('loading');
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setIsReducedMotion(motionQuery.matches);
    const updateViewport = () => setIsMobile(window.innerWidth < 768);
    updateMotion();
    updateViewport();
    motionQuery.addEventListener('change', updateMotion);
    window.addEventListener('resize', updateViewport);
    return () => {
      motionQuery.removeEventListener('change', updateMotion);
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || isReducedMotion || isMobile) return;
    let frame = 0;
    const updateFrame = () => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(bounds.height - window.innerHeight, 1);
      const nextProgress = Math.min(1, Math.max(0, -bounds.top / travel));
      setProgress(nextProgress);
      if (video.readyState >= 2 && Number.isFinite(video.duration)) {
        video.currentTime = nextProgress * Math.max(video.duration - 0.04, 0);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFrame);
    };
    updateFrame();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isMobile, isReducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoState !== 'ready') return;
    if (isMobile && !isReducedMotion) {
      video.loop = true;
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isMobile, isReducedMotion, videoState]);

  return { videoRef, sectionRef, videoState, setVideoState, isReducedMotion, isMobile, progress };
}

function NebulaMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2" data-testid="brand-nebula">
      <span className={`relative flex items-center justify-center rounded-full bg-[#26304f] text-[#f7f4ec] ${compact ? 'h-7 w-7' : 'h-8 w-8'}`}>
        <span className="absolute h-3 w-3 rounded-full border border-[#63d4c2] opacity-90" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-[#63d4c2]" />
      </span>
      <span className={`font-display font-bold tracking-[-0.05em] text-[#26304f] ${compact ? 'text-lg' : 'text-xl'}`}>nebula</span>
    </span>
  );
}

function Header({ onOpenAccess }: { onOpenAccess: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { href: '#how-it-works', label: 'How it works' },
    { href: '#capabilities', label: 'Capabilities' },
    { href: '#manifesto', label: 'Why Nebula' },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-30 px-4 pt-4 sm:px-6 lg:px-10 lg:pt-6" data-testid="header-navigation">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-center justify-between rounded-full border border-[#26304f]/10 bg-[#f7f4ec]/85 px-4 py-3 shadow-[0_8px_30px_rgba(38,48,79,.06)] backdrop-blur-xl sm:px-6">
          <a href="#top" aria-label="Nebula home" data-testid="link-home">
            <NebulaMark compact />
          </a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-[11px] font-bold uppercase tracking-[.14em] text-[#596078] transition-colors hover:text-[#26304f]" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/dashboard" className="px-3 py-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#596078] transition-colors hover:text-[#26304f]" data-testid="link-dashboard">
              Preview workspace
            </Link>
            <button type="button" onClick={onOpenAccess} className="rounded-full bg-[#26304f] px-5 py-3 text-[11px] font-bold uppercase tracking-[.14em] text-[#f7f4ec] transition-transform hover:-translate-y-0.5" data-testid="button-header-access">
              Request access
            </button>
          </div>
          <button type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)} className="rounded-full p-2 text-[#26304f] md:hidden" data-testid="button-mobile-menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <div className="mt-2 rounded-[24px] border border-[#26304f]/10 bg-[#f7f4ec] p-3 shadow-[0_12px_36px_rgba(38,48,79,.12)] md:hidden" data-testid="mobile-navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-bold text-[#26304f] hover:bg-[#e3ede8]" data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                {item.label}
              </a>
            ))}
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-bold text-[#26304f] hover:bg-[#e3ede8]" data-testid="link-mobile-dashboard">
              Preview workspace
            </Link>
            <button type="button" onClick={() => { setMenuOpen(false); onOpenAccess(); }} className="mt-1 w-full rounded-2xl bg-[#26304f] px-4 py-3 text-left text-sm font-bold text-[#f7f4ec]" data-testid="button-mobile-access">
              Request access
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function AccessDialog({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d2540]/40 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="access-title" data-testid="dialog-access">
      <div className="relative w-full max-w-lg rounded-[32px] border border-[#26304f]/10 bg-[#f7f4ec] p-7 shadow-[0_30px_100px_rgba(31,38,64,.25)] sm:p-10">
        <button type="button" onClick={onClose} aria-label="Close access request" className="absolute right-5 top-5 rounded-full p-2 text-[#596078] hover:bg-[#e3ede8] hover:text-[#26304f]" data-testid="button-close-access">
          <X size={18} />
        </button>
        {!submitted ? (
          <>
            <span className="font-mono-ui text-[10px] font-medium uppercase tracking-[.18em] text-[#1f9e99]">Private beta · 2025</span>
            <h2 id="access-title" className="mt-5 max-w-sm font-display text-4xl font-bold leading-[.98] tracking-[-.06em] text-[#26304f]">Make room for your clearest work.</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#596078]">Nebula is opening a small group of seats to people who want their tools to think in context.</p>
            <form onSubmit={submit} className="mt-8 space-y-3">
              <label htmlFor="access-email" className="sr-only">Work email</label>
              <input id="access-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="w-full rounded-2xl border border-[#26304f]/15 bg-[#fbfaf6] px-4 py-4 text-sm text-[#26304f] placeholder:text-[#858b9c] focus:border-[#26a7a1] focus:outline-none" data-testid="input-access-email" />
              <button type="submit" className="flex w-full items-center justify-between rounded-2xl bg-[#26304f] px-5 py-4 text-sm font-bold text-[#f7f4ec] transition-transform hover:-translate-y-0.5" data-testid="button-submit-access">
                Join the signal <ArrowRight size={17} />
              </button>
            </form>
          </>
        ) : (
          <div className="py-10 text-center" data-testid="status-access-success">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d1eee5] text-[#1f9e99]"><Check size={22} /></span>
            <h2 className="mt-6 font-display text-3xl font-bold tracking-[-.05em] text-[#26304f]">You are on the list.</h2>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#596078]">We will send the first signal to <strong className="text-[#26304f]">{email}</strong>.</p>
            <button type="button" onClick={onClose} className="mt-8 rounded-full border border-[#26304f]/20 px-5 py-3 text-xs font-bold uppercase tracking-[.14em] text-[#26304f] hover:bg-[#e3ede8]" data-testid="button-finish-access">Back to Nebula</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Hero({ onOpenAccess }: { onOpenAccess: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden px-5 pb-16 pt-36 sm:px-8 lg:px-12 lg:pb-24 lg:pt-48" data-testid="section-hero">
      <div className="pointer-events-none absolute -right-28 top-20 h-[420px] w-[420px] rounded-full bg-[#b8ddd1]/40 blur-3xl" />
      <div className="mx-auto max-w-[1440px]">
        <div className="grid items-end gap-12 lg:grid-cols-[1.3fr_.7fr] lg:gap-20">
          <div className="reveal max-w-5xl">
            <div className="mb-7 flex items-center gap-3 font-mono-ui text-[10px] font-medium uppercase tracking-[.2em] text-[#1f9e99]" data-testid="text-hero-kicker">
              <span className="h-2 w-2 rounded-full bg-[#26a7a1]" />
              A calm command center for modern work
            </div>
            <h1 className="font-display text-[clamp(4rem,11vw,10.4rem)] font-bold leading-[.82] tracking-[-.09em] text-[#26304f]" data-testid="heading-hero">
              Turn the<br /><span className="text-[#26a7a1]">noise</span> into<br />momentum.
            </h1>
          </div>
          <div className="reveal reveal-delay-2 pb-2 lg:pb-5">
            <p className="max-w-md text-base leading-7 text-[#596078] sm:text-lg">Nebula sits between all the places work happens — seeing the thread, shaping the next move, and keeping you in motion.</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <button type="button" onClick={onOpenAccess} className="group flex items-center gap-3 rounded-full bg-[#26304f] px-5 py-4 text-xs font-bold uppercase tracking-[.13em] text-[#f7f4ec] transition-transform hover:-translate-y-1" data-testid="button-hero-access">
                Find your focus <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <a href="#how-it-works" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#596078] hover:text-[#26304f]" data-testid="link-hero-how-it-works">
                See the shift <ArrowDownRight size={16} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 flex items-center justify-between border-t border-[#26304f]/15 pt-5 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#73798c] sm:mt-24" data-testid="hero-meta">
          <span>01 / 05</span>
          <span className="hidden sm:block">Designed for the in-between moments</span>
          <span>Scroll to compose</span>
        </div>
      </div>
    </section>
  );
}

function VideoStory() {
  const { videoRef, sectionRef, videoState, setVideoState, isReducedMotion, isMobile, progress } = useScrollVideo();
  const fallback = videoState === 'error';

  return (
    <section id="how-it-works" ref={sectionRef} className="relative h-[225vh] bg-[#26304f] text-[#f7f4ec]" data-testid="section-scroll-story">
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(38,167,161,.2),transparent_30%),linear-gradient(125deg,#26304f,#303a5b)]" />
        <div className="absolute left-[8%] top-[19%] h-48 w-48 rounded-full border border-[#d1eee5]/10" />
        <div className="absolute left-[calc(8%+23px)] top-[calc(19%+23px)] h-[11.5rem] w-[11.5rem] rounded-full border border-[#d1eee5]/10" />
        <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-16 lg:px-12">
          <div className="z-10 max-w-md" data-testid="story-copy">
            <div className="mb-6 flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#83e2d0]">
              <span className="h-2 w-2 rounded-full bg-[#83e2d0]" />
              The signal, in motion
            </div>
            <div className="min-h-[230px] sm:min-h-[280px]">
              <p className="font-display text-[clamp(2.8rem,6vw,6rem)] font-bold leading-[.9] tracking-[-.08em] text-[#f7f4ec]">{progress < .33 ? 'Everything starts scattered.' : progress < .67 ? 'Nebula finds the thread.' : 'You move with clarity.'}</p>
            </div>
            <div className="mt-7 max-w-xs border-l border-[#83e2d0]/50 pl-4 text-sm leading-6 text-[#c2cad6]">
              Scroll to watch a busy day resolve into one clear next step.
            </div>
            <div className="mt-8 flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#91a0b4]" data-testid="story-progress">
              <span className="h-px w-12 bg-[#83e2d0]" style={{ transform: `scaleX(${Math.max(progress, .06)})`, transformOrigin: 'left' }} />
              {isReducedMotion ? 'Still frame' : isMobile ? 'Mobile preview' : `${Math.round(progress * 100)}% composed`}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[28px] border border-[#d1eee5]/20 bg-[#11182e] shadow-[0_25px_100px_rgba(3,7,20,.35)] sm:rounded-[38px]" data-testid="video-stage">
            {!fallback ? (
              <video ref={videoRef} src={nebulaVideo} muted playsInline preload="metadata" controls={isReducedMotion} onLoadedMetadata={() => setVideoState('ready')} onCanPlay={() => setVideoState('ready')} onError={() => setVideoState('error')} className="aspect-video w-full object-cover" aria-label="Nebula workflow visualization driven by scroll" data-testid="video-scroll-anchor" />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center bg-[#17213e] px-8 text-center" data-testid="status-video-error">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#83e2d0]/30 text-[#83e2d0]"><Layers3 size={20} /></span>
                <p className="mt-4 font-display text-xl font-bold">The signal is taking a pause.</p>
                <p className="mt-2 max-w-xs text-xs leading-5 text-[#aeb8c8]">The motion preview could not load, but the Nebula workflow is still ready to explore below.</p>
                <button type="button" onClick={() => { setVideoState('loading'); window.location.reload(); }} className="mt-5 rounded-full border border-[#83e2d0]/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#83e2d0]" data-testid="button-retry-video">Try again</button>
              </div>
            )}
            {videoState === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#17213e]/90" data-testid="status-video-loading">
                <div className="flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#83e2d0]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#83e2d0]" /> Loading signal</div>
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-center justify-between font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#e3eee9]/70 sm:inset-x-7 sm:bottom-7">
              <span>NEBULA / LIVE CONTEXT</span>
              <span className="flex items-center gap-2"><Circle size={7} fill="currentColor" /> {isMobile ? 'auto preview' : 'scroll synced'}</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-7 left-5 right-5 hidden items-center justify-between font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#91a0b4] sm:flex lg:left-12 lg:right-12">
          <span>02 / 05</span><span>Use your scroll wheel as a timeline</span><span>00:25</span>
        </div>
      </div>
    </section>
  );
}

function CapabilityCard({ icon, index, title, children, accent }: { icon: ReactNode; index: string; title: string; children: ReactNode; accent: string }) {
  return (
    <article className="group relative overflow-hidden border-t border-[#26304f]/15 py-7 sm:py-9" data-testid={`card-capability-${index}`}>
      <div className={`absolute right-0 top-0 h-32 w-32 rounded-full ${accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60`} />
      <div className="relative flex items-start justify-between gap-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e3ede8] text-[#26304f]">{icon}</div>
        <span className="font-mono-ui text-[10px] tracking-[.14em] text-[#858b9c]">{index}</span>
      </div>
      <h3 className="relative mt-8 max-w-sm font-display text-3xl font-bold leading-none tracking-[-.06em] text-[#26304f]">{title}</h3>
      <p className="relative mt-4 max-w-sm text-sm leading-6 text-[#596078]">{children}</p>
      <div className="relative mt-7 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#1f9e99] opacity-0 transition-opacity group-hover:opacity-100">Explore signal <MoveRight size={14} /></div>
    </article>
  );
}

function Capabilities() {
  return (
    <section id="capabilities" className="bg-[#f7f4ec] px-5 py-24 sm:px-8 sm:py-36 lg:px-12" data-testid="section-capabilities">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
          <div>
            <span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#1f9e99]">The working layer</span>
            <h2 className="mt-6 max-w-md font-display text-[clamp(3.3rem,6vw,6.8rem)] font-bold leading-[.86] tracking-[-.08em] text-[#26304f]">Less<br /><span className="text-[#26a7a1]">managing.</span><br />More making.</h2>
            <p className="mt-8 max-w-sm text-sm leading-6 text-[#596078]">A quiet layer of intelligence that turns open loops into a visible path forward.</p>
          </div>
          <div className="grid gap-x-12 sm:grid-cols-2">
            <CapabilityCard index="01" title="One living context" accent="bg-[#9ad8cc]" icon={<Command size={20} />}>Nebula connects your notes, conversations, and calendar into a context that moves with the work.</CapabilityCard>
            <CapabilityCard index="02" title="Next, not noise" accent="bg-[#e2c1a1]" icon={<Crosshair size={20} />}>Ask what matters now. Get a small, precise answer instead of another list to maintain.</CapabilityCard>
            <CapabilityCard index="03" title="Momentum you can see" accent="bg-[#b6c5df]" icon={<Zap size={20} />}>Every decision becomes a gentle cue — so progress feels tangible before the project is done.</CapabilityCard>
            <CapabilityCard index="04" title="Your pace, protected" accent="bg-[#d3c6df]" icon={<Clock3 size={20} />}>Nebula knows when to surface, when to stay quiet, and how to keep your attention yours.</CapabilityCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section id="manifesto" className="overflow-hidden bg-[#e3ede8] px-5 py-24 sm:px-8 sm:py-36 lg:px-12" data-testid="section-manifesto">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-center justify-between border-b border-[#26304f]/15 pb-5 font-mono-ui text-[10px] uppercase tracking-[.17em] text-[#667184]"><span>03 / 05</span><span>Our point of view</span></div>
        <div className="grid items-end gap-12 pt-16 lg:grid-cols-[1.2fr_.8fr] lg:pt-28">
          <h2 className="max-w-5xl font-display text-[clamp(3.2rem,8.6vw,9.4rem)] font-bold leading-[.82] tracking-[-.1em] text-[#26304f]">Your attention<br /><span className="text-[#26a7a1]">is not</span> a<br />resource.</h2>
          <div className="max-w-sm pb-2 lg:pb-4">
            <p className="text-lg leading-8 text-[#3d4964]">It is the place your best work comes from.</p>
            <p className="mt-6 text-sm leading-6 text-[#596078]">Nebula is designed around that belief. No gamified productivity theatre. No dashboard demanding to be fed. Just a clearer relationship with what matters.</p>
            <a href="#final-cta" className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[.14em] text-[#26304f] hover:text-[#1f9e99]" data-testid="link-manifesto-cta">Keep going <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="mt-24 flex flex-wrap gap-x-10 gap-y-4 border-t border-[#26304f]/15 pt-5 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#667184] sm:mt-40">
          <span>Context over clutter</span><span>Signal over urgency</span><span>Progress over performance</span>
        </div>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section className="bg-[#f7f4ec] px-5 py-24 sm:px-8 sm:py-36 lg:px-12" data-testid="section-proof">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
          <div>
            <span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#1f9e99]">A different kind of assistant</span>
            <p className="mt-7 max-w-sm text-2xl font-semibold leading-tight tracking-[-.04em] text-[#26304f]">Built for the moment before the work begins.</p>
          </div>
          <div>
            <div className="grid gap-8 border-b border-[#26304f]/15 pb-10 sm:grid-cols-3">
              <div><span className="font-display text-5xl font-bold tracking-[-.08em] text-[#26304f]">7:42</span><p className="mt-2 text-xs leading-5 text-[#596078]">The average moment a day finds its shape.</p></div>
              <div><span className="font-display text-5xl font-bold tracking-[-.08em] text-[#26304f]">−3</span><p className="mt-2 text-xs leading-5 text-[#596078]">Open loops removed before noon.</p></div>
              <div><span className="font-display text-5xl font-bold tracking-[-.08em] text-[#26304f]">1</span><p className="mt-2 text-xs leading-5 text-[#596078]">Clear next move, every time.</p></div>
            </div>
            <blockquote className="pt-10">
              <p className="max-w-2xl font-display text-3xl font-bold leading-[1.02] tracking-[-.06em] text-[#26304f] sm:text-5xl">“Nebula gives me the rare feeling that my work is already waiting for me.”</p>
              <footer className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[.13em] text-[#596078]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#26304f] text-[10px] text-[#f7f4ec]">MK</span> Maya K. · independent strategist</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta({ onOpenAccess }: { onOpenAccess: () => void }) {
  return (
    <section id="final-cta" className="relative overflow-hidden bg-[#26304f] px-5 py-24 text-[#f7f4ec] sm:px-8 sm:py-36 lg:px-12" data-testid="section-final-cta">
      <div className="pointer-events-none absolute -right-20 -top-40 h-[520px] w-[520px] rounded-full border border-[#83e2d0]/20 sm:-right-10 sm:-top-64" />
      <div className="pointer-events-none absolute -right-4 -top-24 h-[340px] w-[340px] rounded-full border border-[#83e2d0]/15" />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="flex items-center justify-between border-b border-[#d1eee5]/20 pb-5 font-mono-ui text-[10px] uppercase tracking-[.17em] text-[#9ca9b9]"><span>05 / 05</span><span>The next move is yours</span></div>
        <div className="grid gap-12 pt-16 lg:grid-cols-[1fr_.5fr] lg:pt-24">
          <div>
            <span className="flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#83e2d0]"><Sparkles size={13} /> Begin with one clear thing</span>
            <h2 className="mt-7 max-w-4xl font-display text-[clamp(4rem,9vw,10rem)] font-bold leading-[.8] tracking-[-.1em]">Make space<br />for <span className="text-[#83e2d0]">momentum.</span></h2>
          </div>
          <div className="flex flex-col justify-end lg:pb-3">
            <p className="max-w-sm text-base leading-7 text-[#c2cad6]">The early access list is open for people building the next thoughtful thing.</p>
            <button type="button" onClick={onOpenAccess} className="group mt-8 flex w-fit items-center gap-4 rounded-full bg-[#83e2d0] px-5 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#26304f] transition-transform hover:-translate-y-1" data-testid="button-final-access">Request early access <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></button>
            <Link href="/dashboard" className="mt-5 flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#aeb8c8] hover:text-[#f7f4ec]" data-testid="link-final-dashboard">Preview the future workspace <ArrowRight size={15} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#26304f] px-5 pb-8 text-[#aeb8c8] sm:px-8 lg:px-12" data-testid="footer">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 border-t border-[#d1eee5]/20 pt-7 text-[10px] uppercase tracking-[.15em] sm:flex-row sm:items-center sm:justify-between">
        <NebulaMark compact />
        <div className="flex flex-wrap gap-x-6 gap-y-3"><a href="#top" className="hover:text-[#f7f4ec]" data-testid="link-footer-top">Back to top</a><a href="#capabilities" className="hover:text-[#f7f4ec]" data-testid="link-footer-capabilities">Capabilities</a><span>© 2025 Nebula Systems</span></div>
      </div>
    </footer>
  );
}

function LandingPage() {
  const [accessOpen, setAccessOpen] = useState(false);
  useEffect(() => {
    document.title = 'Nebula — Turn noise into momentum';
    const description = 'Nebula is a calm command center for turning scattered work into clear momentum.';
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description);
  }, []);
  return (
    <div className="noise overflow-x-clip bg-[#f7f4ec]" data-testid="page-landing">
      <Header onOpenAccess={() => setAccessOpen(true)} />
      <main>
        <Hero onOpenAccess={() => setAccessOpen(true)} />
        <VideoStory />
        <Capabilities />
        <Manifesto />
        <ProofSection />
        <FinalCta onOpenAccess={() => setAccessOpen(true)} />
      </main>
      <Footer />
      {accessOpen && <AccessDialog onClose={() => setAccessOpen(false)} />}
    </div>
  );
}

function FutureDashboard() {
  const [activeView, setActiveView] = useState('Today');
  const views = ['Today', 'Projects', 'Signals'];
  const tasks = [
    { title: 'Shape the spring launch brief', meta: 'Deep work · 52 min', done: false },
    { title: 'Send Maya the revised timeline', meta: 'Communication · 12 min', done: true },
    { title: 'Review research notes from Friday', meta: 'Context · 24 min', done: false },
  ];
  return (
    <div className="min-h-[100dvh] bg-[#eef1ec] text-[#26304f]" data-testid="page-dashboard">
      <header className="border-b border-[#26304f]/10 bg-[#f7f4ec]/80 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" aria-label="Return to Nebula home" data-testid="link-dashboard-home"><NebulaMark compact /></Link>
          <span className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#667184]">Workspace preview / v0.1</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div><span className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#1f9e99]">Tuesday, October 14</span><h1 className="mt-4 font-display text-5xl font-bold tracking-[-.08em] sm:text-7xl">Good morning, Maya.</h1><p className="mt-4 text-sm text-[#596078]">Three signals are asking for your attention. One is worth starting with.</p></div>
          <button type="button" className="flex w-fit items-center gap-2 rounded-full bg-[#26304f] px-5 py-3 text-xs font-bold uppercase tracking-[.13em] text-[#f7f4ec]" onClick={() => alert('Nebula capture is coming soon.')} data-testid="button-capture-thought"><Sparkles size={14} /> Capture a thought</button>
        </div>
        <div className="mt-12 flex gap-2 border-b border-[#26304f]/15" role="tablist" aria-label="Workspace views">
          {views.map((view) => <button key={view} type="button" role="tab" aria-selected={activeView === view} onClick={() => setActiveView(view)} className={`border-b-2 px-4 py-3 text-xs font-bold ${activeView === view ? 'border-[#1f9e99] text-[#26304f]' : 'border-transparent text-[#858b9c]'}`} data-testid={`tab-dashboard-${view.toLowerCase()}`}>{view}</button>)}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
          <section className="rounded-[28px] border border-[#26304f]/10 bg-[#f7f4ec] p-6 shadow-[0_12px_36px_rgba(38,48,79,.06)] sm:p-8" data-testid="panel-next-move">
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d1eee5] text-[#1f9e99]"><Crosshair size={17} /></span><div><h2 className="font-display text-xl font-bold tracking-[-.04em]">Your next move</h2><p className="text-xs text-[#858b9c]">{activeView} · Focus window</p></div></div><span className="font-mono-ui text-[10px] text-[#1f9e99]">09:18</span></div>
            <div className="mt-8 rounded-2xl bg-[#e3ede8] p-5"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#1f9e99]">Suggested by Nebula</p><p className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-.05em]">Shape the spring launch brief before your 11:30 sync.</p><p className="mt-3 text-sm leading-6 text-[#596078]">Your notes from the last two weeks point here. It will unblock the timeline and give the team something concrete to react to.</p><button type="button" onClick={() => alert('Focus mode is coming soon.')} className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#26304f]" data-testid="button-start-focus">Start focus <ArrowRight size={15} /></button></div>
            <div className="mt-8 space-y-1">{tasks.map((task, index) => <div key={task.title} className="flex items-center gap-3 rounded-xl px-2 py-3"><button type="button" aria-label={`${task.done ? 'Reopen' : 'Complete'} ${task.title}`} className={`flex h-5 w-5 items-center justify-center rounded-full border ${task.done ? 'border-[#1f9e99] bg-[#1f9e99] text-white' : 'border-[#26304f]/25'}`} onClick={() => alert(`${task.title} updated.`)} data-testid={`button-task-${index}`}>{task.done && <Check size={12} />}</button><div><p className={`text-sm font-semibold ${task.done ? 'text-[#858b9c] line-through' : 'text-[#26304f]'}`}>{task.title}</p><p className="font-mono-ui text-[10px] text-[#858b9c]">{task.meta}</p></div></div>)}</div>
          </section>
          <aside className="space-y-6">
            <div className="rounded-[28px] bg-[#26304f] p-6 text-[#f7f4ec] sm:p-7" data-testid="panel-context"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#394566] text-[#83e2d0]"><Inbox size={17} /></span><h2 className="font-display text-xl font-bold tracking-[-.04em]">Context health</h2></div><div className="mt-8 flex items-end justify-between"><span className="font-display text-6xl font-bold tracking-[-.09em] text-[#83e2d0]">86</span><span className="pb-2 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#aeb8c8]">clear / 100</span></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#394566]"><div className="h-full w-[86%] rounded-full bg-[#83e2d0]" /></div><p className="mt-5 text-sm leading-6 text-[#c2cad6]">Your workspace is in a good state. Two conversations are waiting for a decision.</p></div>
            <div className="rounded-[28px] border border-[#26304f]/10 bg-[#f7f4ec] p-6" data-testid="panel-upcoming"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold tracking-[-.04em]">On the horizon</h2><ChevronDown size={17} className="text-[#858b9c]" /></div><div className="mt-5 space-y-4 text-sm">{['Design review · 11:30', 'Lunch with Rowan · 13:00', 'Weekly reset · Friday'].map((item, index) => <div key={item} className="flex items-center gap-3"><span className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-[#1f9e99]' : 'bg-[#c6cbd4]'}`} /><span className="text-[#596078]">{item}</span></div>)}</div></div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/dashboard*" component={DashboardApp} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;