import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AudioPlayerProvider } from './src/contexts/AudioPlayerContext';
import { AuthProvider } from './src/contexts/AuthContext';
import type { MainTabParamList, RootStackParamList } from './src/navigation/types';
import { DrillsScreen } from './src/screens/DrillsScreen';
import { EpisodeDetailScreen } from './src/screens/EpisodeDetailScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { VaultScreen } from './src/screens/VaultScreen';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Library: 'library',
  Drills: 'flash',
  Vault: 'lock-closed',
  Profile: 'person'
};

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.cream,
    card: colors.white,
    primary: colors.blue,
    text: colors.navy,
    border: colors.navy
  }
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.purple,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderColor: colors.navy,
          borderRadius: 999,
          borderTopColor: colors.navy,
          borderWidth: 2,
          bottom: 12,
          height: 66,
          left: 16,
          minHeight: 68,
          paddingBottom: 10,
          paddingTop: 8,
          position: 'absolute',
          right: 16
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '900',
          textTransform: 'uppercase'
        },
        tabBarItemStyle: {
          borderRadius: 999,
          marginHorizontal: 2
        },
        tabBarActiveBackgroundColor: route.name === 'Vault' ? colors.purple : colors.blue,
        sceneStyle: {
          backgroundColor: colors.cream
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tabIcons[route.name]} size={size} color={color} />
        )
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Drills" component={DrillsScreen} />
      <Tab.Screen name="Vault" component={VaultScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <AudioPlayerProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="EpisodeDetail" component={EpisodeDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioPlayerProvider>
  );
}
