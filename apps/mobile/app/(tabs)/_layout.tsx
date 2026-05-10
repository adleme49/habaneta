import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="hunt"
        options={{
          title: 'Hunt',
          tabBarLabel: 'Hunt',
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarLabel: 'Collection',
        }}
      />
    </Tabs>
  );
}
