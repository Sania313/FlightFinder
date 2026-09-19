import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SavedStackParamList } from '../navigation/types';
import { useSavedFlightsContext } from '../context/SavedFlightsContext';
import FlightList from '../components/FlightList';
import LoadingState from '../components/LoadingState';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<SavedStackParamList, 'SavedHome'>;

export default function SavedFlightsScreen({ navigation }: Props) {
  const { saved, ready, refresh } = useSavedFlightsContext();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  if (!ready) {
    return <LoadingState message="Loading saved flights…" />;
  }

  return (
    <View style={styles.container}>
      <FlightList
        flights={saved}
        onSelect={(flight) => navigation.navigate('SavedDetails', { flight })}
        emptyTitle="No saved flights yet"
        emptyMessage="Open a search result and tap Save flight to keep it on this device."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
