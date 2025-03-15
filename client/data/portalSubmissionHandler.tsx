import { SupabaseClient, User } from "@supabase/supabase-js";
import { TextBlock } from "../components/TextBlockList.tsx";
import { getSupabaseClient } from "../utils/supabase.ts";


export type PortalSubmissionHandlerProps = {
  textBlockList: TextBlock[],
  placeName: string,
};

const defaultPassword = "5uP@WuJO2$Z3lK";

const generateRandomDigits = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

const generateRandomPhoneNumber = () => {
    const countryCode = '+1';
    const areaCode = generateRandomDigits(3);
    const prefix = generateRandomDigits(3);
    const lineNumber = generateRandomDigits(4);
  
    return `${countryCode}${areaCode}${prefix}${lineNumber}`;
}

const addNewEphemeralUser = async (supabase: SupabaseClient, friendName: string) => {
    try {
        const { data, error } = await supabase.auth.signUp({
          phone: generateRandomPhoneNumber(),
          password: defaultPassword,
          options: {
            data: {
              firstName: friendName,
              lastName: '',
              name: friendName,
            }
          }
        })

        return data.user;
    } catch (error) {
        console.error('Phone Sign-Up Error:', error);
    } 
}

const createCapsule = async (user: User, recs: string) => {
    // Create capsule on behalf of this new user, set name to be the same as what user specified in portal form

    // Split recs by comma or new line

    // Create pin (or retrieve if one already exists for the google place ID in the DB)
    // Create capsule_pin
    // Create user_pin 
    // Add a TODO comment about extracting and adding any additional provided note
}

const createOrFetchPin = async (user: User) => {
    // Create pin (or retrieve if one already exists for the google place ID in the DB)
}

const createCapsulePin = async (user: User) => {
    // Create capsule_pin
}

const createUserPin = async (user: User) => {
    // Create user_pin 
    // Add a TODO comment about extracting and adding any additional provided note
}

export async function handlePortalSubmission(props: PortalSubmissionHandlerProps) {
    // We need to make a global retrieval fxn instead of getting it each time
    const supabase = getSupabaseClient();
    
    console.log(props.placeName);

    props.textBlockList.forEach(async (item) => {
        const user = await addNewEphemeralUser(supabase, item.friendName);

        if (user)
        {
            // TODO: Adding custom columns to profiles table for ephemeral user once Kit’s changes are in (displayName, isEphemeralUser, linkedPhoneNumber)
            
            await createCapsule(user, item.recs);
        }
    })

    // console.log(item.friendName);
    // console.log(item.recs);
}
