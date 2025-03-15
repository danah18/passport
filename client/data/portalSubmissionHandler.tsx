import { SupabaseClient, User } from "@supabase/supabase-js";
import { TextBlock } from "../components/TextBlockList.tsx";
import { getSupabaseClient } from "../utils/supabase.ts";
import { Pin } from "../app/(tabs)/map.tsx";
import { createOrFetchPin } from "./pinManager.tsx";


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

 // Creates capsule on behalf of ephemeral user using place name
const createCapsule = async (supabase: SupabaseClient, user: User, placeName: string, recs: string) => {
    const { data, error } = await supabase.rpc('insert_capsule', {
        user_id: user.id,
        name: placeName,
        description: ''
    });

    const capsuleId = data;

    // Split recs by comma or new line
    const recList: string[] = recs.split(/[\n,]+/);

    recList.forEach(async (rec) => {
        const pinId = await createOrFetchPin(rec);
        
        await createCapsulePin(supabase, user, capsuleId, pinId);
        await createUserPin(supabase, user, pinId, rec);
    });

    return capsuleId;    
}

const createCapsulePin = async (supabase: SupabaseClient, user: User, capsuleId: string, pinId: string) => {
    await supabase.from('capsule_pins').insert([{ 
        capsule_id: capsuleId,
        pin_id: pinId,
        position: 0, // I think this should be removed unless there's a reason we need it or we need a management system for getting list count
    }]);
}

const createUserPin = async (supabase: SupabaseClient, user: User, pinId: string, rec: string) => {
    await supabase.from('user_pins').insert([{ 
        user_id: user.id,
        pin_id: pinId,
        note: '', // TODO: extract any provided notes from rec and add to user pin
    }]);
}

export async function handlePortalSubmission(props: PortalSubmissionHandlerProps) {
    // We need to make a global retrieval fxn instead of getting it each time
    const supabase = getSupabaseClient();

    props.textBlockList.forEach(async (item) => {
        const ephemeralUser = await addNewEphemeralUser(supabase, item.friendName);

        if (ephemeralUser)
        {
            // TODO: Adding custom columns to profiles table for ephemeral user once Kit’s changes are in (displayName, isEphemeralUser, linkedPhoneNumber)
            
            const capsuleId = await createCapsule(supabase, ephemeralUser, props.placeName, item.recs);

            // TODO: add capsule id to capsule_shares table for original user
        }
    })
}
