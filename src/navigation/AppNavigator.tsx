import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from '../screens/SearchScreen';
import ResultsScreen from '../screens/ResultsScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SavedFlightsScreen from '../screens/SavedFlightsScreen';
import { RootTabParamList, SavedStackParamList, SearchStackParamList } from './types';
import { colors } from '../theme/colors';

const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const SavedStack = createNativeStackNavigator<SavedStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.borderSoft,
    primary: colors.primary,
  },
};

const stackScreenOptions = {
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    fontWeight: '700' as const,
    color: colors.text,
  },
  headerShadowVisible: false,
  animation: 'slide_from_right' as const,
  contentStyle: { backgroundColor: colors.background },
};

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={stackScreenOptions}>
      <SearchStack.Screen
        name="SearchHome"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen name="Results" component={ResultsScreen} options={{ title: 'Results' }} />
      <SearchStack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Flight details' }}
      />
    </SearchStack.Navigator>
  );
}

function SavedStackNavigator() {
  return (
    <SavedStack.Navigator screenOptions={stackScreenOptions}>
      <SavedStack.Screen
        name="SavedHome"
        component={SavedFlightsScreen}
        options={{ title: 'Saved flights' }}
      />
      <SavedStack.Screen
        name="SavedDetails"
        component={DetailsScreen}
        options={{ title: 'Flight details' }}
      />
    </SavedStack.Navigator>
  );
}

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>{label}</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="SearchTab"
          component={SearchStackNavigator}
          options={{
            title: 'Search',
            tabBarIcon: ({ focused }) => <TabIcon label="Go" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="SavedTab"
          component={SavedStackNavigator}
          options={{
            title: 'Saved',
            tabBarIcon: ({ focused }) => <TabIcon label="Pin" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.borderSoft,
    borderTopWidth: 1,
    height: 64,
    paddingTop: 8,
    paddingBottom: 10,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabIcon: {
    minWidth: 42,
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabIconActive: {
    backgroundColor: colors.primaryMuted,
  },
  tabIconText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  tabIconTextActive: {
    color: colors.primaryDark,
  },
});
