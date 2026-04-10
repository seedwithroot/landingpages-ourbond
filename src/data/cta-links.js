/**
 * Centralized CTA (Call-to-Action) links for all OurBond pages.
 * 
 * Edit links here once, and they update across all pages and components.
 * 
 * Usage:
 *   import { ctaLinks, getAppStoreLink, getGooglePlayLink } from '../../data/cta-links.js';
 *   <a href={getAppStoreLink('hero')}>Download on App Store</a>
 */

// Base OneLink URL (same for all CTAs)
const BASE_ONELINK = 'https://tg17.onelink.me/a7NX?deep_link_value=redeem_code&af_sub1=redeem_code&pid=custom_paid_ad&c=2026sprintdtc&code=SPRINGBOND&deep_link_sub1=SPRINGBOND&af_sub2=SPRINGBOND';

export const ctaLinks = {
  /**
   * Primary CTA link - for all non-pricing-table buttons
   * Used in: hero sections, feature CTAs, footer, header, general page CTAs
   */
  primary: BASE_ONELINK,

  /**
   * Pricing table - Individual plan CTA
   * Used in: pricing tables for Individual plan "Try 30 days free" button
   */
  pricingIndividual: BASE_ONELINK,

  /**
   * Pricing table - Family plan CTA
   * Used in: pricing tables for Family plan "Try 30 days free" button
   */
  pricingFamily: BASE_ONELINK,

  /**
   * App Store download link (base)
   * Used in: app store buttons throughout the site
   */
  appStore: BASE_ONELINK,

  /**
   * Google Play download link (base)
   * Used in: Google Play buttons throughout the site
   */
  googlePlay: BASE_ONELINK,
};

/**
 * Get App Store link with section tracking
 * @param {string} section - The section identifier (e.g., 'hero', 'feature', 'nav', 'cta', 'footer')
 * @returns {string} The OneLink URL with af_sub5 tracking parameter
 */
export function getAppStoreLink(section = 'unknown') {
  return `${BASE_ONELINK}&af_sub5=ios-${section}`;
}

/**
 * Get Google Play link with section tracking
 * @param {string} section - The section identifier (e.g., 'hero', 'feature', 'nav', 'cta', 'footer')
 * @returns {string} The OneLink URL with af_sub5 tracking parameter
 */
export function getGooglePlayLink(section = 'unknown') {
  return `${BASE_ONELINK}&af_sub5=android-${section}`;
}

/**
 * Get the appropriate CTA link for a pricing plan
 * @param {'individual'|'family'} planType - The type of pricing plan
 * @returns {string} The CTA link URL
 */
export function getPricingCTA(planType) {
  if (planType === 'individual') {
    return ctaLinks.pricingIndividual;
  }
  if (planType === 'family') {
    return ctaLinks.pricingFamily;
  }
  return '#';
}
