import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import TestScreen from '../../components/TestScreen.tsx';

// Note from Expo Router Docs: Be careful when using react-native-gesture-handler on the web. 
// It can increase the JavaScript bundle size significantly. 
// Expo router recommends learning about using platform-specific modules.
export default function Layout() {
  const [role, setRole] = useState("regular");
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Account',
            title: ''
          }}
        />
        <Drawer.Screen
          name="map" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Map',
            title: '',
          }}
        />
        <Drawer.Screen
          name="portal" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Portal',
            title: '',
          }}
        />
        <Drawer.Screen
          name="capsules" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Capsules',
            title: '',
          }}
        />        
      </Drawer>
    </GestureHandlerRootView>
  );
}
