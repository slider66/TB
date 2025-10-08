import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const securityHeaders: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; connect-src 'self' https://*.supabase.co https://api.resend.com https://www.virustotal.com https://www.google.com https://www.gstatic.com https://challenges.cloudflare.com; img-src 'self' data: blob:; script-src 'self' https://www.gstatic.com/recaptcha/ https://www.google.com/recaptcha/ https://challenges.cloudflare.com/turnstile/; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-Content-Type-Options": "nosniff",
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    headers: securityHeaders,
    open: false,
  },
  preview: {
    headers: securityHeaders,
  },
  build: {
    sourcemap: true,
  },
});
