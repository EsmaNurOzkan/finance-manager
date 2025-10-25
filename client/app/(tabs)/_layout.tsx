import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons'; 

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />, 
        }}
      />
      <Tabs.Screen
        name="new-expense"
        options={{
          title: 'New Expense',
          tabBarIcon: ({ color }) => <Ionicons name="card" size={28} color={color} />, 
        }}
      />
      <Tabs.Screen
        name="overview"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={28} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="financial-notes"
        options={{
          title: 'Financial Notes',
          tabBarIcon: ({ color }) => <MaterialIcons name="note" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forex-market"
        options={{
          title: 'Forex Market',
          tabBarIcon: ({ color }) => <FontAwesome name="line-chart" size={28} color={color} />,
        }}
      />
      
      
      <Tabs.Screen
      name="reminders"
      options={{
        title: 'Reminder',
        tabBarIcon: ({ color }) => <Ionicons name="alarm-outline" size={28} color={color} />,
      }}
    />
    </Tabs>
  );
}
