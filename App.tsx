import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { CameraScreen } from './src/screens/CameraScreen';
import { CardDetailScreen } from './src/screens/CardDetailScreen';
import { GalleryScreen } from './src/screens/GalleryScreen';
import { RemixScreen } from './src/screens/RemixScreen';
import { ARScreen } from './src/screens/ARScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CameraStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0a0a0a' },
      }}
    >
      <Stack.Screen name="CameraMain" component={CameraScreen} />
      <Stack.Screen
        name="CardDetail"
        component={CardDetailScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: '卡牌详情',
        }}
      />
    </Stack.Navigator>
  );
};

const GalleryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0a0a0a' },
      }}
    >
      <Stack.Screen name="GalleryMain" component={GalleryScreen} />
      <Stack.Screen
        name="CardDetail"
        component={CardDetailScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: '卡牌详情',
        }}
      />
    </Stack.Navigator>
  );
};

const RemixStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0a0a0a' },
      }}
    >
      <Stack.Screen name="RemixMain" component={RemixScreen} />
      <Stack.Screen
        name="CardDetail"
        component={CardDetailScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: '卡牌详情',
        }}
      />
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: '选择卡牌',
        }}
      />
    </Stack.Navigator>
  );
};

const ARStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0a0a0a' },
      }}
    >
      <Stack.Screen name="ARMain" component={ARScreen} />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Remix') {
            iconName = focused ? 'shuffle' : 'shuffle-outline';
          } else if (route.name === 'AR') {
            iconName = focused ? 'glasses' : 'glasses-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Camera"
        component={CameraStack}
        options={{
          title: '拍照',
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryStack}
        options={{
          title: '卡牌库',
        }}
      />
      <Tab.Screen
        name="Remix"
        component={RemixStack}
        options={{
          title: 'Remix',
        }}
      />
      <Tab.Screen
        name="AR"
        component={ARStack}
        options={{
          title: '平行实境',
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
