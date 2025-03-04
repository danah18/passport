// Imports the Places library
const {PlacesClient} = require('@googlemaps/places').v1;

// Instantiates a client
const placesClient = new PlacesClient();

// place details search
// photo details with place details info

// Example:
// https://places.googleapis.com/v1/places/ChIJj61dQgK6j4AR4GeTYWZsKWw?fields=id,displayName&key=API_KEY

// Is this usage of API key problematic?
export async function fetchData(url: string): Promise<any> {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": "AIzaSyD1tKpJ7F0hfsThsnYtXFwZGB0_jXpbkkY",
                "X-Goog-FieldMask": "places.displayName" 
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}
    