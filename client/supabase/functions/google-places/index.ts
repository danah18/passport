// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  try {
    // Request header field access-control-allow-origin is not allowed by Access-Control-Allow-Headers in preflight response.
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,x-client-info, Authorization, apikey,access-control-allow-origin',
          "Access-Control-Allow-Credentials": "true",
          "Vary": "Origin", // Helps browsers handle different origins properly
        },
      });
    }

    const requestUrl = new URL(req.url);
    const placeId = requestUrl.searchParams.get("placeId");
    
    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": `${Deno.env.get('EXPO_PUBLIC_GOOGLE_MAPS_KEY')}`,
        "X-Goog-FieldMask": "displayName,formattedAddress,rating,userRatingCount,googleMapsUri,photos"//,reviews" 
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

      const data = await response.json();

      return new Response(
        JSON.stringify(data),
        { headers: { 
          "Content-Type": "application/json", 
          "Access-Control-Allow-Origin": "*",  // CORS header for temp local development
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,x-client-info, Authorization, apikey,access-control-allow-origin',
          "Access-Control-Allow-Credentials": "true",
          "Vary": "Origin", // Helps browsers handle different origins properly
        } },
      )
  } catch (error) {
      console.error("Fetch error:", error);
      throw error;
  }
})
