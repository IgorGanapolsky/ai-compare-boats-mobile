import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, Platform, LogBox, YellowBox } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/theme/ThemeProvider';

// Ignore specific warnings that are causing issues
// This is a temporary solution until the underlying libraries are updated
LogBox.ignoreLogs([
  'Unsupported top level event type "topInsetsChange" dispatched',
  'Require cycle:', // Ignore any require cycles
  'ViewPropTypes will be removed from React Native', // Ignore legacy prop types warnings
  'The new architecture is enabled in the development build',
  'Non-serializable values were found in the navigation state'
]);

// Monkey patch the error handler for topInsetsChange
const originalAddListener = global.EventEmitter.prototype.addListener;
if (originalAddListener) {
  global.EventEmitter.prototype.addListener = function(eventType, listener, context) {
    if (eventType === 'topInsetsChange') {
      // Return a no-op event subscription that can be "removed"
      return {
        remove: () => {}
      };
    }
    return originalAddListener.call(this, eventType, listener, context);
  };
}

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testImports = async () => {
      try {
        // Wait for a brief moment to let the app stabilize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try importing all shared packages
        const coreModule = await import('@boats/core');
        console.log('@boats/core imported successfully', typeof coreModule.analyzeBoatImage);
        
        const apiModule = await import('@boats/api');
        console.log('@boats/api imported successfully', Object.keys(apiModule));
        
        const typesModule = await import('@boats/types');
        console.log('@boats/types imported successfully', Object.keys(typesModule));
        
        setIsLoading(false);
      } catch (e) {
        console.error('Import error:', e);
        setError(e instanceof Error ? e.message : 'Unknown error loading modules');
        setIsLoading(false);
      }
    };
    
    testImports();
  }, []);

  // Error boundary component
  const ErrorFallback = ({ errorMessage }: { errorMessage: string }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Error Loading App
      </Text>
      <Text style={{ textAlign: 'center' }}>{errorMessage}</Text>
      <View style={{ marginTop: 20, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 8, width: '100%' }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Troubleshooting Tips:</Text>
        <Text>• Restart the Expo development server</Text>
        <Text>• Check network connection</Text>
        <Text>• Verify that all modules are installed</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 18 }}>Loading AI Compare Boats...</Text>
      </View>
    );
  }

  if (error) {
    return <ErrorFallback errorMessage={error} />;
  }

  // Wrap the entire app in a try/catch to prevent crashes
  try {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer fallback={<Text>Loading...</Text>}>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
    return <ErrorFallback errorMessage={errorMessage} />;
  }
}
