// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  try {
    const requestUrl = new URL(req.url);
    const photoResource = requestUrl.searchParams.get("photoResource");
    
    const url = `https://places.googleapis.com/v1/${photoResource}/media?maxHeightPx=400&maxWidthPx=400&skipHttpRedirect=true`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": "AIzaSyCc3qVwBWVG5WUPkeLfcIV5NE9DdakgglQ",
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

// photo details with place details info
/* To invoke locally:
curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/google-place-photos?photoResource=places/ChIJj61dQgK6j4AR4GeTYWZsKWw/photos/AUy1YQ3bg1dZkr9VoCPFiC9PxvBEqPMIlBkwljuDEEMtPXsuJ82Dmotf0m8e0XAqtvRSWO6c1bxvj2-hQccaAzRZUrZTsSrbsU6ma85-MRzlRJQfE_KGu5GAvqLTFXtWrzqfE-Ux9fEDvyl9ebJo4w2CLd7U8EX_pqH45qMmXYZ2oyxTXQKpn1c57-BGSmQvzbxrbU1PnZvHZ3JBMCD0BEKn5NSf6A-6is4yS38Pho2e0P_h4IhVClQid8FBmNPtCVlzY8IiUxusCSGzChtKGa49G52NOGf0Vb64BVheeqp-OgnWBcAKjdOX-qgv0RygJcfKD7xnK4-Fa3mF3yZbWHcjCM8k4jesraTUvuz8GqlQCIxW1x0F80cyVUsnD3xuY_5cOODwS2PXmdp3d1kCtX7kf1bkOjB4vKGZLQ' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' 
*/


// curl -X GET \
// -H 'Content-Type: application/json' -H "X-Goog-Api-Key: AIzaSyCc3qVwBWVG5WUPkeLfcIV5NE9DdakgglQ" \
// https://places.googleapis.com/v1/places/ChIJ2fzCmcW7j4AR2JzfXBBoh6E/photos/AUacShh3_Dd8yvV2JZMtNjjbbSbFhSv-0VmUN-uasQ2Oj00XB63irPTks0-A_1rMNfdTunoOVZfVOExRRBNrupUf8TY4Kw5iQNQgf2rwcaM8hXNQg7KDyvMR5B-HzoCE1mwy2ba9yxvmtiJrdV-xBgO8c5iJL65BCd0slyI1/media?maxHeightPx=400&maxWidthPx=400
