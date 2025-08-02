import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GasSaver</Text>
      <Button
        title="Add New Trip"
        onPress={() => navigation.navigate('AddTrip')}
      />
      <Button title="View Trip History" onPress={() => navigation.navigate('History')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  title: {
    fontSize: 28, marginBottom: 20
  }
});
