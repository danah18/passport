import { User } from "@supabase/supabase-js";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "../../components/ui/Button.tsx";
import { getSupabaseClient } from "../../utils/supabase.ts";

// Note from Expo Router Docs: Be careful when using react-native-gesture-handler on the web.
// It can increase the JavaScript bundle size significantly.
// Expo router recommends learning about using platform-specific modules.
export default function Layout() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("Error fetching user:", error);
        return;
      }
      setUser(data?.user || null);
    };

    fetchUser();

    // Subscribe to auth state changes.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Sign out the user.
  const signOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerRight: () =>
            user && (
              <View style={{ marginRight: 10 }}>
                <Button
                  onClick={signOut}
                  className="mr-3 group relative overflow-hidden rounded-full px-6 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100"></span>
                  <span className="relative flex items-center justify-center text-white">Log Out</span>
                </Button>
              </View>
            ),
        }}
      >
        <Drawer.Screen
          name="portal"
          options={{
            drawerLabel: "Portal",
            title: "",
          }}
        />
        <Drawer.Screen
          name="map"
          options={{
            drawerLabel: "Map",
            title: "",
          }}
        />
        <Drawer.Screen
          name="screen"
          options={{
            drawerLabel: "Screen",
            title: "",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
