# Specification

## Summary
**Goal:** Ensure the 7 Bucks logo reliably displays across the app and add a working PWA install prompt experience.

**Planned changes:**
- Fix the logo asset reference so it loads from a correct static path included in production builds for both the login screen and authenticated header.
- Add a graceful UI fallback (e.g., styled “7 Bucks” wordmark block) when the logo image fails to load, avoiding broken-image placeholders.
- Configure PWA support by adding/linking a web app manifest that references the existing generated icons and includes required metadata (name/short_name, start_url, display mode, theme/background colors).
- Register a service worker so supported browsers recognize the app as installable.
- Add an in-app “Install app” control that appears only when installation is supported, triggers the native install prompt, and updates after accept/dismiss; make it accessible on the login screen and in authenticated views.

**User-visible outcome:** Users see the 7 Bucks logo (or a clean fallback) on login and after sign-in, and can install the app via an “Install app” button when their browser supports PWA installation.
