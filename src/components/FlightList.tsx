import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Flight } from '../models/flight';
import FlightCard from './FlightCard';
import EmptyState from './EmptyState';

interface Props {
  flights: Flight[];
  onSelect: (flight: Flight) => void;
  emptyTitle?: string;
  emptyMessage?: string;
  ListHeaderComponent?: React.ReactElement | null;
}

export default function FlightList({
  flights,
  onSelect,
  emptyTitle = 'No flights found',
  emptyMessage = 'Try different dates, remove filters, or run another search.',
  ListHeaderComponent,
}: Props) {
  if (flights.length === 0) {
    return (
      <View style={styles.empty}>
        {ListHeaderComponent ? <View style={styles.headerPad}>{ListHeaderComponent}</View> : null}
        <EmptyState title={emptyTitle} message={emptyMessage} />
      </View>
    );
  }

  return (
    <FlatList
      data={flights}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FlightCard flight={item} onPress={() => onSelect(item)} />}
      contentContainerStyle={styles.list}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  empty: {
    flex: 1,
  },
  headerPad: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
