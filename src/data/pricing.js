/**
 * Centralized pricing data for all OurBond pricing pages.
 * 
 * Edit prices here once, and they update across all pricing pages.
 * 
 * Usage:
 *   import { getPricingPlans } from '../../data/pricing.js';
 *   const plans = getPricingPlans('students');
 */

import { ctaLinks } from './cta-links.js';

/** Base pricing tiers - prices are the same across all audiences */
export const basePricing = {
  individual: {
    monthly: { was: '$29.99/mo', price: '$23.99' },
    annual: { was: '$324.99/yr', price: '$21.67', billed: '$259.99 billed annually' },
  },
  family: {
    monthly: { was: '$45.99/mo', price: '$36.99' },
    annual: { was: '$539.99/yr', price: '$35.83', billed: '$429.99 billed annually' },
  },
};

/** Audience-specific features and messaging */
export const audienceFeatures = {
  'lone-workers': {
    individual: {
      featuresLabel: 'What you get:',
      features: [
        'Live agent ready before every shift',
        'Track Me On The Go',
        'Video Monitor Me',
        'Automatic end-of-shift safe return alert',
        'First responders orchestrated if needed',
        'Location sharing with supervisor or safety contact',
        '24/7 coverage',
      ],
    },
    family: {
      subtitle: 'Up to 5 members',
      featuresLabel: 'Everything in Individual, plus:',
      features: [
        'Coverage for up to 5 members',
        'Real-time location of all family members',
        'Arrival and departure alerts for everyone',
        'Shared safety dashboard',
      ],
    },
  },
  'students': {
    individual: {
      featuresLabel: 'What you get:',
      features: [
        'Live agent ready and watching every trip',
        'Track Me On The Go',
        'Video Monitor Me',
        'First responders coordinated if needed',
        'Automatic arrival alerts',
        'Location sharing with trusted contacts',
        '24/7 coverage',
      ],
    },
    family: {
      subtitle: 'Up to 5 members',
      featuresLabel: 'Everything in Individual, plus:',
      features: [
        'Coverage for up to 5 members',
        'Real-time location of all family members',
        'Arrival and departure alerts for everyone',
        'Shared safety dashboard',
      ],
    },
  },
  'nightlife': {
    individual: {
      featuresLabel: 'What you get:',
      features: [
        'Live agent ready before you go out',
        'Track Me On The Go',
        'Video Monitor Me',
        'First responders coordinated if needed',
        'Automatic arrival alerts',
        'Location sharing with trusted friends',
        '24/7 coverage',
      ],
    },
    family: {
      subtitle: 'Up to 5 members',
      featuresLabel: 'Everything in Individual, plus:',
      features: [
        'Coverage for up to 5 members',
        'Real-time location of all group members',
        'Arrival and departure alerts for everyone',
        'Shared safety dashboard',
      ],
    },
  },
  'solo-travel': {
    individual: {
      featuresLabel: 'What you get:',
      features: [
        'Live agent ready before every trip',
        'Track Me On The Go',
        'Video Monitor Me',
        'First responders coordinated if needed',
        'Automatic arrival alerts',
        'Location sharing with emergency contacts',
        '24/7 coverage',
      ],
    },
    family: {
      subtitle: 'Up to 5 members',
      featuresLabel: 'Everything in Individual, plus:',
      features: [
        'Coverage for up to 5 members',
        'Real-time location of all travelers',
        'Arrival and departure alerts for everyone',
        'Shared safety dashboard',
      ],
    },
  },
  'families': {
    individual: {
      featuresLabel: 'What you get:',
      features: [
        'Live agent ready for every family member',
        'Track Me On The Go',
        'Video Monitor Me',
        'First responders coordinated if needed',
        'Automatic arrival and departure alerts',
        'Location sharing with the whole family',
        '24/7 coverage',
      ],
    },
    family: {
      subtitle: 'Up to 5 members',
      featuresLabel: 'Everything in Individual, plus:',
      features: [
        'Coverage for up to 5 members',
        'Real-time location of all family members',
        'Arrival and departure alerts for everyone',
        'Shared safety dashboard',
      ],
    },
  },
  'default': {
    individual: {
      featuresLabel: 'What you get:',
      features: [
        'Live agent ready and watching',
        'Track Me On The Go',
        'Video Monitor Me',
        'First responders coordinated if needed',
        'Automatic arrival alerts',
        'Location sharing with trusted contacts',
        '24/7 coverage',
      ],
    },
    family: {
      subtitle: 'Up to 5 members',
      featuresLabel: 'Everything in Individual, plus:',
      features: [
        'Coverage for up to 5 members',
        'Real-time location of all family members',
        'Arrival and departure alerts for everyone',
        'Shared safety dashboard',
      ],
    },
  },
};

/** Pricing OneLink URLs - Spring 2026 Campaign */
export const pricingLinks = {
  individual: {
    monthly: 'https://tg17.onelink.me/a7NX?deep_link_value=redeem_code&af_sub1=redeem_code&pid=custom_paid_ad&c=2026sprintdtc&code=SPRINGBOND&deep_link_sub1=SPRINGBOND&af_sub2=SPRINGBOND',
    annual: 'https://tg17.onelink.me/a7NX?deep_link_value=redeem_code&af_sub1=redeem_code&pid=custom_paid_ad&c=2026sprintdtc&code=SPRINGBONDYEARLY&deep_link_sub1=SPRINGBONDYEARLY&af_sub2=SPRINGBONDYEARLY',
  },
  family: {
    monthly: 'https://tg17.onelink.me/a7NX?deep_link_value=offer&af_sub1=offer&pid=custom_paid_ad&c=2026sprintdtc&deep_link_sub1=216379&af_sub2=216379',
    annual: 'https://tg17.onelink.me/a7NX?deep_link_value=offer&af_sub1=offer&pid=custom_paid_ad&c=2026sprintdtc&deep_link_sub1=3b128a&af_sub2=3b128a',
  },
};

/**
 * Get pricing plans for a specific audience
 * @param {string} audience - Audience type: 'lone-workers', 'students', 'nightlife', 'solo-travel', 'default'
 * @returns {Array} Array of pricing plan objects
 */
export function getPricingPlans(audience = 'default') {
  const features = audienceFeatures[audience] || audienceFeatures['default'];
  
  return [
    {
      id: 'ind',
      name: 'Individual',
      featured: true,
      ctaText: 'Try 30 days free',
      ctaHref: pricingLinks.individual.monthly,
      ctaHrefMonthly: pricingLinks.individual.monthly,
      ctaHrefAnnual: pricingLinks.individual.annual,
      ...features.individual,
      monthly: basePricing.individual.monthly,
      annual: basePricing.individual.annual,
    },
    {
      id: 'fam',
      name: 'Family',
      ctaText: 'Try 30 days free',
      ctaHref: pricingLinks.family.monthly,
      ctaHrefMonthly: pricingLinks.family.monthly,
      ctaHrefAnnual: pricingLinks.family.annual,
      ...features.family,
      monthly: basePricing.family.monthly,
      annual: basePricing.family.annual,
    },
  ];
}
