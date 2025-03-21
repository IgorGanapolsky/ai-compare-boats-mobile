import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CompareBoatsScreen from '../screens/CompareBoatsScreen';
import BoatDetailScreen from '../screens/BoatDetailScreen';
import { useTheme } from '../theme/ThemeProvider';

export type RootStackParamList = {
  Home: undefined;
  CompareBoats: undefined;
  BoatDetail: { boatId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'AI Compare Boats' }} 
      />
      <Stack.Screen 
        name="CompareBoats" 
        component={CompareBoatsScreen} 
        options={{ title: 'Compare Boats' }} 
      />
      <Stack.Screen 
        name="BoatDetail" 
        component={BoatDetailScreen} 
        options={{ title: 'Boat Details' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
