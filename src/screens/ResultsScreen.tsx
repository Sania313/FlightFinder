import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../navigation/types';
import { useFlightSearch } from '../hooks/useFlightSearch';
import { applySortAndFilter, SortOption } from '../utils/sortFilter';
import SortFilterBar from '../components/SortFilterBar';
import FlightList from '../components/FlightList';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<SearchStackParamList, 'Results'>;

export default function ResultsScreen({ navigation, route }: Props) {
  const { params, demoMode } = route.params;
  const { flights, loading, error, usedDemo, search } = useFlightSearch();
  const [sortBy, setSortBy] = useState<SortOption>('price_asc');
  const [nonStopOnly, setNonStopOnly] = useState(false);

  useEffect(() => {
    void search(params, demoMode);
  }, [params, demoMode, search]);

  const visibleFlights = useMemo(
    () => applySortAndFilter(flights, sortBy, nonStopOnly),
    [flights, sortBy, nonStopOnly],
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => search(params, false)}
        onUseDemo={() => search(params, true)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {(usedDemo || demoMode) && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Showing sample Demo Mode data — not live flight prices.
          </Text>
        </View>
      )}

      <FlightList
        flights={visibleFlights}
        onSelect={(flight) => navigation.navigate('Details', { flight })}
        emptyTitle={flights.length === 0 ? 'No flights found' : 'No matching flights'}
        emptyMessage={
          flights.length === 0
            ? 'Try different search criteria or switch to Demo Mode.'
            : 'Clear the non-stop filter or change the sort to see more options.'
        }
        ListHeaderComponent={
          <SortFilterBar
            sortBy={sortBy}
            nonStopOnly={nonStopOnly}
            onSortChange={setSortBy}
            onFilterChange={setNonStopOnly}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  banner: {
    backgroundColor: colors.demoBg,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bannerText: {
    color: colors.demo,
    fontWeight: '600',
    fontSize: 13,
  },
});
