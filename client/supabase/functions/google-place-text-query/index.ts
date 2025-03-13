import "jsr:@supabase/functions-js/edge-runtime.d.ts"

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

    const url = `https://places.googleapis.com/v1/places:searchText`;
    let requestData;
    try {
      requestData = await req.json();
      console.log(requestData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return new Response("Invalid JSON",
        { status: 400, headers: { ...corsHeaders } }
      );
    }

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": `${Deno.env.get('GOOGLE_MAPS_KEY')}`,
        "X-Goog-FieldMask": "places.displayName,places.location,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.photos"//,places.reviews" 
        // "*" to return all fields
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