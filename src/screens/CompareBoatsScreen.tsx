import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { useTheme } from '../theme/ThemeProvider';
import { analyzeBoatImage } from '@boats/core';

interface AnalysisResult {
  boatType: string;
  confidence: number;
  features: string[];
}

const CompareBoatsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    // Test if we can access the shared packages
    const testSharedPackages = async () => {
      try {
        console.log('Testing @boats/core import...');
        console.log('analyzeBoatImage type:', typeof analyzeBoatImage);
        
        // If we get here, the import is working
        setImportError(null);
      } catch (error) {
        console.error('Error testing shared packages:', error);
        setImportError(error instanceof Error ? error.message : 'Unknown error');
      }
    };
    
    testSharedPackages();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      processImage(imageUri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      processImage(imageUri);
    }
  };

  const processImage = async (uri: string) => {
    try {
      setLoading(true);
      setImage(uri);
      setResult(null);
      
      // Resize the image to reduce processing time
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('About to call analyzeBoatImage...');
      
      try {
        // Use shared package to analyze the image
        const analysisResult = await analyzeBoatImage(base64);
        console.log('Analysis result:', analysisResult);
        
        setResult({
          boatType: analysisResult.boatType,
          confidence: analysisResult.confidence,
          features: analysisResult.features,
        });
      } catch (analyzeError) {
        console.error('Error in analyzeBoatImage:', analyzeError);
        alert(`Analysis error: ${analyzeError instanceof Error ? analyzeError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Compare Boats</Text>
        
        {importError && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            Error testing shared packages: {importError}
          </Text>
        )}
        
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: theme.colors.card }]}>
              <Text style={{ color: theme.colors.text }}>No image selected</Text>
            </View>
          )}
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={pickImage}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: theme.colors.background }]}>
              Pick from Gallery
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={takePhoto}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: theme.colors.background }]}>
              Take Photo
            </Text>
          </TouchableOpacity>
        </View>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Analyzing image...
            </Text>
          </View>
        )}
        
        {result && (
          <View style={[styles.resultContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.resultTitle, { color: theme.colors.text }]}>
              Analysis Result:
            </Text>
            <Text style={[styles.resultText, { color: theme.colors.text }]}>
              Boat Type: {result.boatType}
            </Text>
            <Text style={[styles.resultText, { color: theme.colors.text }]}>
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </Text>
            <Text style={[styles.resultTitle, { color: theme.colors.text, marginTop: 10 }]}>
              Features:
            </Text>
            {result.features.map((feature, index) => (
              <Text 
                key={index} 
                style={[styles.featureText, { color: theme.colors.text }]}
              >
                • {feature}
              </Text>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  placeholder: {
    width: 300,
    height: 300,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  resultContainer: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 3,
  },
});

export default CompareBoatsScreen;
