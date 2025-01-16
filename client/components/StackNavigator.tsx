import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainGrid from '@/app/(tabs)/mainGrid';
import TripCapsuleScreen from '@/app/(embeddedScreens)/TripCapsuleScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainGrid">
        <Stack.Screen 
          name="MainGrid" 
          component={MainGrid} 
          options={{ title: 'Main Grid' }} 
        />
        <Stack.Screen 
          name="TripCapsuleScreen" 
          component={TripCapsuleScreen} 
          options={{ title: 'Trip Capsule' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}