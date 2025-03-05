// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Import the PlacesClient using ES module syntax
import { PlacesClient } from "googleplaces";

// // Instantiates a client
const placesClient = new PlacesClient();

Deno.serve(async (req) => {
  try {
    const requestUrl = new URL(req.url);
    const placeId = requestUrl.searchParams.get("placeId");
    
    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": "AIzaSyCc3qVwBWVG5WUPkeLfcIV5NE9DdakgglQ",
        "X-Goog-FieldMask": "displayName,formattedAddress,rating,userRatingCount,googleMapsUri,photos"//,reviews" 
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

      const data = await response.json();

      return new Response(
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json" } },
      )
  } catch (error) {
      console.error("Fetch error:", error);
      throw error;
  }
})