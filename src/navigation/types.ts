import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  EpisodeDetail: {
    episodeId: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Episodes: undefined;
  Subscribe: undefined;
  About: undefined;
};
