# Security Quick Reference Guide

## What Has Been Protected

### XSS (Cross-Site Scripting) Protection
- All user inputs are sanitized before display
- Filenames, URLs, and error messages are escaped
- Uses `textContent` instead of `innerHTML` where possible

### SSRF (Server-Side Request Forgery) Protection
- URL validation blocks localhost and private IPs
- Only `http://` and `https://` protocols allowed
- Prevents access to internal network resources

### File Upload Protection
- File extension validation (only RDF formats)
- File size limits (100MB max)
- Path traversal protection (blocks `../`, `\`, etc.)
- Filename sanitization

### DoS (Denial of Service) Protection
- Rate limiting: 5 requests per minute
- Client-side throttling with countdown
- File size restrictions

### Information Disclosure Prevention
- Generic error messages for users
- Detailed errors only in console
- No stack traces exposed

### Security Headers
- X-Frame-Options: DENY (clickjacking protection)
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled
- Referrer-Policy: strict-origin-when-cross-origin
- Content Security Policy configured

### Dependency Security
- Subresource Integrity (SRI) on external scripts
- CORS enabled on external resources
- Referrer policy set

---

## Quick Security Checklist for Deployment

### Before Going Live:

1. **HTTPS Configuration**
   - [ ] HTTPS enabled
   - [ ] HTTP redirects to HTTPS
   - [ ] HSTS header configured

2. **Headers Setup** (if using Netlify/Cloudflare)
   - [ ] Copy `_headers` file to your hosting
   - [ ] Verify CSP is active (check browser console)
   - [ ] Test all security headers

3. **Testing**
   - [ ] Test rate limiting (submit form 6 times quickly)
   - [ ] Try invalid file upload (e.g., .exe, .pdf)
   - [ ] Try invalid URL (e.g., file://, localhost)
   - [ ] Check error messages don't leak info

4. **Dependencies**
   - [ ] Consider upgrading jQuery (currently 1.11.1)
   - [ ] Update all dependencies
   - [ ] Verify SRI hashes are correct

5. **Backend** (on rdf-to-csvw.onrender.com)
   - [ ] Server-side input validation
   - [ ] Server-side rate limiting
   - [ ] File upload scanning
   - [ ] CORS properly configured

---

## Common Attack Scenarios & Protection

| Attack | How Protected | File |
|--------|---------------|------|
| XSS via filename | `sanitizeText()` escapes special chars | `security.js` |
| XSS via URL | `sanitizeText()` + URL validation | `security.js` |
| SSRF via URL input | `isValidURL()` blocks private IPs | `security.js` |
| Path traversal | `isValidFilename()` blocks `../` | `security.js` |
| DoS via spam | `RateLimiter` class (5/min) | `security.js` |
| Malicious file type | Extension validation | `security.js` |
| Huge file upload | Size check (100MB max) | `security.js` |
| Error info leak | `getSafeErrorMessage()` | `security.js` |
| CDN compromise | SRI hashes verify integrity | `head.html`, `converter.md` |
| Clickjacking | X-Frame-Options: DENY | `head.html` |

---

## How to Use Security Functions

### In JavaScript Code:

```javascript
// Sanitize text before displaying
const userInput = "User's <script>alert('xss')</script>";
const safe = sanitizeText(userInput);
element.textContent = safe; // Displays as text, not HTML

// Or use the helper
setTextSafely(element, userInput);

// Validate URL before using
if (isValidURL(userUrl)) {
  // URL is safe to use
} else {
  // Show error
}

// Validate file
const validation = validateFormData(formData);
if (!validation.isValid) {
  alert(validation.errors.join('\n'));
}

// Check rate limit
if (!rateLimiter.allowRequest()) {
  alert('Too many requests!');
  return;
}

// Display safe error
try {
  // ... code ...
} catch (error) {
  const safeMsg = getSafeErrorMessage(error, 'en');
  setTextSafely(errorElement, safeMsg);
}
```

---

## Security Maintenance Schedule

### Weekly
- Check browser console for security warnings
- Monitor user reports of issues

### Monthly  
- Run security scan: https://securityheaders.com
- Check for dependency updates
- Review rate limit effectiveness

### Quarterly
- Update dependencies
- Review and test security controls
- Update threat model if needed

### Annually
- Full security audit
- Penetration testing (if budget allows)

---

## Recommended Tools

### Testing
- **OWASP ZAP**: Free security scanner
- **Burp Suite**: Web security testing
- **Browser DevTools**: Check CSP, headers

### Monitoring
- **Security Headers**: https://securityheaders.com
- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **Mozilla Observatory**: https://observatory.mozilla.org/

### Code Quality
- **npm audit**: Check for vulnerable dependencies
- **Snyk**: Dependency vulnerability scanner
- **ESLint**: With security plugins

---

## Known Limitations

### Client-Side Only
This implementation is **client-side only**. Important limitations:

1. **Rate limiting** can be bypassed (client-side only)
   - Recommendation: Add server-side rate limiting

2. **File validation** can be circumvented
   - Recommendation: Validate files on server

3. **URL validation** is advisory
   - Recommendation: Validate URLs on server

4. **No authentication** implemented
   - Add if needed in future

### GitHub Pages Limitations
- Cannot set custom HTTP headers directly
- Solutions:
  - Use Netlify (supports `_headers` file)
  - Use Cloudflare (configure headers in dashboard)
  - Use meta tags (partial support)

---

## Emergency Response

### If You Detect an Attack:

1. **Immediate Actions**
   - Block attacker's IP (if possible)
   - Review logs for extent of attack
   - Check for data breach

2. **Investigation**
   - Identify attack vector
   - Assess damage
   - Document incident

3. **Remediation**
   - Patch vulnerability
   - Update security controls
   - Monitor for repeat attempts

4. **Post-Incident**
   - Update this documentation
   - Inform users if needed
   - Improve detection/prevention

---

## Resources

- Full documentation: `SECURITY.md`
- Security functions: `assets/security.js`
- Implementation: `assets/sendPost.js`

---
