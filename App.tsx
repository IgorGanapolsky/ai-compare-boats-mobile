import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, LogBox, ActivityIndicator, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Suppress known warnings
LogBox.ignoreLogs([
  'Unsupported top level event type "topInsetsChange" dispatched',
  'Require cycle:',
  'ViewPropTypes will be removed',
  'Could not find MIME for Buffer'
]);

// Debug logging for Android white screen issue
console.log('[APP] Starting app on platform:', Platform.OS);

// Error boundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{this.state.error?.toString()}</Text>
          <Button 
            title="Try Again" 
            onPress={() => this.setState({ hasError: false })} 
          />
        </View>
      );
    }
    
    return this.props.children;
  }
}

// Main app wrapped with error boundary
export default function App() {
  const [loading, setLoading] = useState(true);
  
  // Simulate initialization to allow time for components to load
  useEffect(() => {
    console.log('[APP] App mounted');
    
    const timer = setTimeout(() => {
      console.log('[APP] Setting loading to false');
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }
  
  // Main app
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.text}>HELLO FROM {Platform.OS.toUpperCase()}</Text>
        <Text style={styles.subtitle}>
          This is a minimal test app to debug Android white screen
        </Text>
        <Text style={styles.details}>
          If you can see this, basic rendering is working!
        </Text>
        <StatusBar style="auto" />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
    marginTop: 20,
    marginBottom: 20
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center'
  },
  details: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff1f0',
    padding: 20
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 20
  },
  errorMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center'
  }
});
