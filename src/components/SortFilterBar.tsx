import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SortOption } from '../utils/sortFilter';
import { colors, radii, typography } from '../theme/colors';
import PressableScale from './PressableScale';

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
    <PressableScale
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  filterLabel: {
    marginTop: 12,
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
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.white,
  },
});
