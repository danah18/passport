// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST, DELETE, PUT",
    "Access-Control-Allow-Credentials": "true",
  }

  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204, headers: { ...corsHeaders, "Access-Control-Allow-Headers": req.headers.get("Access-Control-Request-Headers") || "*" },
      });
    }

    const requestUrl = new URL(req.url);
    const photoResource = requestUrl.searchParams.get("photoResource");

    const url = `https://places.googleapis.com/v1/${photoResource}/media?maxHeightPx=400&maxWidthPx=400&skipHttpRedirect=true`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": `${Deno.env.get('EXPO_PUBLIC_GOOGLE_MAPS_KEY')}`,
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `[Response.statusText]: ${response.statusText}. [Response.text]: ${response.text}` }),
        {
          status: await response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: await error }),
      {
        status: error.code,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
})