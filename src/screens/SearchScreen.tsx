import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SearchForm from '../components/SearchForm';
import { SearchStackParamList } from '../navigation/types';
import { SearchParams } from '../models/flight';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchHome'>;

export default function SearchScreen({ navigation }: Props) {
  const handleSearch = (params: SearchParams, demoMode: boolean) => {
    navigation.navigate('Results', { params, demoMode });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <SearchForm onSearch={handleSearch} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
});
