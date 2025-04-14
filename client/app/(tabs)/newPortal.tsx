import { SupabaseClient } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Chat from "../../components/chat/Chat.tsx";
import { Capsule } from "../../data/portalSubmissionHandler";
import { useThemeColor } from "../../hooks/useThemeColor.ts";
import { getSupabaseClient } from "../../utils/supabase.ts";

// Create a context to store the capsule data
const CapsuleContext = createContext(null);

export const useCapsule = () => useContext(CapsuleContext);

export default function DuplicatePortal() {
    const [supabase, setSupabase] = useState<SupabaseClient>();
    const backgroundColor = useThemeColor({}, "background");
    const [splitScreen, setSplitScreen] = useState(false);
    const [capsule, setCapsule] = useState<Capsule>(null);
    const [refreshKey, setRefreshKey] = useState(0); // Add a state variable to track changes

    useEffect(() => {
        // TODO: add error handling for if supabase is null as code throughout this
        // file assumes non-null
        setSupabase(getSupabaseClient());
        fetchCapsule();
    }, []);

    // Fetch existing capsule data
    const fetchCapsule = async () => {
        const supabase = getSupabaseClient();
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
            console.log("Error fetching user:", userError);
            return;
        }
        const profileId = userData?.user?.user_metadata?.profile_id;

        const { data, error } = await supabase.from("capsules").select("*").eq("profile_id", profileId);

        if (error) {
            console.log("Error fetching capsule:", error.message);
            return;
        }

        if (data.length > 0) {
            console.log(data[0]);
            setCapsule(data[0]);
            setSplitScreen(true);
        }
    };

    console.log("in duplicate portal, refresh key is: ", refreshKey);

    return (
        <CapsuleContext.Provider value={capsule}>
            <ScrollView style={{ flex: 1, backgroundColor: backgroundColor }}>

                <ScrollView>
                    <Chat
                        setSplitState={setSplitScreen}
                        onCapsuleAdded={() => fetchCapsule()}
                        onCapsuleUpdated={() => setRefreshKey((prevKey) => prevKey + 1)} />
                </ScrollView>
            </ScrollView>
        </CapsuleContext.Provider>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        gap: 8,
    },
    container: {
        gap: 30,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        color: "white",
    },
});
