/**
 * Django API Integration for Astro
 * 
 * This module provides utilities to fetch data from the Django backend API
 * during Astro's build process.
 */

const DJANGO_API_URL = import.meta.env.DJANGO_API_URL || 'http://web:8000';
const DJANGO_API_KEY = import.meta.env.DJANGO_API_KEY;

/**
 * Fetch data from Django API with authentication
 */
async function fetchFromDjango(endpoint) {
  const url = `${DJANGO_API_URL}${endpoint}`;
  
  console.log(`[Django API] Fetching: ${url}`);
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (DJANGO_API_KEY) {
    headers['Authorization'] = `Api-Key ${DJANGO_API_KEY}`;
  }
  
  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Django API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`[Django API] Error fetching ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Get landing page data for a business unit
 * @param {string} businessUnitUUID - The UUID of the business unit
 */
export async function getBusinessUnitLandingPageData(businessUnitUUID) {
  return fetchFromDjango(`/api/v1/bu/${businessUnitUUID}/landing-page-data/`);
}

/**
 * Get business unit information
 * @param {string} businessUnitUUID - The UUID of the business unit
 */
export async function getBusinessUnitInfo(businessUnitUUID) {
  return fetchFromDjango(`/bu/${businessUnitUUID}/`);
}

/**
 * Get pages for a business unit
 * @param {string} businessUnitUUID - The UUID of the business unit
 */
export async function getBusinessUnitPages(businessUnitUUID) {
  return fetchFromDjango(`/api/business-units/${businessUnitUUID}/pages/`);
}

/**
 * Get performance stats for a business unit
 * @param {string} businessUnitUUID - The UUID of the business unit
 * @param {number} days - Number of days to fetch stats for
 */
export async function getBusinessUnitStats(businessUnitUUID, days = 30) {
  return fetchFromDjango(`/bu/${businessUnitUUID}/${days}/`);
}

/**
 * Example: Get data from content.json (if stored in Django)
 * @param {string} businessUnitUUID - The UUID of the business unit
 */
export async function getBusinessUnitContent(businessUnitUUID) {
  return fetchFromDjango(`/bu/${businessUnitUUID}/content/`);
}
