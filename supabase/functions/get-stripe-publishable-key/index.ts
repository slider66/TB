import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_SECRET_NAME = "Stripe";
const FALLBACK_ENV_KEYS = [
  DEFAULT_SECRET_NAME,
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_PUBLIC_KEY",
  "STRIPE_PK",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const payload = await req.json().catch(() => ({}));
    const requestedSecret = (() => {
      const name = payload?.secretName;
      return typeof name === "string" && name.trim().length > 0
        ? name.trim()
        : DEFAULT_SECRET_NAME;
    })();

    const candidateKeys = new Set<string>([
      requestedSecret,
      ...FALLBACK_ENV_KEYS,
      requestedSecret.toUpperCase(),
    ]);

    let publishableKey: string | undefined;

    for (const keyName of candidateKeys) {
      const value = Deno.env.get(keyName);
      if (value) {
        publishableKey = value;
        break;
      }
    }

    if (!publishableKey) {
      return new Response(
        JSON.stringify({
          error:
            `No se encontro ninguna clave publica de Stripe para el secreto ${requestedSecret}.`,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        key: publishableKey,
        secretName: requestedSecret,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("get-stripe-publishable-key error:", error);
    return new Response(
      JSON.stringify({
        error: "Error al recuperar la clave publica de Stripe.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
