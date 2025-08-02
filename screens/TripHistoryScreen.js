import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';

const fileUri = FileSystem.documentDirectory + 'tripData.json';

export default function TripHistoryScreen() {
  const [tripData, setTripData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          setTripData([]);
          return;
        }

        const fileContents = await FileSystem.readAsStringAsync(fileUri);
        const parsedData = JSON.parse(fileContents);

        // Ensure it's an array
        const historyArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        setTripData(historyArray);
      } catch (error) {
        console.error('Error reading trip data:', error);
        Alert.alert('Error', 'Could not load trip history.');
      }
    };

    loadData();
  }, []);

  const deleteTrip = async (index) => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedTrips = tripData.filter((_, i) => i !== index);
              setTripData(updatedTrips);
              await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedTrips, null, 2));
            } catch (error) {
              console.error('Error deleting trip:', error);
              Alert.alert('Error', 'Could not delete trip.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip History</Text>
      <FlatList
        data={tripData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <View style={styles.tripDetails}>
              <Text style={styles.tripTitle}>Trip #{index + 1}</Text>
              <Text>Start: {item.startOdo}</Text>
              <Text>End: {item.endOdo}</Text>
              <Text>Fuel Used: {item.fuelUsed} gal</Text>
              <Text>MPG: {item.mpg}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteTrip(index)}>
              <Text style={styles.deleteButton}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 10
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8
  },
  tripDetails: {
    flex: 1
  },
  tripTitle: {
    fontWeight: 'bold'
  },
  deleteButton: {
    fontSize: 18,
    color: 'red',
    marginLeft: 10
  }
});
