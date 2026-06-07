/**
 * Centralized env var access with simple feature detection.
 * Anything missing returns undefined — callers should degrade gracefully.
 */

const adminEmailsRaw = process.env.ADMIN_EMAILS ?? "";

export const env = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://askscripture.com",
  adminEmails: adminEmailsRaw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripePricePro: process.env.STRIPE_PRICE_PRO,
  // Resend (email digest, transactional)
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL ?? "AskScripture <hello@askscripture.com>",
  // Search Console / Bing Webmaster verification
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,
  bingSiteVerification: process.env.BING_SITE_VERIFICATION,
  // Cron security
  cronSecret: process.env.CRON_SECRET,
};

export const features = {
  /** AI chat + content generation requires this */
  ai: !!env.anthropicApiKey,
  /** Auth, persisted notes/highlights/bookmarks, freemium tracking */
  supabase: !!(env.supabaseUrl && env.supabaseAnonKey),
  /** Stripe checkout, donations, paid tier */
  stripe: !!env.stripeSecretKey,
  /** Email digest delivery */
  email: !!env.resendApiKey,
} as const;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return env.adminEmails.includes(email.toLowerCase());
}
