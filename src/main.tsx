import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import {
  CalendarBlank,
  MapPin,
  FlowerLotus,
  Sparkle,
  ArrowDown,
  PhoneCall,
  ChatCircleText,
  SpeakerHigh,
  SpeakerSlash,
  Clock,
  Heart,
  EnvelopeOpen
} from '@phosphor-icons/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles.css';

// Wedding Muhurtam: Sunday 15 November 2026 at 10:00 AM IST
const WEDDING = new Date('2026-11-15T10:00:00+05:30');

interface EventItem {
  id: string;
  name: string;
  subname: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  note: string;
  icon: string;
  badge: string;
  mapLink: string;
  embedQuery: string;
  calStart: string;
  calEnd: string;
}

const events: EventItem[] = [
  {
    id: 'ceremony',
    name: 'Wedding Ceremony',
    subname: 'Thalikettu',
    date: 'Sunday, 15 November 2026',
    time: '10:00 AM – 10:30 AM (Muhurtam)',
    venue: 'Shree Ponnu Guruvayurappan Temple',
    address: 'Rajaji path, 4th Cross Road Dombivli (E)-421201',
    note: 'The sacred Thalikettu solemnized with Guruvayurappan blessings, followed by traditional wedding feast.',
    icon: '🪔',
    badge: 'Auspicious Muhurtam',
    mapLink: 'https://share.google/qLP9HFFwf3d46fL59',
    embedQuery: 'Shree+Ponnu+Guruvayurappan+Temple+Dombivli',
    calStart: '20261115T043000Z',
    calEnd: '20261115T083000Z'
  },
  {
    id: 'reception',
    name: 'Wedding Reception',
    subname: 'Celebration of Love',
    date: 'Monday, 16 November 2026',
    time: '7:00 PM Onwards',
    venue: 'The Atrangii House Sky Lounge',
    address: 'Palm Beach Road, Sector 17, Sanpada, Navi Mumbai, Maharashtra 400705',
    note: 'An enchanting evening of celebrations, music, toasts, and dinner under the stars.',
    icon: '✨',
    badge: 'Evening Soirée',
    mapLink: 'https://share.google/XmfFylexUHnSbqoiA',
    embedQuery: 'The+Atrangii+House+Sky+Lounge+Sanpada+Navi+Mumbai',
    calStart: '20261116T133000Z',
    calEnd: '20261116T173000Z'
  }
];

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, WEDDING.getTime() - now);
  const values = [
    Math.floor(diff / 86400000),
    Math.floor(diff / 3600000) % 24,
    Math.floor(diff / 60000) % 60,
    Math.floor(diff / 1000) % 60
  ];

  return (
    <div className="countdown">
      {values.map((v, i) => (
        <div className="count-unit" key={i}>
          <div className="flip">
            <motion.span
              key={v}
              initial={{ rotateX: -75, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {String(v).padStart(2, '0')}
            </motion.span>
          </div>
          <small>{['days', 'hours', 'mins', 'secs'][i]}</small>
        </div>
      ))}
    </div>
  );
}

function WelcomeModal({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      onDone();
    }, 700);
  };

  return (
    <motion.div
      className={`welcome-overlay ${open ? 'is-opening' : ''}`}
      animate={open ? { opacity: 0, scale: 1.05, filter: 'blur(8px)' } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="welcome-backdrop">
        <img
          src="/assets/shikha-sumeet.jpg"
          alt="Shikha and Sumeet"
          className="welcome-bg-image"
        />
        <div className="welcome-shade" />
        <div className="garland-edge" />
      </div>

      <motion.div
        className="welcome-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15 }}
      >
        <div className="welcome-tag">
          <FlowerLotus size={20} weight="fill" className="lotus-icon" />
          <span>|| Shree Guruvayurappan Thunai ||</span>
        </div>

        <div className="welcome-names">
          <small>Together with their families</small>
          <h1>Shikha <i>&</i> Sumeet</h1>
          <p>cordially invite you to celebrate their wedding</p>
          <div className="welcome-date-badge">
            <span>15 · 11 · 2026</span>
            <em>•</em>
            <span>Dombivli & Navi Mumbai</span>
          </div>
        </div>

        <motion.button
          aria-label="Open Shikha and Sumeet's wedding invitation"
          className="open-invite"
          onClick={handleOpen}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
        >
          <span className="seal">
            <FlowerLotus size={24} weight="fill" />
          </span>
          <div className="seal-text">
            <b>Open Our Invitation</b>
            <small>Tap to enter celebrations</small>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function downloadIcs(event: EventItem) {
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//InviteStory//Shikha & Sumeet Wedding//EN',
    'BEGIN:VEVENT',
    `DTSTART:${event.calStart}`,
    `DTEND:${event.calEnd}`,
    `SUMMARY:Shikha & Sumeet — ${event.name}`,
    `LOCATION:${event.venue}, ${event.address}`,
    `DESCRIPTION:Celebrate the wedding celebrations of Shikha Shaj & Sumeet Nandkumar Pillai. Venue: ${event.venue}. Map: ${event.mapLink}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
  a.download = `shikha-sumeet-${event.id}.ics`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function downloadBothEvents() {
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//InviteStory//Shikha & Sumeet Wedding//EN',
    'BEGIN:VEVENT',
    'DTSTART:20261115T043000Z',
    'DTEND:20261115T083000Z',
    'SUMMARY:Wedding Ceremony (Thalikettu) — Shikha & Sumeet',
    'LOCATION:Shree Ponnu Guruvayurappan Temple, Rajaji path, 4th Cross Road Dombivli (E)-421201',
    'DESCRIPTION:Shikha Shaj & Sumeet Nandkumar Pillai Wedding Ceremony (Thalikettu). Muhurtam: 10:00 AM - 10:30 AM. Map: https://share.google/qLP9HFFwf3d46fL59',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'DTSTART:20261116T133000Z',
    'DTEND:20261116T173000Z',
    'SUMMARY:Wedding Reception — Shikha & Sumeet',
    'LOCATION:The Atrangii House Sky Lounge, Palm Beach Road, Sector 17, Sanpada, Navi Mumbai',
    'DESCRIPTION:Shikha & Sumeet Wedding Reception. 7:00 PM onwards. Map: https://share.google/XmfFylexUHnSbqoiA',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
  a.download = 'shikha-sumeet-wedding-events.ics';
  a.click();
  URL.revokeObjectURL(a.href);
}

function ScratchDate() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  const drawing = useRef(false);
  const strokes = useRef(0);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ratio = Math.min(devicePixelRatio, 2);
    const rect = c.getBoundingClientRect();
    c.width = rect.width * ratio;
    c.height = rect.height * ratio;
    const ctx = c.getContext('2d')!;
    ctx.scale(ratio, ratio);

    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#d7a94f');
    grad.addColorStop(0.5, '#f5deb3');
    grad.addColorStop(1, '#a76d1c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = '#633f1f';
    ctx.textAlign = 'center';
    ctx.font = '11px Marcellus, Georgia, serif';
    ctx.fillText('SCRATCH TO REVEAL OUR DATE', rect.width / 2, rect.height / 2 - 8);
    ctx.font = '24px serif';
    ctx.fillText('🪔', rect.width / 2, rect.height / 2 + 26);
  }, []);

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || done) return;
    const c = canvas.current!;
    const r = c.getBoundingClientRect();
    const ctx = c.getContext('2d')!;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(e.clientX - r.left, e.clientY - r.top, 24, 0, Math.PI * 2);
    ctx.fill();

    strokes.current += 1;
    if (strokes.current > 42) {
      setDone(true);
      c.style.opacity = '0';
      navigator.vibrate?.(35);
    }
  };

  return (
    <section className={`scratch-section ${done ? 'revealed' : ''}`}>
      <div className="float-field" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ '--i': i } as React.CSSProperties}>❀</i>
        ))}
      </div>
      <Reveal>
        <p className="script">Save our auspicious date</p>
        <h2>A sacred day written in the stars</h2>
        <div className="scratch-card">
          <div className="date-reveal">
            <small>Sunday</small>
            <b>15</b>
            <span>November · 2026</span>
            <em>Dombivli & Navi Mumbai</em>
          </div>
          <canvas
            ref={canvas}
            onPointerDown={(e) => {
              drawing.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              scratch(e);
            }}
            onPointerMove={scratch}
            onPointerUp={() => (drawing.current = false)}
            onPointerCancel={() => (drawing.current = false)}
          />
        </div>
        <p className="scratch-hint">
          {done ? 'We cannot wait to celebrate with you ♡' : 'Use your finger or cursor to uncover the date'}
        </p>
      </Reveal>
    </section>
  );
}

// Auspicious Ambient Music synthesized with Web Audio API
function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const startMusic = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Auspicious pentatonic / traditional Kerala temple notes (Mohanam / Bhupali: C, D, E, G, A)
      const baseFreq = 261.63; // C4
      const scale = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2, 9 / 4];
      const melody = [0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 4, 5, 4, 2, 3, 0];
      let step = 0;

      const playNextNote = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const noteIndex = melody[step % melody.length];
        const freq = baseFreq * scale[noteIndex];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Flute / Shehnai warmth harmonic
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Soft envelope
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.3);

        step++;
        timerRef.current = window.setTimeout(playNextNote, 680);
      };

      playNextNote();
      setIsPlaying(true);
    } catch {
      // Audio autoplay restrictions handled gracefully
    }
  };

  const stopMusic = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  return (
    <button
      className="music-toggle"
      onClick={toggle}
      title={isPlaying ? 'Mute auspicious music' : 'Play auspicious temple melody'}
      aria-label="Toggle background wedding music"
    >
      {isPlaying ? <SpeakerHigh size={18} weight="bold" /> : <SpeakerSlash size={18} />}
      <span>{isPlaying ? 'Music Playing' : 'Play Music'}</span>
    </button>
  );
}

function App() {
  const [entered, setEntered] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<'ceremony' | 'reception'>('ceremony');
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const leafY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const page = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduce || !entered || !page.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-copy > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' });
      gsap.fromTo('.hero-couple-card', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out', delay: 0.2 });
      gsap.utils.toArray<HTMLElement>('.event').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, x: i % 2 ? -36 : 36 }, { opacity: 1, x: 0, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.8 } });
      });
      gsap.fromTo('.ceremony-image img', { scale: 1.12, yPercent: -4 }, { scale: 1, yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.ceremony-image', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo('.family-card', { opacity: 0, y: 25 }, { opacity: 1, y: 0, stagger: 0.18, duration: 0.85, ease: 'power2.out', scrollTrigger: { trigger: '.families-section', start: 'top 80%' } });
    }, page);

    return () => ctx.revert();
  }, [entered, reduce]);

  const activeVenueEvent = events.find((e) => e.id === selectedVenue)!;

  return (
    <main ref={page}>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <AudioPlayer />

      {/* Atmospheric Glowing Temple Lanterns */}
      <div className="lantern-atmosphere" aria-hidden="true">
        {[
          { x: 6, y: 12, d: 0.22, s: 0.62, b: 2.2 },
          { x: 89, y: 20, d: 0.35, s: 0.78, b: 1.4 },
          { x: 12, y: 42, d: 0.7, s: 1.05, b: 0.4 },
          { x: 93, y: 55, d: 0.28, s: 0.58, b: 2.6 },
          { x: 4, y: 72, d: 1, s: 1.35, b: 0.2 },
          { x: 87, y: 84, d: 0.62, s: 0.92, b: 0.8 },
          { x: 48, y: 64, d: 0.18, s: 0.42, b: 3.2 }
        ].map((l, i) => (
          <span
            key={i}
            className="atmos-lantern"
            data-depth={l.d}
            style={{
              left: `${l.x}%`,
              top: `${l.y}%`,
              '--scale': l.s,
              '--blur': `${l.b}px`,
              '--delay': `${-i * 0.6}s`
            } as React.CSSProperties}
          >
            <i className="lantern-chain" />
            <i className="lantern-cap" />
            <i className="lantern-body">
              <b className="lantern-flame" />
            </i>
            <i className="lantern-tail" />
          </span>
        ))}
      </div>

      {!entered && <WelcomeModal onDone={() => setEntered(true)} />}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-scrim" />
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 24 }}
          transition={{ delay: 0.15, duration: 1 }}
        >
          <div className="sacred-heading">
            <FlowerLotus size={22} weight="fill" />
            <span>|| Shree Guruvayurappan Thunai ||</span>
          </div>
          <p className="blessing">With the divine blessings of our elders & families</p>
          <h1 className="names-title">
            Shikha <span>&</span> Sumeet
          </h1>
          <p className="full-names">
            Shikha Shaj <i>&</i> Sumeet Nandkumar Pillai
          </p>
          <div className="date-rule">
            <i />
            <span>SUNDAY · 15 NOVEMBER 2026</span>
            <i />
          </div>
          <p className="hero-venue-tag">
            <MapPin size={15} weight="fill" />
            <span>Dombivli & Navi Mumbai, Maharashtra</span>
          </p>
        </motion.div>

        {/* Hero Photo Card in Royal Kasavu Frame */}
        <div className="hero-couple-card">
          <div className="gold-arch-border">
            <img
              src="/assets/shikha-sumeet.jpg"
              alt="Shikha Shaj and Sumeet Nandkumar Pillai in traditional Kasavu attire"
              className="hero-couple-img"
            />
          </div>
          <div className="hero-card-caption">
            <Heart size={14} weight="fill" className="heart-icon" />
            <span>Together Forever In Love & Tradition</span>
          </div>
        </div>

        <motion.div className="leaf-float left" style={{ y: reduce ? 0 : leafY }} />
        <motion.div className="leaf-float right" style={{ y: reduce ? 0 : leafY }} />
        <div className="scroll-cue">
          <ArrowDown size={18} />
          <span>Scroll to celebrate</span>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="count-section">
        <Reveal>
          <p className="kicker">Until the sacred Muhurtam</p>
          <h2>Counting Every Auspicious Moment</h2>
          <Countdown />
          <p className="muhurtam-pill">
            <Clock size={16} weight="bold" />
            <span>Muhurtam: 10:00 AM – 10:30 AM · Sunday, 15 Nov 2026</span>
          </p>
        </Reveal>
      </section>

      {/* Scratch Reveal Card */}
      <ScratchDate />

      {/* Families & Lineage Section */}
      <section className="families-section ornamental">
        <Reveal className="families-inner">
          <FlowerLotus size={32} weight="thin" />
          <p className="script">Together with our families</p>
          <h2>With Divine Blessings</h2>
          <p className="families-intro">
            We cordially invite you to celebrate our union and shower your love, blessings, and warm wishes as we begin our new life together.
          </p>

          <div className="families-grid">
            <div className="family-card bride-card">
              <span className="family-role">Bride</span>
              <h3>Shikha Shaj</h3>
              <p className="family-parents">
                Daughter of <strong>Shaj P.V</strong> <br />
                and <strong>Jisha Shaj</strong>
              </p>
            </div>

            <div className="family-union-badge">
              <span className="union-symbol">❦</span>
              <em>weds</em>
            </div>

            <div className="family-card groom-card">
              <span className="family-role">Groom</span>
              <h3>Sumeet Nandkumar Pillai</h3>
              <p className="family-parents">
                Son of <strong>Nandkumar Pillai</strong> <br />
                and <strong>Sunita Pillai</strong>
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Ceremony Moment Showcase */}
      <section className="ceremony-moment">
        <div className="floating-glass lotus-one">✿</div>
        <div className="floating-glass lotus-two">❀</div>
        <div className="floating-diya">🪔</div>
        <div className="ceremony-image">
          <img
            src="/assets/shikha-sumeet.jpg"
            loading="lazy"
            alt="Shikha and Sumeet in traditional Kasavu attire"
          />
        </div>
        <Reveal className="ceremony-caption">
          <p className="script">Sacred vows & eternal grace</p>
          <h2>The Beginning of Forever</h2>
          <p>
            Wrapped in the warmth of gold Kasavu, sacred chants, and the fragrant presence of loved ones, we bind our lives in timeless harmony.
          </p>
          <span className="caption-tag">Scroll down to explore our wedding ceremonies & venues</span>
        </Reveal>
      </section>

      {/* Events Timeline */}
      <section className="events" id="events">
        <Reveal>
          <p className="kicker">Wedding Itinerary</p>
          <h2>Celebration Festivities</h2>
          <p className="section-intro">Two memorable gatherings. One lifetime of happiness.</p>
        </Reveal>

        <div className="event-list">
          {events.map((e, i) => (
            <Reveal className={`event ${i === 0 ? 'featured' : ''}`} key={e.id}>
              <div className="event-number">0{i + 1}</div>
              <div className="event-content">
                <div className="event-header-row">
                  <span className="event-icon">{e.icon}</span>
                  <span className="event-badge">{e.badge}</span>
                </div>
                <h3>{e.name}</h3>
                <h4 className="event-subname">{e.subname}</h4>
                <p className="event-note">{e.note}</p>

                <dl className="event-details-grid">
                  <div>
                    <dt>Day & Date</dt>
                    <dd>
                      <strong>{e.date}</strong>
                    </dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>
                      <strong>{e.time}</strong>
                    </dd>
                  </div>
                  <div>
                    <dt>Venue</dt>
                    <dd>
                      <strong>{e.venue}</strong>
                      <span>{e.address}</span>
                    </dd>
                  </div>
                </dl>

                <div className="event-actions">
                  <a
                    href={e.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="button-sm primary-sm"
                  >
                    <MapPin size={16} />
                    <span>View Map Location</span>
                  </a>
                  <button
                    onClick={() => downloadIcs(e)}
                    className="button-sm secondary-sm"
                  >
                    <CalendarBlank size={16} />
                    <span>Add to Calendar</span>
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Interactive Venue & Directions Section */}
      <section className="venue ornamental" id="venues">
        <Reveal>
          <MapPin size={38} weight="thin" />
          <p className="script">Join us at our venues</p>
          <h2>Locations & Directions</h2>
          <p className="venue-intro-text">
            Select an event to view exact Google Maps directions and venue information.
          </p>

          <div className="venue-tab-bar">
            <button
              className={`venue-tab ${selectedVenue === 'ceremony' ? 'active' : ''}`}
              onClick={() => setSelectedVenue('ceremony')}
            >
              <span>🪔 Ceremony</span>
              <small>Dombivli (E)</small>
            </button>
            <button
              className={`venue-tab ${selectedVenue === 'reception' ? 'active' : ''}`}
              onClick={() => setSelectedVenue('reception')}
            >
              <span>✨ Reception</span>
              <small>Sanpada, Navi Mumbai</small>
            </button>
          </div>

          <div className="venue-card-details">
            <div className="venue-card-header">
              <span className="event-pill">{activeVenueEvent.name}</span>
              <h3>{activeVenueEvent.venue}</h3>
              <p className="venue-full-address">{activeVenueEvent.address}</p>
              <div className="venue-timing-badge">
                <Clock size={16} />
                <span>{activeVenueEvent.date} · {activeVenueEvent.time}</span>
              </div>
            </div>

            <div className="map google-map">
              <iframe
                title={`Map of ${activeVenueEvent.venue}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${activeVenueEvent.embedQuery}&z=15&output=embed`}
              />
              <div className="map-overlay">
                <span>
                  <MapPin size={18} weight="fill" />
                  {activeVenueEvent.name}
                </span>
                <b>{activeVenueEvent.venue}</b>
                <small>{activeVenueEvent.address}</small>
              </div>
            </div>

            <div className="actions">
              <a
                className="button primary"
                href={activeVenueEvent.mapLink}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={19} weight="bold" />
                <span>Open in Google Maps</span>
              </a>
              <button
                className="button secondary"
                onClick={() => downloadIcs(activeVenueEvent)}
              >
                <CalendarBlank size={19} />
                <span>Add Event to Calendar</span>
              </button>
            </div>

            <div className="all-events-cal-row">
              <button className="button-link" onClick={downloadBothEvents}>
                <CalendarBlank size={16} />
                <span>Download Calendar Invite for Both Events (.ics)</span>
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* RSVP Section */}
      <section className="rsvp-section" id="rsvp">
        <Reveal>
          <p className="kicker">Your Presence Means The World</p>
          <h2>RSVP & Warm Wishes</h2>
          <p className="rsvp-sub">
            Please confirm your attendance or reach out to our families for any assistance:
          </p>

          <div className="rsvp-grid">
            {/* Contact 1 */}
            <div className="rsvp-card">
              <div className="rsvp-avatar">KP</div>
              <div className="rsvp-info">
                <h3>Mr. Kirankumar Pillai</h3>
                <p className="phone-display">+91 73033 30431</p>
              </div>
              <div className="rsvp-buttons">
                <a
                  href="tel:+917303330431"
                  className="contact-btn call-btn"
                  aria-label="Call Mr. Kirankumar Pillai"
                >
                  <PhoneCall size={18} weight="fill" />
                  <span>Call</span>
                </a>
                <a
                  href="https://wa.me/917303330431?text=Hi%20Kirankumar%20ji%2C%20heartiest%20congratulations%20to%20Shikha%20and%20Sumeet!%20Looking%20forward%20to%20attending."
                  target="_blank"
                  rel="noreferrer"
                  className="contact-btn wa-btn"
                  aria-label="WhatsApp Mr. Kirankumar Pillai"
                >
                  <ChatCircleText size={18} weight="fill" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Contact 2 */}
            <div className="rsvp-card">
              <div className="rsvp-avatar">RP</div>
              <div className="rsvp-info">
                <h3>Mrs. Ritu Pillai</h3>
                <p className="phone-display">+91 97699 13791</p>
              </div>
              <div className="rsvp-buttons">
                <a
                  href="tel:+919769913791"
                  className="contact-btn call-btn"
                  aria-label="Call Mrs. Ritu Pillai"
                >
                  <PhoneCall size={18} weight="fill" />
                  <span>Call</span>
                </a>
                <a
                  href="https://wa.me/919769913791?text=Hi%20Ritu%20ji%2C%20heartiest%20congratulations%20to%20Shikha%20and%20Sumeet!%20Looking%20forward%20to%20attending."
                  target="_blank"
                  rel="noreferrer"
                  className="contact-btn wa-btn"
                  aria-label="WhatsApp Mrs. Ritu Pillai"
                >
                  <ChatCircleText size={18} weight="fill" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-photo-bg">
          <img
            src="/assets/shikha-sumeet.jpg"
            loading="lazy"
            alt="Shikha and Sumeet Wedding"
          />
        </div>
        <div className="footer-overlay" />
        <Reveal className="footer-copy">
          <Sparkle size={28} weight="thin" />
          <p className="blessing-footer">|| Lokah Samastah Sukhino Bhavantu ||</p>
          <p className="footer-cheer">We eagerly look forward to welcoming you</p>
          <h2>Shikha <i>&</i> Sumeet</h2>
          <span className="footer-date-info">
            15 & 16 November 2026 · Dombivli & Navi Mumbai
          </span>

          <div className="footer-links-row">
            <button
              className="footer-action-pill"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top ↑
            </button>
            <button
              className="footer-action-pill"
              onClick={downloadBothEvents}
            >
              <CalendarBlank size={14} />
              Save Dates (.ics)
            </button>
          </div>
        </Reveal>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
