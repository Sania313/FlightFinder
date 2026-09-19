import { Flight, SearchParams } from '../models/flight';

export type SearchStackParamList = {
  SearchHome: undefined;
  Results: { params: SearchParams; demoMode: boolean };
  Details: { flight: Flight };
};

export type SavedStackParamList = {
  SavedHome: undefined;
  SavedDetails: { flight: Flight };
};

export type RootTabParamList = {
  SearchTab: undefined;
  SavedTab: undefined;
};
