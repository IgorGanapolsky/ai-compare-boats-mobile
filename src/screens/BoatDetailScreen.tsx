import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeProvider';
import { getBoatDetails } from '@boats/api';

type BoatDetailScreenRouteProp = RouteProp<RootStackParamList, 'BoatDetail'>;

interface BoatDetails {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  year: number;
  length: number;
  specifications: {
    [key: string]: string | number;
  };
  features: string[];
}

const BoatDetailScreen: React.FC = () => {
  const route = useRoute<BoatDetailScreenRouteProp>();
  const { theme } = useTheme();
  const { boatId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [boatDetails, setBoatDetails] = useState<BoatDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBoatDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await getBoatDetails(boatId);
        setBoatDetails(details);
      } catch (err) {
        console.error('Error fetching boat details:', err);
        setError('Failed to load boat details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBoatDetails();
  }, [boatId]);
  
  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading boat details...
        </Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      </View>
    );
  }
  
  if (!boatDetails) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          No details found for this boat.
        </Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {boatDetails.name}
        </Text>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            General Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Manufacturer:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {boatDetails.manufacturer}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Type:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {boatDetails.type}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Year:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {boatDetails.year}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Length:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {boatDetails.length} ft
            </Text>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Specifications
          </Text>
          {Object.entries(boatDetails.specifications).map(([key, value]) => (
            <View key={key} style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {value}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Features
          </Text>
          {boatDetails.features.map((feature, index) => (
            <Text 
              key={index} 
              style={[styles.featureText, { color: theme.colors.text }]}
            >
              • {feature}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    width: '40%',
  },
  infoValue: {
    fontSize: 16,
    width: '60%',
  },
  featureText: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BoatDetailScreen;
