import { getSupabaseClient } from "../utils/supabase.ts";
import { GooglePlaceResponse } from "./pins.tsx";

// Creates or retrieves pin if one already exists for the google place ID in the DB
const createOrFetchPin = async (textQuery: string): Promise<string> => {
    try {
        const supabase = getSupabaseClient(); // Figure out how to not do this on every call to this method     

        // Search for existing pin by name
        const pinNameSearch = await supabase
            .from("pins") 
            .select('*')
            .ilike('pin_name', textQuery); // Case-insensitive search

        if (pinNameSearch?.data && pinNameSearch?.data.length > 0)
        {
            const pinId = pinNameSearch.data[0].id;
            return pinId;
        }

        // TODO - add error handling

        const response = await supabase.functions.invoke('google-place-text-query', {
            body: { textQuery: textQuery },
        });

        if (response?.error) 
        {
            throw response?.error;
        } 

        const googlePlaceResponse = response?.data as GooglePlaceResponse;
        
        // Need to account for multiple responses returned, for now we just assume first element is the result
        if (googlePlaceResponse.places == null || googlePlaceResponse.places.length == 0)
        {
            console.log(Error(`No results returned for textQuery: ${textQuery}`));
            return "";
        }

        const googlePlace = googlePlaceResponse.places[0];
        const google_place_id = googlePlace.id;
    
        // Search for existing pin by Google Place ID
        const placeIdSearch = await supabase
            .from("pins") 
            .select('*')
            .like('google_place_id', google_place_id);

        if (placeIdSearch?.data && placeIdSearch?.data.length > 0)
        {
            const pinId = placeIdSearch.data[0].id;
            return pinId;
        }

        const location = `SRID=4326;POINT(${googlePlace.location.longitude} ${googlePlace.location.latitude})`;
        const pin_name = googlePlace.displayName.text;
        const metadata = {
            formattedAddress: googlePlace.formattedAddress,
            rating: googlePlace.rating,
            userRatingCount: googlePlace.userRatingCount,
            googleMapsUri: googlePlace.googleMapsUri,
            displayName: googlePlace.displayName.text,
            photos: googlePlace.photos,
        };

        const { data, error } = await supabase.rpc('add_pin', {
            google_place_id: google_place_id,
            location: location,
            pin_name: pin_name,
            category: '' ,
            metadata: metadata
        });

        return data;
    } catch (error: any) {
        console.log('Error', error.message);
        return '';
    }
} 

export { createOrFetchPin }