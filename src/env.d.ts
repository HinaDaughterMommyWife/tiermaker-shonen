/// <reference types="astro/client" />

// Virtual module provided by wrangler / @astrojs/cloudflare at runtime.
// Declare it here so astro check and tsc resolve the import.
declare module "cloudflare:workers" {
  const env: Env;
  export { env };
}
