import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/constants/tokens";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.wine,
      tabBarInactiveTintColor: colors.muted,
      tabBarLabelStyle: styles.label,
      tabBarStyle: [styles.bar, { height: 62 + bottomPadding, paddingBottom: bottomPadding }],
      tabBarItemStyle: styles.item,
    }}>
      <Tabs.Screen name="index" options={{ title: "Início", tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="catalog" options={{ title: "Catálogo", tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="favorites" options={{ title: "Favoritos", tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="bag" options={{ title: "Sacola", tabBarIcon: ({ color, size }) => <Ionicons name="bag-handle-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil", tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.paper, borderTopColor: colors.line, borderTopWidth: 1, paddingTop: 7 },
  item: { minHeight: 48 },
  label: { fontSize: 10, fontWeight: "700", marginTop: 1 },
});
