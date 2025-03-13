// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, access-control-allow-credentials, access-control-allow-methods, access-control-allow-origin, access-control-allow-headers',
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
    const placeId = requestUrl.searchParams.get("placeId");

    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": `${Deno.env.get('GOOGLE_MAPS_KEY')}`,
        "X-Goog-FieldMask": "displayName,formattedAddress,rating,userRatingCount,googleMapsUri,photos"//,reviews" 
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
})
