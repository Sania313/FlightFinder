import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SearchForm from '../components/SearchForm';
import ScreenBackground from '../components/ScreenBackground';
import { SearchStackParamList } from '../navigation/types';
import { SearchParams } from '../models/flight';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchHome'>;

export default function SearchScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const handleSearch = (params: SearchParams, demoMode: boolean) => {
    navigation.navigate('Results', { params, demoMode });
  };

  return (
    <ScreenBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 12) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SearchForm onSearch={handleSearch} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 48,
  },
});
