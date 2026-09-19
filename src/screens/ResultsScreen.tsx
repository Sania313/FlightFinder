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
import ScreenBackground from '../components/ScreenBackground';
import FadeInView from '../components/FadeInView';
import PressableScale from '../components/PressableScale';
import { colors, radii } from '../theme/colors';

type Props = NativeStackScreenProps<SearchStackParamList, 'Results'>;

export default function ResultsScreen({ navigation, route }: Props) {
  const { params, useSampleData } = route.params;
  const { flights, loading, error, usedDemo, search } = useFlightSearch();
  const [sortBy, setSortBy] = useState<SortOption>('price_asc');
  const [nonStopOnly, setNonStopOnly] = useState(false);
  const showingSample = usedDemo || useSampleData;

  useEffect(() => {
    void search(params, useSampleData);
  }, [params, useSampleData, search]);

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
        onUseSample={() => search(params, true)}
      />
    );
  }

  return (
    <ScreenBackground>
      {showingSample ? (
        <FadeInView>
          <View style={styles.sampleBar}>
            <View style={styles.sampleDot} />
            <Text style={styles.sampleText}>Sample data · not live prices</Text>
            <PressableScale
              onPress={() => search(params, false)}
              accessibilityRole="button"
              accessibilityLabel="Search live flights instead"
            >
              <Text style={styles.sampleAction}>Try live</Text>
            </PressableScale>
          </View>
        </FadeInView>
      ) : null}

      <FlightList
        flights={visibleFlights}
        onSelect={(flight) => navigation.navigate('Details', { flight })}
        emptyTitle={flights.length === 0 ? 'No flights found' : 'No matching flights'}
        emptyMessage={
          flights.length === 0
            ? 'Try different search criteria, or use sample data from the search screen.'
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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  sampleBar: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sampleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  sampleText: {
    flex: 1,
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 13,
  },
  sampleAction: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
});
