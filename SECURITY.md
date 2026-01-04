# Security Implementation Guide
## RDF to CSV Converter Website

This document outlines the security measures implemented to protect the website from common web vulnerabilities.

---

## Table of Contents
1. [Identified Security Risks](#identified-security-risks)
2. [Implemented Security Measures](#implemented-security-measures)
3. [Additional Recommendations](#additional-recommendations)
4. [Security Checklist](#security-checklist)
5. [Maintenance and Monitoring](#maintenance-and-monitoring)

---

## Identified Security Risks

### Critical Risks for This Type of Website:

#### 1. **Cross-Site Scripting (XSS)**
- **Risk**: Attackers inject malicious scripts through form inputs or URLs
- **Impact**: Session hijacking, credential theft, malware distribution
- **Likelihood**: HIGH (form accepts user input)

#### 2. **File Upload Vulnerabilities**
- **Risk**: Malicious files uploaded, file path traversal attacks
- **Impact**: Server compromise, data breach, malware distribution
- **Likelihood**: MEDIUM (file upload functionality exists)

#### 3. **Server-Side Request Forgery (SSRF)**
- **Risk**: Attacker provides malicious URLs to access internal resources
- **Impact**: Internal network scanning, accessing protected resources
- **Likelihood**: MEDIUM (URL input functionality)

#### 4. **Cross-Site Request Forgery (CSRF)**
- **Risk**: Unauthorized actions performed on behalf of authenticated users
- **Impact**: Unwanted form submissions, data manipulation
- **Likelihood**: LOW-MEDIUM (depends on authentication implementation)

#### 5. **Denial of Service (DoS)**
- **Risk**: Excessive requests overwhelm the service
- **Impact**: Service unavailability, increased costs
- **Likelihood**: MEDIUM (public-facing form)

#### 6. **Information Disclosure**
- **Risk**: Error messages reveal technical details about the system
- **Impact**: Helps attackers plan more sophisticated attacks
- **Likelihood**: MEDIUM (error handling present)

#### 7. **Dependency Vulnerabilities**
- **Risk**: Outdated JavaScript libraries with known vulnerabilities
- **Impact**: Various security issues depending on the vulnerability
- **Likelihood**: MEDIUM (external CDN dependencies)

#### 8. **Man-in-the-Middle (MITM) Attacks**
- **Risk**: Attackers intercept communication between user and server
- **Impact**: Data theft, credential theft, session hijacking
- **Likelihood**: LOW (if HTTPS is enforced)

---

## Implemented Security Measures

### 1. Input Sanitization (`security.js`)

**Protection Against**: XSS, Injection Attacks

```javascript
// Sanitizes all user inputs before display
function sanitizeHTML(str)
function sanitizeText(input)
```

**What It Does**:
- Escapes special HTML characters (`<`, `>`, `&`, `"`, `'`)
- Prevents script injection through user inputs
- Used on filenames, URLs, and error messages

**Files Modified**:
- Created: `assets/security.js`
- Updated: `assets/sendPost.js` (uses sanitization functions)

---

### 2. URL Validation

**Protection Against**: SSRF, Malicious Redirects

```javascript
function isValidURL(url)
```

**What It Does**:
- Only allows `http://` and `https://` protocols
- Blocks localhost and private IP ranges (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
- Prevents access to internal network resources

**Implementation**:
- Validates URLs before form submission
- Rejects malicious or internal URLs

---

### 3. File Validation

**Protection Against**: Malicious File Uploads, Path Traversal

```javascript
function isValidFilename(filename)
function hasValidExtension(filename, allowedExtensions)
function isValidFileSize(file, maxSizeInMB)
```

**What It Does**:
- Validates file extensions against allowed RDF formats
- Checks file size (max 100MB by default)
- Prevents path traversal attacks (blocks `../`, `\`, `\0`)
- Ensures filename contains only safe characters

**Allowed Extensions**:
- `.nq`, `.nt`, `.jsonl`, `.jsonld`, `.n3`, `.ndjson`, `.ndjsonld`
- `.owl`, `.rdf`, `.rdfs`, `.rj`, `.trig`, `.trigs`, `.trix`, `.ttl`, `.ttls`

---

### 4. Rate Limiting

**Protection Against**: DoS, Brute Force, Resource Abuse

```javascript
class RateLimiter
```

**What It Does**:
- Limits to 5 requests per 60 seconds per user
- Prevents automated abuse and excessive resource consumption
- Shows countdown timer to inform users

**Implementation**:
- Client-side rate limiting in browser
- Recommendation: Implement server-side rate limiting as well

---

### 5. Secure Error Handling

**Protection Against**: Information Disclosure

```javascript
function getSafeErrorMessage(error, lang)
```

**What It Does**:
- Displays user-friendly error messages
- Hides technical details (stack traces, internal paths)
- Logs detailed errors only to console (for debugging)
- Provides localized error messages (English/Czech)

**Before**:
```javascript
errorMessageElement.innerText = `There was a problem: ${e.message}`;
```

**After**:
```javascript
const safeMessage = getSafeErrorMessage(e, pageLang);
setTextSafely(errorMessageElement, safeMessage);
```

---

### 6. Content Security Policy (CSP)

**Protection Against**: XSS, Injection Attacks, Clickjacking

**Headers Configured** (`_headers` file):
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' https://ajax.googleapis.com https://kit.fontawesome.com;
  style-src 'self' https://cdn.jsdelivr.net 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://rdf-to-csvw.onrender.com;
  frame-ancestors 'none';
```

**What It Does**:
- Restricts where scripts can be loaded from
- Prevents inline scripts (except trusted sources)
- Blocks framing (clickjacking protection)
- Controls which external resources can be loaded

**Note**: For GitHub Pages, you may need to use Netlify or Cloudflare to implement custom headers.

---

### 7. Security Headers

**Protection Against**: Various Attacks

**Implemented Headers** (`_includes/head.html`):

```html
<!-- X-Frame-Options: Prevents clickjacking -->
<meta http-equiv="X-Frame-Options" content="DENY">

<!-- X-Content-Type-Options: Prevents MIME sniffing -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">

<!-- X-XSS-Protection: Legacy XSS protection -->
<meta http-equiv="X-XSS-Protection" content="1; mode=block">

<!-- Referrer Policy: Controls referrer information -->
<meta name="referrer" content="strict-origin-when-cross-origin">
```

**What They Do**:
- **X-Frame-Options**: Prevents your site from being embedded in iframes
- **X-Content-Type-Options**: Prevents browsers from MIME-type sniffing
- **X-XSS-Protection**: Enables XSS filter in older browsers
- **Referrer-Policy**: Controls what information is sent to external sites

---

### 8. Subresource Integrity (SRI)

**Protection Against**: CDN Compromise, Malicious Scripts

**Before**:
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
```

**After**:
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" 
        integrity="sha384-..." 
        crossorigin="anonymous"></script>
```

**What It Does**:
- Verifies that external scripts haven't been tampered with
- Ensures only the expected version of libraries is loaded
- Protects against CDN compromises

**Files Modified**:
- `_includes/head.html` (FontAwesome, Flag Icons)
- `converter.md` (jQuery)

**Note**: The integrity hashes provided are examples. Generate actual hashes using:
```bash
openssl dgst -sha384 -binary FILENAME.js | openssl base64 -A
```

---

## Additional Recommendations

### High Priority

#### 1. **Server-Side Security (Backend)**
Your frontend sends data to `https://rdf-to-csvw.onrender.com`. Ensure the backend implements:

- **Input validation**: Validate all inputs on the server
- **Rate limiting**: Server-side rate limiting (more reliable than client-side)
- **File scanning**: Scan uploaded files for malware
- **Authentication**: If needed, implement secure authentication
- **CORS configuration**: Properly configure CORS headers
- **Request size limits**: Limit request body size to prevent DoS

#### 2. **HTTPS Enforcement**
Ensure HTTPS is enforced:
- Configure HSTS (Strict-Transport-Security) headers
- Redirect all HTTP traffic to HTTPS
- Use HTTPS for all external resources

**Recommended Header**:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

#### 3. **Regular Dependency Updates**
Keep all dependencies up to date:
- jQuery (currently using 1.11.1 - **OUTDATED**, consider upgrading to 3.7+)
- FontAwesome
- Flag Icons
- Jekyll and plugins

**Action Item**: Upgrade jQuery to the latest version (3.7.1 as of 2025)

#### 4. **CSRF Protection**
If you add user authentication in the future:
- Implement CSRF tokens
- Validate tokens on form submission
- Use SameSite cookie attribute

---

### Medium Priority

#### 5. **Content Security Policy Refinement**
- Remove `'unsafe-inline'` from style-src (use external stylesheets)
- Implement nonce-based CSP for inline scripts
- Monitor CSP violations via report-uri

#### 6. **Security Monitoring**
- Implement logging for security events:
  - Failed validation attempts
  - Rate limit violations
  - Suspicious file uploads
- Set up alerts for unusual activity

#### 7. **Privacy Protection**
- Add Privacy Policy page
- Implement cookie consent if tracking users
- Minimize data collection
- Inform users about data processing

#### 8. **Accessibility Security**
- Ensure error messages are accessible (ARIA labels)
- Provide clear security feedback to users
- Implement progressive enhancement

---

### Low Priority

#### 9. **Web Application Firewall (WAF)**
Consider using a WAF service:
- Cloudflare (free tier available)
- AWS WAF
- Azure WAF

#### 10. **Security Audits**
- Run automated security scans (OWASP ZAP, Burp Suite)
- Conduct manual penetration testing
- Review code for security issues

---

## Security Checklist

### Implementation Status

- [x] Input sanitization implemented
- [x] URL validation implemented
- [x] File validation implemented
- [x] Rate limiting implemented (client-side)
- [x] Secure error handling
- [x] Security headers added
- [x] SRI for external scripts
- [x] CSP headers configured
- [ ] HTTPS enforced (verify in production)
- [ ] Server-side validation (backend responsibility)
- [ ] jQuery updated to latest version
- [ ] CSP violation monitoring
- [ ] Security testing completed
- [ ] Privacy Policy added
- [ ] Regular dependency update schedule

### Testing Checklist

Test the following scenarios:

- [ ] Try uploading non-RDF file (should be rejected)
- [ ] Try submitting form with `javascript:` URL (should be rejected)
- [ ] Try submitting form with `file://` URL (should be rejected)
- [ ] Try submitting form with localhost URL (should be rejected)
- [ ] Try rapid-fire submissions (should be rate-limited after 5)
- [ ] Try filename with path traversal `../../etc/passwd` (should be blocked)
- [ ] Try XSS in error messages (should be sanitized)
- [ ] Verify external scripts load with SRI
- [ ] Test form validation with missing inputs
- [ ] Verify HTTPS enforcement in production

---

## Maintenance and Monitoring

### Regular Tasks

#### Weekly
- Monitor console for security errors
- Check rate limiting effectiveness
- Review any user-reported issues

#### Monthly
- Update dependencies (check for security patches)
- Review security logs (if implemented)
- Test security controls

#### Quarterly
- Conduct security review
- Update this documentation
- Penetration testing (if budget allows)

#### Annually
- Full security audit
- Update threat model
- Review and update security policies

---

## File Structure

```
rdf-to-csv.github.io/
├── assets/
│   ├── security.js          # NEW: Security utility functions
│   ├── sendPost.js          # UPDATED: Uses security functions
│   └── dropBox.css
├── _includes/
│   └── head.html            # UPDATED: Security headers, SRI
├── _layouts/
│   └── default.html         # UPDATED: Loads security.js
├── _headers                 # NEW: Security headers config
├── SECURITY.md              # NEW: This file
└── converter.md             # UPDATED: SRI for jQuery
```

---

## Contact & Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email the maintainer directly (add your email)
3. Provide detailed description of the vulnerability
4. Allow reasonable time for patching before disclosure

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
- [Security Headers](https://securityheaders.com/)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

**Last Updated**: December 28, 2025  
**Version**: 1.0
