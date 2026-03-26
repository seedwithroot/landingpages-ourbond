// ─────────────────────────────────────────────────────────────
// service-sections.js
//
// Shared section content for all Bond service pages.
// Structure: each section key has a `base` (default) and optional
// audience `variants` that override base fields when merged.
//
// Usage in a page:
//   import { getSection } from '../../data/service-sections.js';
//   const sectionD = getSection('arrivalAlerts', 'families');
//
// ─────────────────────────────────────────────────────────────

// Helper: merge base with a named variant (variant keys win)
export function getSection(sectionKey, variant = 'base') {
  const section = sections[sectionKey];
  if (!section) throw new Error(`Unknown section: "${sectionKey}"`);
  if (variant === 'base') return { ...section.base };
  const v = section.variants?.[variant];
  if (!v) throw new Error(`Unknown variant "${variant}" for section "${sectionKey}"`);
  return { ...section.base, ...v };
}

// Helper: get all variant keys for a section
export function getVariants(sectionKey) {
  return Object.keys(sections[sectionKey]?.variants ?? {});
}

// ─────────────────────────────────────────────────────────────
// SECTION B — Feature Cards
// ─────────────────────────────────────────────────────────────
const featureCards = {
  base: {
    id: 'feature-cards',
    label: 'B — Feature Cards',
    headline: 'Bond is more than just {focusedService}.',
    video: 'https://www.ourbond.com/wp-content/uploads/slider112/bond_website_loop_v5_comp_x3.mp4',
    showAppButtons: true,
  },
  variants: {
    // Families monitoring loved ones
    family: {
      subheadline: "Real-time location is just the start. Bond wraps your family in a complete layer of protection — live agents, arrival alerts, and more.",
      cards: [
        {
          icon: 'map',
          title: 'Real-time location',
          body: "See your whole family on a live map — where they are, which direction they're moving, and when they'll arrive.",
        },
        {
          icon: 'bell',
          title: 'Arrival & departure alerts',
          body: "Get notified the moment a family member arrives at school, work, or home — without anyone having to send a text.",
        },
        {
          icon: 'user-check',
          title: 'Live security agents',
          body: "Trained agents available 24/7 via video, audio, or text. One tap away from real human help — any time.",
        },
      ],
    },
    // Individual / solo contexts — "family" framing swapped to "you"
    individual: {
      subheadline: "Real-time location is just the start. Bond builds a complete safety net around every trip you take — live agents, arrival alerts, and more.",
      cards: [
        {
          icon: 'map',
          title: 'Real-time location',
          body: "A trusted contact sees your exact location and movement — from the moment you leave to when you arrive.",
        },
        {
          icon: 'bell',
          title: 'Arrival alerts',
          body: "Your person gets notified the moment you're safely inside — no check-in text needed from you.",
        },
        {
          icon: 'user-check',
          title: 'Live security agents',
          body: "Trained agents available 24/7 via video, audio, or text. One tap away any time something feels off.",
        },
      ],
    },
    // Employer / lone-worker contexts
    loneWorkers: {
      subheadline: "Location tracking is just the start. Bond gives every lone worker a full safety net — automated check-ins, live agents, and instant emergency escalation.",
      cards: [
        {
          icon: 'map',
          title: 'Real-time location',
          body: "See every lone worker on a live map throughout their shift — location, movement, and last check-in time.",
        },
        {
          icon: 'bell',
          title: 'Automated check-ins',
          body: "Bond checks in with workers automatically. If there's no response, supervisors are alerted before it becomes a crisis.",
        },
        {
          icon: 'user-check',
          title: 'Live security agents',
          body: "A trained agent is one tap away during any solo shift — and can coordinate with 911 on the worker's behalf.",
        },
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────
// SECTION D — Arrival Alerts
// ─────────────────────────────────────────────────────────────
const arrivalAlerts = {
  base: {
    id: 'feature-arrival',
    label: 'D — Arrival Alerts',
    position: 'after-grid',
    layout: 'copy-right',
    showAppButtons: true,
    media: {
      type: 'video-autoplay',
      src: 'https://www.ourbond.com/wp-content/themes/bond/src/gifs/track-me-on-the-go.mp4',
      alt: 'Track Me On The Go',
    },
  },
  variants: {
    // Families monitoring a family member
    family: {
      eyebrow: 'Arrival alerts',
      headline: "You'll know the moment they're safe.",
      body: "Bond monitors your family member's journey from the moment they leave to when they arrive. If they go off-route or don't check in on time, we act — automatically.",
      bullets: [
        'Journey monitoring, start to finish',
        "Auto-escalation if they don't arrive on time",
        'Emergency contacts notified instantly',
        'GPS and photo sent to first responders if needed',
      ],
    },
    // Families (explicit alias — same as family)
    families: {
      headline: "You'll know the moment they're safe.",
      body: "Bond monitors every trip from start to finish — school runs, late nights, commutes. The moment they arrive, you're notified. If something goes wrong along the way, a live agent is already on it.",
      bullets: [
        'Arrival alerts for every family member',
        "Auto-escalation if they don't arrive on time",
        'Emergency contacts notified instantly',
        'No check-in texts required from your family',
      ],
    },
    // Individual tracking themselves
    individual: {
      headline: "Someone always knows you arrived safe.",
      body: "Set a destination, start your trip, and Bond handles the rest. Your trusted contact is notified the moment you're inside — without you needing to send a word.",
      bullets: [
        "Trusted contact notified the moment you arrive",
        "Auto-alert if you don't check in on time",
        "Works for any trip — commute, date, night out",
        "No manual check-in required",
      ],
    },
    // Students — parent monitoring
    students: {
      headline: "Know the moment they're back safe.",
      body: "Whether it's a late class, a campus event, or a weekend trip — Bond notifies you the instant your student arrives. No texts, no check-ins, no wondering.",
      bullets: [
        "Instant alert when they reach their destination",
        "Auto-escalation if they don't arrive on time",
        "Works for any campus trip, day or night",
        "Parents see the full route, not just the destination",
      ],
    },
    // Solo travelers
    soloTravel: {
      headline: "Home always knows you got there.",
      body: "Wherever you land — a new city, a late-night rideshare, an unfamiliar neighborhood — Bond notifies your family the moment you're safely at your destination. No international texts required.",
      bullets: [
        "Arrival alerts from any country or time zone",
        "Live route visible to trusted contacts at home",
        "Auto-escalation if you go silent unexpectedly",
        "Works on rideshares, transit, and on foot",
      ],
    },
    // Nightlife / dating
    nightlife: {
      headline: "They'll know you got home safe.",
      body: "Before you head out, Bond sets a return destination. The moment you're home, your trusted contact knows — no text needed. If something doesn't feel right along the way, help is one tap away.",
      bullets: [
        "Trusted contact notified when you arrive home",
        "Discreet — runs silently in the background",
        "Auto-alert if you don't arrive on time",
        "One tap to escalate if anything feels wrong",
      ],
    },
    // Lone workers
    loneWorkers: {
      headline: "Know every worker made it in and out safe.",
      body: "Bond tracks lone workers from the moment they arrive on site to when they leave. Supervisors get automatic check-in summaries — and instant alerts if something goes off-plan.",
      bullets: [
        "Arrival and departure alerts for every solo shift",
        "Automatic check-ins throughout the workday",
        "Supervisors notified instantly if a worker goes silent",
        "Full location history for incident reporting",
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────
// SECTION E — Live Agent
// ─────────────────────────────────────────────────────────────
const liveAgent = {
  base: {
    id: 'feature-agent',
    label: 'E — Live Agent',
    position: 'after-grid',
    layout: 'copy-left',
    showAppButtons: true,
    media: {
      type: 'video-autoplay',
      src: 'https://www.ourbond.com/wp-content/themes/bond/src/gifs/video-monitor-me.mp4',
      alt: 'Video Monitor Me',
    },
  },
  variants: {
    // Generic family framing (default for most pages)
    family: {
      eyebrow: 'Live security agents',
      headline: 'A real person. One tap away. Any time.',
      body: "When something feels wrong, your family shouldn't have to face it alone. Bond's trained security agents are available 24/7 — via video, audio, or text — ready to help in seconds and coordinate with first responders if things escalate.",
      bullets: [
        'Trained and certified agents, not call-center scripts',
        'Available via video, audio, or text',
        'Coordinates police, fire, and EMS on your behalf',
        'No security need is too small',
      ],
    },
    // Families (explicit alias)
    families: {
      headline: 'A real person watching over your whole family.',
      body: "Bond's trained agents are available around the clock — one tap from any family member, any time. Whether it's a scary situation or just something that feels off, a real human responds in seconds.",
      bullets: [
        'Available to every member of your family, 24/7',
        'Video, audio, or text — however they feel safest',
        'Coordinates with police, fire, and EMS instantly',
        'Agents stay on the line until help arrives',
      ],
    },
    // Individual
    individual: {
      headline: 'One tap from a real person — any time you need it.',
      body: "You don't have to face it alone. Bond's trained security agents are one tap away — any time, any situation. They'll stay with you, coordinate help, and make sure you're safe.",
      bullets: [
        'Real agents available via video, audio, or text',
        'Available 24/7 — day, night, weekends',
        'Can call 911 and share your location on your behalf',
        'No situation is too small to reach out',
      ],
    },
    // Students
    students: {
      headline: 'Your student is never truly alone.',
      body: "If something feels wrong on campus or on the way home, Bond's agents are one tap away — ready to help, coordinate with campus security or 911, and stay on the line until they're safe.",
      bullets: [
        'One-tap access to a live agent, 24/7',
        'Can contact campus security or 911 on their behalf',
        'Available via video, audio, or text',
        'Agents stay engaged until the situation resolves',
      ],
    },
    // Solo travelers
    soloTravel: {
      headline: 'Help that travels with you.',
      body: "Whether you're navigating a foreign city at midnight or waiting for a rideshare in an unfamiliar place — Bond's agents are one tap away, wherever you are in the world.",
      bullets: [
        'Available in every major city and country',
        'Can contact local emergency services on your behalf',
        'Video, audio, or text — whatever feels safest',
        'Real agents, not automated scripts',
      ],
    },
    // Nightlife / dating
    nightlife: {
      headline: 'Stay discreet. Stay connected. Get help fast.',
      body: "If you sense something is wrong, Bond's agents are one tap away — watching your location, ready to act, and completely invisible to anyone around you.",
      bullets: [
        'Discreet one-tap activation — no one around you knows',
        'Agent sees your location and situation in real time',
        'Can contact 911 and share your GPS instantly',
        'Available at 2am just as easily as 2pm',
      ],
    },
    // Lone workers
    loneWorkers: {
      headline: 'A safety agent on every solo shift.',
      body: "If a lone worker finds themselves in an unsafe situation, Bond's trained agents are one tap away — able to escalate to emergency services, dispatch help, and stay on the line until the situation is resolved.",
      bullets: [
        'Available throughout every solo shift, 24/7',
        'Can escalate to 911 and provide GPS location instantly',
        'Video, audio, or text check-in available',
        'Reduces employer liability and improves duty of care',
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────
// SECTION F — Hook CTA
// ─────────────────────────────────────────────────────────────
const hookCta = {
  base: {
    label: 'F — Hook CTA',
    showAppButtons: true,
  },
  variants: {
    // Family framing (default for most pages)
    family: {
      headline: "Most parents find out something went wrong\nafter it already happened.",
      body: "Bond keeps you one step ahead. Real-time location. Instant arrival alerts. A live agent seconds away — before you ever need to call 911.",
    },
    individual: {
      headline: "Most people hope nothing goes wrong.\nBond makes sure you're covered either way.",
      body: "Real-time tracking. A live agent one tap away. Automatic alerts when something changes. Everything you need before you ever need it.",
    },
    students: {
      headline: "Most parents don't find out something went wrong\nuntil it's too late.",
      body: "Bond keeps you one step ahead — automatically monitoring every campus trip and alerting you the instant something goes off-plan.",
    },
    soloTravel: {
      headline: "Most travelers only think about safety\nafter something goes wrong.",
      body: "Bond travels with you — live route monitoring, a real agent one tap away, and arrival alerts for the people who care about you back home.",
    },
    nightlife: {
      headline: "Most people assume they'll be fine.\nBond makes sure they are.",
      body: "Discreet, silent, and always watching your route. A live agent one tap away. An automatic alert if you don't make it home.",
    },
    loneWorkers: {
      headline: "Lone worker incidents happen fast.\nResponse time is everything.",
      body: "Bond monitors every solo shift in real time. Automatic check-ins, instant escalation, and a live agent always within reach — before the situation becomes a crisis.",
    },
  },
};

// ─────────────────────────────────────────────────────────────
// SECTION G — Social Proof
// ─────────────────────────────────────────────────────────────
const socialProof = {
  base: {
    label: 'G — Social Proof',
    rating: '4.8 out of 5',
    showAppButtons: true,
    reviewCount: 2,
  },
  variants: {
    // Family framing (default for most pages)
    family: {
      eyebrow: 'Trusted by real families',
      headline: "Loved by\nfamilies\neverywhere.",
    },
    individual: {
      eyebrow: 'Trusted by millions',
      headline: "Loved by people\nwho travel alone.",
    },
    loneWorkers: {
      eyebrow: 'Trusted by employers and workers',
      headline: "Loved by teams\nwho work solo.",
    },
  },
};

// ─────────────────────────────────────────────────────────────
// Export registry
// ─────────────────────────────────────────────────────────────
const sections = {
  featureCards,
  arrivalAlerts,
  liveAgent,
  hookCta,
  socialProof,
};

export default sections;
