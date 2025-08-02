import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as FileSystem from 'expo-file-system'; // Use Expo's FileSystem for file operations

export default function AddTripScreen() {
  const [startOdo, setStartOdo] = useState('');
  const [endOdo, setEndOdo] = useState('');
  const [fuelUsed, setFuelUsed] = useState('');

  const handleCalculate = async () => {
    const miles = parseFloat(endOdo) - parseFloat(startOdo);
    const mpg = miles / parseFloat(fuelUsed);
    const dataToSave = {
        startOdo,
        endOdo,
        fuelUsed,
        mpg: mpg.toFixed(2)
    };

    const fileUri = FileSystem.documentDirectory + 'tripData.json';

    try {
        // Read existing trips
        let existingData = [];
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
            const fileContents = await FileSystem.readAsStringAsync(fileUri);
            existingData = JSON.parse(fileContents);
            if (!Array.isArray(existingData)) existingData = [existingData];
        }

        // Add new trip
        existingData.push(dataToSave);
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(existingData, null, 2));
        Alert.alert('Success', `MPG: ${mpg.toFixed(2)}\nTrip saved!`);
    }catch (error) {
        console.error('Error saving file:', error);
        Alert.alert('Error', 'Could not save trip data.');
    }  
  };

  return (
  <KeyboardAvoidingView 
    style={{ flex: 1 }} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.label}>Start Odometer:</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={startOdo} onChangeText={setStartOdo} />

        <Text style={styles.label}>End Odometer:</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={endOdo} onChangeText={setEndOdo} />

        <Text style={styles.label}>Fuel Used (gallons):</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={fuelUsed} onChangeText={setFuelUsed} />

        <Button title="Calculate MPG & Save Trip" onPress={handleCalculate} />
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, justifyContent: 'center'
  },
  label: {
    marginBottom: 5
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5
  }
});
