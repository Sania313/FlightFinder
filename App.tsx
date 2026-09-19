import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { SavedFlightsProvider } from './src/context/SavedFlightsContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <SavedFlightsProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </SavedFlightsProvider>
    </SafeAreaProvider>
  );
}
