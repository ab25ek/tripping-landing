/* ============================================================================
   TRIPPING — LANDING PAGE CONFIG
   ----------------------------------------------------------------------------
   ⚡️  THIS IS THE ONE FILE ABISEK EDITS ON LAUNCH DAY.  ⚡️
   Everything about the two call-to-action buttons is driven from here.
   No other file needs to change to flip the page from "waitlist" to "live".
   ============================================================================

   HOW THE BUTTONS BEHAVE
   ----------------------------------------------------------------------------
   PRIMARY button:
     • APP_STORE_URL is EMPTY  ->  orange "Waitlist now"  ->  opens the Tally form
     • APP_STORE_URL is SET    ->  official App Store badge -> links to the app

   SECONDARY "Try the Beta" button:
     • BETA_URL is EMPTY  ->  button DOES NOT RENDER AT ALL (no dead buttons)
     • BETA_URL is SET    ->  button appears, links to your TestFlight invite

   TALLY_FORM_URL:
     • This is the public waitlist form the primary button opens while
       APP_STORE_URL is still empty. It MUST be set for the waitlist to work.
   ============================================================================ */

const CONFIG = {

  // ── LIVE ON THE APP STORE ─────────────────────────────────────────────
  // Set = the primary CTA is the official "Download on the App Store" badge.
  // Clear to "" to fall back to the orange "Waitlist now" button (Tally).
  // The id-only link auto-redirects each visitor to their own storefront.
  APP_STORE_URL: "https://apps.apple.com/app/id6789317828",

  // ── FLIP ME WHEN TESTFLIGHT EXTERNAL TESTING CLEARS REVIEW ─────────────
  // Paste your public TestFlight invite link here.
  // Leave as "" and the "Try the Beta" button stays hidden entirely.
  //   e.g. "https://testflight.apple.com/join/xxxxxxxx"
  BETA_URL: "",

  // ── THE WAITLIST FORM ─────────────────────────────────────────────────
  // Your published Tally form. Opens in a modal when the primary button is
  // the "Waitlist now" button. Already set below — no action needed.
  TALLY_FORM_URL: "https://tally.so/r/vG1Pol",

};

// (do not edit below this line) --------------------------------------------
window.TRIPPING_CONFIG = CONFIG;
