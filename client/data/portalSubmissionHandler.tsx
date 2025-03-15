import { SupabaseClient, User } from "@supabase/supabase-js";
import { TextBlock } from "../components/TextBlockList.tsx";
import { getSupabaseClient } from "../utils/supabase.ts";
import { Pin } from "../app/(tabs)/map.tsx";
import { createOrFetchPin } from "./pinManager.tsx";


export type PortalSubmissionHandlerProps = {
  textBlockList: TextBlock[],
  placeName: string,
  isCuratorMode: boolean
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

const parseInput = (input: string): string[] => {
    if (input.includes("\n") && !input.includes(",")) {
        // If only new lines are present
        return input.split(/\r?\n/).map(item => item.trim()).filter(Boolean);
    } else if (input.includes(",") && !input.includes("\n")) {
        // If only commas are present
        return input.split(",").map(item => item.trim()).filter(Boolean);
    } else {
        // If mixed, split by both
        return input.split(/[\n,]+/).map(item => item.trim()).filter(Boolean);
    }
};

 // Creates capsule on behalf of ephemeral user using place name
const createCapsule = async (supabase: SupabaseClient, user: User, placeName: string, recs: string) => {
    const { data, error } = await supabase.rpc('insert_capsule', {
        user_id: user.id,
        name: placeName,
        description: ''
    });

    const capsuleId = data;

    const recList = parseInput(recs);

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

    if (props.isCuratorMode)
    {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.log('Error fetching user:', error);
            return;
        }

        const capsuleId = await createCapsule(supabase, data?.user, props.placeName, props.textBlockList[0].recs);
    }
    else
    {
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
}
