import { NavigationContainer, NavigationIndependentTree, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TripCapsuleScreen from '../(embeddedScreens)/TripCapsuleScreen';
import MainGrid from '../(embeddedScreens)/MainGrid';

export default function Home() {
  const Stack = createStackNavigator();

  return (
    <NavigationIndependentTree>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="MainGrid">
            <Stack.Screen 
                name="MainGrid" 
                component={MainGrid} 
                options={{ 
                    title: 'Main Grid',
                    headerShown: false
                }}  
            />
            <Stack.Screen 
                name="TripCapsuleScreen" 
                component={TripCapsuleScreen} 
                options={{ 
                    title: 'Trip Capsule'
                }} 
            />
            </Stack.Navigator>
        </NavigationContainer>
    </NavigationIndependentTree>
  );
}

