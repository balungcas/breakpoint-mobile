import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { MainTabParamList, RootStackParamList } from './src/navigation/types';
import { AboutScreen } from './src/screens/AboutScreen';
import { EpisodeDetailScreen } from './src/screens/EpisodeDetailScreen';
import { EpisodesScreen } from './src/screens/EpisodesScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SubscribeScreen } from './src/screens/SubscribeScreen';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Episodes: 'list',
  Subscribe: 'notifications',
  About: 'information-circle'
};

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.backgroundElevated,
    primary: colors.primary,
    text: colors.text,
    border: colors.border
  }
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.border,
          minHeight: 68,
          paddingBottom: 10,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800'
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tabIcons[route.name]} size={size} color={color} />
        )
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Episodes" component={EpisodesScreen} />
      <Tab.Screen name="Subscribe" component={SubscribeScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="EpisodeDetail" component={EpisodeDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
