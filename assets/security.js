// Security utilities for RDF to CSV Converter
// This file contains functions to protect against XSS, injection attacks, and other security threats

/**
 * Sanitize HTML to prevent XSS attacks
 * Escapes special characters that could be used for injection
 * @param {string} str - The string to sanitize
 * @returns {string} - Sanitized string safe for display in HTML
 */
function sanitizeHTML(str) {
  if (typeof str !== 'string') {
    return '';
  }
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Sanitize text for safe display
 * More aggressive than sanitizeHTML, removes all HTML tags
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized text
 */
function sanitizeText(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate URL to prevent malicious redirects and SSRF attacks
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if URL is safe, false otherwise
 */
function isValidURL(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const parsedURL = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedURL.protocol)) {
      return false;
    }
    
    // Prevent localhost and private IP ranges (basic check)
    const hostname = parsedURL.hostname.toLowerCase();
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validate file name to prevent path traversal attacks
 * @param {string} filename - The filename to validate
 * @returns {boolean} - True if filename is safe, false otherwise
 */
function isValidFilename(filename) {
  if (!filename || typeof filename !== 'string') {
    return false;
  }
  
  // Prevent path traversal
  if (filename.includes('..') || 
      filename.includes('/') || 
      filename.includes('\\') ||
      filename.includes('\0')) {
    return false;
  }
  
  // Check for valid filename pattern (alphanumeric, dash, underscore, dot)
  const validPattern = /^[a-zA-Z0-9._-]+$/;
  return validPattern.test(filename);
}

/**
 * Validate file extension against allowed list
 * @param {string} filename - The filename to check
 * @param {Array<string>} allowedExtensions - Array of allowed extensions
 * @returns {boolean} - True if extension is allowed
 */
function hasValidExtension(filename, allowedExtensions) {
  if (!filename || typeof filename !== 'string') {
    return false;
  }
  
  const extension = filename.toLowerCase().split('.').pop();
  return allowedExtensions.map(ext => ext.toLowerCase()).includes(extension);
}

/**
 * Validate file size
 * @param {File} file - The file object to check
 * @param {number} maxSizeInMB - Maximum allowed size in megabytes
 * @returns {boolean} - True if file size is valid
 */
function isValidFileSize(file, maxSizeInMB) {
  if (!file || !file.size) {
    return false;
  }
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Create a safe error message for display to users
 * Prevents information disclosure through error messages
 * @param {Error} error - The error object
 * @param {string} lang - Language code ('en' or 'cs')
 * @returns {string} - Safe error message
 */
function getSafeErrorMessage(error, lang = 'en') {
  // Don't expose technical details to users
  const genericMessages = {
    en: 'An error occurred while processing your request. Please try again later.',
    cs: 'Při zpracování vašeho požadavku došlo k chybě. Zkuste to prosím později.'
  };
  
  // Only show specific messages for expected errors
  const safeErrors = {
    '400': {
      en: 'Invalid request. Please check your input.',
      cs: 'Neplatný požadavek. Zkontrolujte prosím své zadání.'
    },
    '409': {
      en: 'The file is currently in use. Please try again later.',
      cs: 'Soubor je právě používán. Zkuste to prosím později.'
    },
    '413': {
      en: 'The file is too large. Please upload a smaller file.',
      cs: 'Soubor je příliš velký. Nahrajte prosím menší soubor.'
    },
    '429': {
      en: 'Too many requests. Please wait before trying again.',
      cs: 'Příliš mnoho požadavků. Počkejte prosím před dalším pokusem.'
    },
    '503': {
      en: 'Service temporarily unavailable. Please try again later.',
      cs: 'Služba je dočasně nedostupná. Zkuste to prosím později.'
    }
  };
  
  // Extract status code from error message if present
  const statusMatch = error.message?.match(/Error:\s*(\d{3})/);
  if (statusMatch && safeErrors[statusMatch[1]]) {
    return safeErrors[statusMatch[1]][lang] || safeErrors[statusMatch[1]]['en'];
  }
  
  // Log actual error for debugging (only in development)
  console.error('Error details:', error);
  
  return genericMessages[lang] || genericMessages['en'];
}

/**
 * Rate limiting helper
 * Prevents abuse by limiting the number of requests in a time window
 */
class RateLimiter {
  constructor(maxRequests = 5, timeWindowMs = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindowMs = timeWindowMs;
    this.requests = [];
  }
  
  /**
   * Check if a new request is allowed
   * @returns {boolean} - True if request is allowed
   */
  allowRequest() {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(timestamp => 
      now - timestamp < this.timeWindowMs
    );
    
    // Check if we've exceeded the limit
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    // Add the current request
    this.requests.push(now);
    return true;
  }
  
  /**
   * Get time until next request is allowed
   * @returns {number} - Milliseconds until next request allowed
   */
  getTimeUntilNextRequest() {
    if (this.requests.length < this.maxRequests) {
      return 0;
    }
    
    const oldestRequest = Math.min(...this.requests);
    const timeElapsed = Date.now() - oldestRequest;
    return Math.max(0, this.timeWindowMs - timeElapsed);
  }
}

/**
 * Generate a simple nonce for inline scripts (for CSP)
 * In production, this should be generated server-side
 * @returns {string} - A random nonce value
 */
function generateNonce() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Safely set text content of an element
 * Prevents XSS by using textContent instead of innerHTML
 * @param {HTMLElement} element - The element to update
 * @param {string} text - The text to set
 */
function setTextSafely(element, text) {
  if (!element) {
    console.error('Element not found');
    return;
  }
  
  element.textContent = sanitizeText(text);
}

/**
 * Validate preferred languages parameter
 * @param {string} languages - Comma-separated language codes
 * @returns {boolean} - True if valid
 */
function isValidPreferredLanguages(languages) {
  if (!languages || typeof languages !== 'string') {
    return true; // Optional parameter, empty is valid
  }
  
  const trimmed = languages.trim();
  if (trimmed === '') {
    return true; // Empty string is valid
  }
  
  // Pattern: 2-3 letter language codes, comma-separated
  const pattern = /^[a-zA-Z]{2,3}(,[a-zA-Z]{2,3})*$/;
  return pattern.test(trimmed);
}

/**
 * Validate naming convention parameter
 * @param {string} convention - The naming convention
 * @returns {boolean} - True if valid
 */
function isValidNamingConvention(convention) {
  if (!convention || typeof convention !== 'string') {
    return true; // Optional parameter, empty is valid
  }
  
  const trimmed = convention.trim();
  if (trimmed === '') {
    return true; // Empty string is valid
  }
  
  const allowedConventions = [
    'camelCase',
    'PascalCase',
    'snake_case',
    'SCREAMING_SNAKE_CASE',
    'kebab-case',
    'Title Case',
    'dot.notation',
    'original'
  ];
  
  return allowedConventions.includes(trimmed);
}

/**
 * Validate and sanitize form data before submission
 * @param {FormData} formData - The form data to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
function validateFormData(formData) {
  const errors = [];
  const fileURL = formData.get('fileURL');
  const file = formData.get('file');
  
  // Validate that at least one input method is provided
  if (!fileURL && (!file || file.size === 0)) {
    errors.push('Please provide either a file or a URL');
  }
  
  // Validate URL if provided
  if (fileURL && fileURL.trim() !== '') {
    if (!isValidURL(fileURL.trim())) {
      errors.push('Invalid URL provided. Please use a valid http or https URL.');
    }
  }
  
  // Validate file if provided
  if (file && file.size > 0) {
    const allowedExtensions = ['nq', 'nt', 'jsonl', 'jsonld', 'n3', 'ndjson', 'ndjsonld', 'owl', 'rdf', 'rdfs', 'rj', 'trig', 'trigs', 'trix', 'ttl', 'ttls'];
    
    if (!hasValidExtension(file.name, allowedExtensions)) {
      errors.push('Invalid file type. Please upload an RDF file.');
    }
    
    // Check file size (e.g., max 100MB)
    if (!isValidFileSize(file, 100)) {
      errors.push('File is too large. Maximum size is 100MB.');
    }
    
    // Basic filename validation
    const filename = file.name.split('/').pop().split('\\').pop(); // Get just the filename
    if (filename.includes('..') || filename.includes('\0')) {
      errors.push('Invalid filename detected.');
    }
  }
  
  // Validate preferred languages if provided
  const preferredLanguages = formData.get('preferredLanguages');
  if (preferredLanguages && !isValidPreferredLanguages(preferredLanguages)) {
    errors.push('Invalid language codes. Use 2-3 letter codes separated by commas (e.g., en,cs,de).');
  }
  
  // Validate naming convention if provided
  const namingConvention = formData.get('namingConvention');
  if (namingConvention && !isValidNamingConvention(namingConvention)) {
    errors.push('Invalid naming convention selected.');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sanitizeHTML,
    sanitizeText,
    isValidURL,
    isValidFilename,
    hasValidExtension,
    isValidFileSize,
    getSafeErrorMessage,
    RateLimiter,
    generateNonce,
    setTextSafely,
    validateFormData,
    isValidPreferredLanguages,
    isValidNamingConvention
  };
}
