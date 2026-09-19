import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SortOption } from '../utils/sortFilter';
import { colors } from '../theme/colors';

interface Props {
  sortBy: SortOption;
  nonStopOnly: boolean;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (nonStopOnly: boolean) => void;
}

export default function SortFilterBar({
  sortBy,
  nonStopOnly,
  onSortChange,
  onFilterChange,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sort</Text>
      <View style={styles.row}>
        <Chip
          label="Lowest price"
          active={sortBy === 'price_asc'}
          onPress={() => onSortChange('price_asc')}
        />
        <Chip
          label="Shortest"
          active={sortBy === 'duration_asc'}
          onPress={() => onSortChange('duration_asc')}
        />
      </View>

      <Text style={[styles.label, styles.filterLabel]}>Filter</Text>
      <View style={styles.row}>
        <Chip
          label="Non-stop only"
          active={nonStopOnly}
          onPress={() => onFilterChange(!nonStopOnly)}
        />
      </View>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  filterLabel: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
});
