import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/theme/ThemeProvider';

export default function App() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test imports early to catch any issues
    const testImports = async () => {
      try {
        // Try importing all shared packages
        const coreModule = await import('@boats/core');
        console.log('@boats/core imported successfully', typeof coreModule.analyzeBoatImage);
        
        const apiModule = await import('@boats/api');
        console.log('@boats/api imported successfully', Object.keys(apiModule));
        
        const typesModule = await import('@boats/types');
        console.log('@boats/types imported successfully', Object.keys(typesModule));
        
      } catch (e) {
        console.error('Import error:', e);
        setError(e instanceof Error ? e.message : 'Unknown error loading modules');
      }
    };
    
    testImports();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Error Loading App
        </Text>
        <Text style={{ textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
