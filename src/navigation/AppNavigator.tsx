import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <SearchStack.Screen
        name="SearchHome"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <SearchStack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: 'Results' }}
      />
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
    <SavedStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
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
    <Text
      style={{
        fontSize: 11,
        fontWeight: focused ? '700' : '500',
        color: focused ? colors.primary : colors.textMuted,
      }}
    >
      {label}
    </Text>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: { backgroundColor: colors.surface },
        }}
      >
        <Tab.Screen
          name="SearchTab"
          component={SearchStackNavigator}
          options={{
            title: 'Search',
            tabBarIcon: ({ focused }) => <TabIcon label="Search" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="SavedTab"
          component={SavedStackNavigator}
          options={{
            title: 'Saved',
            tabBarIcon: ({ focused }) => <TabIcon label="Saved" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
