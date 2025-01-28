import { createClient, SupabaseClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Check if running in a web browser (for correct storage handling)
const isWeb = typeof window !== "undefined";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

let supabase: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
    if (!supabase) {
        supabase = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                storage: isWeb ? window.localStorage : AsyncStorage,
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: isWeb, // Prevents window-related errors on native
            },
        });
    }
    return supabase;
};
