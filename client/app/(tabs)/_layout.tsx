import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import TestScreen from '../../components/TestScreen.tsx';
import { Button } from 'react-native';
import { getSupabaseClient } from '../../utils/supabase.ts';
import { router } from 'expo-router';
import { User } from '@supabase/supabase-js';

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
        console.log('Error fetching user:', error);
        return;
      }
      setUser(data?.user || null);
    };

    fetchUser();

    // Subscribe to auth state changes.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Sign out the user.
  const signOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    router.back();
  };
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{
          headerRight: () => (user &&
            <Button title="Log Out" onPress={signOut} color="#68bef7" />
          ),
        }}>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Account',
            title: ''
          }}
        />
        <Drawer.Screen
          name="capsules" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Capsules',
            title: '',
          }}
        />
        <Drawer.Screen
          name="portal" 
          options={{
            drawerLabel: 'Portal',
            title: '',
          }}
        />      
        <Drawer.Screen
          name="map" 
          options={{
            drawerLabel: 'Map',
            title: '',
            // Temp workaround - it is still clickable but somewhat hidden
            // https://react-navigation.canny.io/feature-requests/p/add-option-to-hide-item-from-a-drawer
            drawerLabelStyle:  { display: 'none' }
          }}
        /> 
        <Drawer.Screen
          name="tripCapsule" 
          options={{
            drawerLabel: 'Trip Capsule',
            title: '',
            drawerLabelStyle:  { display: 'none' }
          }}
        />  
      </Drawer>
    </GestureHandlerRootView>
  );
}
