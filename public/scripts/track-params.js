/**
 * AppsFlyer OneLink Parameter Tracking
 * 
 * Captures Google Ads, Facebook, and UTM parameters from the page URL and maps them
 * to AppsFlyer OneLink parameters for proper attribution tracking.
 * 
 * Parameter Mapping (UTM → AppsFlyer):
 * - gclid → af_sub3 (Google Ads Click ID)
 * - fbclid → af_sub4 (Facebook Click ID)
 * - msclkid → af_sub4 (Microsoft Ads Click ID)
 * - utm_source → pid (Media Source / Publisher)
 * - utm_medium → af_adset (Ad Set)
 * - utm_campaign → c (Campaign Name)
 * - utm_content → af_ad (Ad Name/Variation)
 * - utm_term → af_keywords (Keywords)
 * 
 * Usage: Automatically loads in Layout.astro
 */

(function() {
  // OneLink domain to target
  const ONELINK_DOMAIN = 'tg17.onelink.me';

  /**
   * Get tracking parameters from current page URL
   * Returns both standard params and AppsFlyer-mapped params
   */
  function getTrackingParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const afParams = {};
    
    // Map Google Ads Click ID
    const gclid = urlParams.get('gclid');
    if (gclid) {
      afParams['af_sub3'] = gclid;
    }
    
    // Map Facebook Click ID
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
      afParams['af_sub4'] = fbclid;
    }
    
    // Map Microsoft Ads Click ID
    const msclkid = urlParams.get('msclkid');
    if (msclkid) {
      afParams['af_sub4'] = msclkid; // Note: fbclid takes precedence if both exist
    }
    
    // Map UTM Source → Media Source (pid)
    const utmSource = urlParams.get('utm_source');
    if (utmSource) {
      afParams['pid'] = utmSource;
    }
    
    // Map UTM Medium → Ad Set
    const utmMedium = urlParams.get('utm_medium');
    if (utmMedium) {
      afParams['af_adset'] = utmMedium;
    }
    
    // Map UTM Campaign → Campaign Name (c)
    const utmCampaign = urlParams.get('utm_campaign');
    if (utmCampaign) {
      afParams['c'] = utmCampaign;
    }
    
    // Map UTM Content → Ad Name
    const utmContent = urlParams.get('utm_content');
    if (utmContent) {
      afParams['af_ad'] = utmContent;
    }
    
    // Map UTM Term → Keywords
    const utmTerm = urlParams.get('utm_term');
    if (utmTerm) {
      afParams['af_keywords'] = utmTerm;
    }
    
    return afParams;
  }

  /**
   * Append AppsFlyer parameters to a OneLink URL
   */
  function appendParamsToOneLink(url, afParams) {
    if (Object.keys(afParams).length === 0) {
      return url; // No params to add
    }

    try {
      const urlObj = new URL(url);
      
      // Only process OneLink URLs
      if (!urlObj.hostname.includes(ONELINK_DOMAIN)) {
        return url;
      }
      
      // Add AppsFlyer params to the URL (don't override existing params)
      Object.entries(afParams).forEach(([key, value]) => {
        // Only set if not already present (preserves hardcoded defaults)
        if (!urlObj.searchParams.has(key)) {
          urlObj.searchParams.set(key, value);
        }
      });
      
      return urlObj.toString();
    } catch (e) {
      console.warn('[Track Params] Failed to parse URL:', url, e);
      return url;
    }
  }

  /**
   * Update all OneLink CTAs on the page with tracking parameters
   */
  function updateCtaLinks() {
    const afParams = getTrackingParams();
    
    // Only proceed if we have tracking parameters
    if (Object.keys(afParams).length === 0) {
      return;
    }

    // Find all OneLink URLs
    const links = document.querySelectorAll(`a[href*="${ONELINK_DOMAIN}"]`);
    
    links.forEach(link => {
      const originalHref = link.getAttribute('href');
      
      // Skip if already processed
      if (link.hasAttribute('data-tracking-updated')) {
        return;
      }
      
      // Update the href with AppsFlyer params
      const updatedHref = appendParamsToOneLink(originalHref, afParams);
      link.setAttribute('href', updatedHref);
      link.setAttribute('data-tracking-updated', 'true');
    });

    console.log('[OneLink Tracking] Updated links with AppsFlyer params:', afParams);
  }

  /**
   * Store AppsFlyer parameters in sessionStorage for cross-page persistence
   */
  function storeTrackingParams() {
    const afParams = getTrackingParams();
    
    if (Object.keys(afParams).length > 0) {
      sessionStorage.setItem('afTrackingParams', JSON.stringify(afParams));
    }
  }

  /**
   * Load AppsFlyer parameters from sessionStorage
   */
  function loadStoredParams() {
    const stored = sessionStorage.getItem('afTrackingParams');
    return stored ? JSON.parse(stored) : {};
  }

  /**
   * Merge current URL params with stored params (URL takes precedence)
   * This ensures campaign tracking persists across page navigation
   */
  function getMergedTrackingParams() {
    const storedParams = loadStoredParams();
    const currentParams = getTrackingParams();
    
    // Current URL params override stored params
    return { ...storedParams, ...currentParams };
  }

  /**
   * Extract section and platform info from af_sub5 parameter
   * af_sub5 format: "ios-hero", "android-features", etc.
   */
  function parseAfSub5(url) {
    try {
      const urlObj = new URL(url);
      const afSub5 = urlObj.searchParams.get('af_sub5');
      
      if (!afSub5) return null;
      
      const [platform, ...sectionParts] = afSub5.split('-');
      const section = sectionParts.join('-'); // Rejoin in case section has hyphens
      
      return {
        platform: platform, // 'ios' or 'android'
        section: section,   // 'hero', 'features', 'pricing', etc.
        button_location: afSub5 // Full identifier like 'ios-hero'
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * Track button click event to GA4 via dataLayer
   */
  function trackButtonClick(link) {
    const href = link.getAttribute('href');
    const buttonInfo = parseAfSub5(href);
    
    if (!buttonInfo) {
      console.warn('[OneLink Tracking] No af_sub5 found for click tracking:', href);
      return;
    }

    // Push event to dataLayer for GA4
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'download_button_click',
      button_type: 'download',
      platform: buttonInfo.platform,
      section: buttonInfo.section,
      button_location: buttonInfo.button_location,
      link_url: href
    });

    console.log('[OneLink Tracking] Button click tracked:', buttonInfo);
  }

  /**
   * Add click tracking to all OneLink buttons
   */
  function addClickTracking() {
    const links = document.querySelectorAll(`a[href*="${ONELINK_DOMAIN}"]`);
    
    links.forEach(link => {
      // Skip if already has click tracking
      if (link.hasAttribute('data-click-tracked')) {
        return;
      }
      
      // Add click event listener
      link.addEventListener('click', function(e) {
        trackButtonClick(this);
        // Let the click proceed normally
      });
      
      link.setAttribute('data-click-tracked', 'true');
    });
  }

  /**
   * Update all OneLink URLs on the page with merged tracking parameters
   */
  function updateAllLinks() {
    const afParams = getMergedTrackingParams(); // Use merged params for persistence
    
    // Only proceed if we have tracking parameters
    if (Object.keys(afParams).length === 0) {
      return;
    }

    // Find all OneLink URLs
    const links = document.querySelectorAll(`a[href*="${ONELINK_DOMAIN}"]`);
    
    links.forEach(link => {
      const originalHref = link.getAttribute('href');
      
      // Skip if already processed
      if (link.hasAttribute('data-tracking-updated')) {
        return;
      }
      
      // Update the href with AppsFlyer params
      const updatedHref = appendParamsToOneLink(originalHref, afParams);
      link.setAttribute('href', updatedHref);
      link.setAttribute('data-tracking-updated', 'true');
    });

    console.log('[OneLink Tracking] Links updated with params:', afParams);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Store params for this session
    storeTrackingParams();
    
    // Update all CTA links with merged params
    updateAllLinks();
    
    // Add click tracking to all OneLink buttons
    addClickTracking();
    
    // Watch for dynamically added links (e.g., from components)
    const observer = new MutationObserver(() => {
      updateAllLinks();
      addClickTracking(); // Also add click tracking to new links
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
