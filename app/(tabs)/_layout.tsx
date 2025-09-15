import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
<Tabs
  screenOptions={{
    tabBarActiveTintColor: "#fff",
    tabBarInactiveTintColor: "#ddd",
    tabBarStyle: {
      backgroundColor: "#9c27b0",
      borderTopWidth: 0,
      height: 60, // smaller so it fits
      paddingBottom: 5, // keeps labels inside
      paddingTop: 5,
    },
    tabBarIconStyle: {
      margin: 0, // reset margins
    },
    tabBarLabelStyle: {
      fontSize: 11,
      marginBottom: 2, // small space below text
    },
    headerShown: useClientOnlyValue(false, true),
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      title: "Feed",
      tabBarIcon: ({ color }) => <TabBarIcon name="rss" color={color} />,
    }}
  />
  <Tabs.Screen
    name="matches"
    options={{
      title: "Matches",
      tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
    }}
  />
  <Tabs.Screen
    name="chats"
    options={{
      title: "Chats",
      tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
    }}
  />
  <Tabs.Screen
    name="profile"
    options={{
      title: "Profile",
      tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
    }}
  />
</Tabs>
</SafeAreaView>

  );
}
