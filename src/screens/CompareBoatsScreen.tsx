import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeBoatImage } from '@boats/core';
import { getBoatDetails } from '@boats/api';
import type { BoatDetails } from '@boats/types';

const CompareBoatsScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [similarBoats, setSimilarBoats] = useState<BoatDetails[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Check for required permissions on mount
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access media library is required!');
      }
    })();
  }, []);

  const pickImage = useCallback(async () => {
    try {
      // Reset states
      setError(null);
      setAnalysisResult(null);
      setSimilarBoats([]);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Process the image
        const selectedImage = result.assets[0];
        
        // Resize image to reduce file size
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          selectedImage.uri,
          [{ resize: { width: 800 } }],
          { format: ImageManipulator.SaveFormat.JPEG, compress: 0.7 }
        );
        
        setImage(manipulatedImage.uri);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Failed to select image. Please try again.');
    }
  }, []);

  const takePicture = useCallback(async () => {
    try {
      // Reset states
      setError(null);
      setAnalysisResult(null);
      setSimilarBoats([]);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setError('Camera permission is required to take pictures');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Process the image
        const selectedImage = result.assets[0];
        
        // Resize image to reduce file size
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          selectedImage.uri,
          [{ resize: { width: 800 } }],
          { format: ImageManipulator.SaveFormat.JPEG, compress: 0.7 }
        );
        
        setImage(manipulatedImage.uri);
      }
    } catch (err) {
      console.error('Error taking picture:', err);
      setError('Failed to take picture. Please try again.');
    }
  }, []);

  const analyzeImage = useCallback(async () => {
    if (!image) return;

    try {
      setIsAnalyzing(true);
      setError(null);

      // Convert image URI to base64 or file object as needed
      const fileInfo = await FileSystem.getInfoAsync(image);
      if (!fileInfo.exists) {
        throw new Error('Image file does not exist');
      }

      // For testing progress updates
      const onProgress = (progress: number) => {
        console.log(`Analysis progress: ${progress * 100}%`);
      };

      try {
        // Call the analyze function from the shared package
        console.log('Calling analyzeBoatImage from @boats/core');
        const result = await analyzeBoatImage(image, onProgress);
        console.log('Analysis result:', result);
        setAnalysisResult(result.description);

        // Get similar boats based on the analysis
        if (result && result.boatType) {
          const boatIds = ['1', '2', '3']; // Mock IDs for demonstration
          const boatsPromises = boatIds.map(id => getBoatDetails(id));
          const boats = await Promise.all(boatsPromises);
          setSimilarBoats(boats);
        }
      } catch (analysisError) {
        console.error('Error during boat analysis:', analysisError);
        // Use a mock analysis for development/testing
        const mockResult = {
          boatType: 'yacht',
          manufacturer: 'Example',
          year: 2023,
          length: 42,
          description: 'This appears to be a luxury yacht with sleek design, approximately 40-45 feet in length.'
        };
        
        setAnalysisResult(mockResult.description);
        Alert.alert('Using Mock Data', 'Real analysis failed, using sample data instead');
        
        // Get mock similar boats
        const boatIds = ['1', '2', '3'];
        const boatsPromises = boatIds.map(id => getBoatDetails(id));
        const boats = await Promise.all(boatsPromises);
        setSimilarBoats(boats);
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze image. Please try again or select a different image.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [image]);

  // Wrapped with a try-catch to prevent crashes
  const renderSafeContent = () => {
    try {
      return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Compare Boats</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.imageContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.boatImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>Select a boat image</Text>
                </View>
              )}
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={pickImage}
                disabled={isAnalyzing}
              >
                <Text style={styles.buttonText}>Select Image</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.button}
                onPress={takePicture}
                disabled={isAnalyzing}
              >
                <Text style={styles.buttonText}>Take Picture</Text>
              </TouchableOpacity>
            </View>
            
            {image && (
              <TouchableOpacity
                style={[styles.analyzeButton, isAnalyzing && styles.disabledButton]}
                onPress={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Analyze Boat</Text>
                )}
              </TouchableOpacity>
            )}
            
            {analysisResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Analysis Result:</Text>
                <Text style={styles.resultText}>{analysisResult}</Text>
              </View>
            )}
            
            {similarBoats.length > 0 && (
              <View style={styles.similarBoatsContainer}>
                <Text style={styles.resultTitle}>Similar Boats:</Text>
                {similarBoats.map((boat, index) => (
                  <TouchableOpacity
                    key={boat.id}
                    style={styles.boatCard}
                    onPress={() => {
                      // @ts-ignore - Navigation typing might not be complete
                      navigation.navigate('BoatDetail', { boat });
                    }}
                  >
                    <Text style={styles.boatCardTitle}>{boat.name}</Text>
                    <Text>Type: {boat.type}</Text>
                    <Text>Manufacturer: {boat.manufacturer}</Text>
                    <Text>Year: {boat.year}</Text>
                    <Text>Length: {boat.length} ft</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      );
    } catch (renderError) {
      console.error('Render error:', renderError);
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>
            Something went wrong with the display. Please restart the app.
          </Text>
        </View>
      );
    }
  };
  
  return renderSafeContent();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#e9ecef',
  },
  boatImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },
  placeholderText: {
    color: '#6c757d',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  analyzeButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 22,
  },
  similarBoatsContainer: {
    marginBottom: 20,
  },
  boatCard: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  boatCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#f8d7da',
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: '#721c24',
    textAlign: 'center',
  },
});

export default CompareBoatsScreen;
