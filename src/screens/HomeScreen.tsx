import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeProvider';

// Debug constants - REMOVE IN PRODUCTION
const DEBUG = true;
const PLATFORM = Platform.OS;

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();
  
  // Log for debugging
  console.log('HomeScreen rendering on platform:', PLATFORM);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {DEBUG && (
            <View style={styles.debugBox}>
              <Text style={styles.debugText}>Debug: Platform - {PLATFORM}</Text>
              <Text style={styles.debugText}>Navigation available: {navigation ? 'Yes' : 'No'}</Text>
            </View>
          )}
          
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome to AI Compare Boats
          </Text>
          
          <Text style={[styles.description, { color: theme.colors.text }]}>
            Compare boats using our AI-powered image recognition technology
          </Text>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              console.log('Navigate to CompareBoats');
              navigation.navigate('CompareBoats');
            }}
          >
            <Text style={[styles.buttonText, { color: theme.colors.background }]}>
              Compare Boats
            </Text>
          </TouchableOpacity>
          
          {/* Emergency navigation buttons for testing */}
          {DEBUG && (
            <View style={styles.debugActions}>
              <TouchableOpacity 
                style={styles.debugButton}
                onPress={() => navigation.navigate('CompareBoats')}
              >
                <Text style={styles.debugButtonText}>Debug: Go to Compare</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.debugButton}
                onPress={() => navigation.navigate('BoatDetail', { boatId: '1' })}
              >
                <Text style={styles.debugButtonText}>Debug: Go to Detail</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#0077B6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  debugBox: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  debugText: {
    color: '#b71c1c',
    fontSize: 12,
    marginBottom: 5,
  },
  debugActions: {
    marginTop: 30,
    width: '100%',
  },
  debugButton: {
    backgroundColor: '#eeeeee',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  debugButtonText: {
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  }
});

export default HomeScreen;
