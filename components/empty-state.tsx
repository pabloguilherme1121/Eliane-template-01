import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/tokens";

export function EmptyState({ icon = "sparkles-outline", title, body, action, onAction }: { icon?: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}><Ionicons name={icon} size={25} color={colors.wine} /></View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {!!action && <Pressable onPress={onAction} style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]} accessibilityRole="button"><Text style={styles.actionText}>{action}</Text></Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", paddingHorizontal: 36, paddingVertical: 64 },
  icon: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.wineSoft, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  title: { color: colors.ink, fontFamily: "Georgia", fontSize: 23, textAlign: "center", marginBottom: 8 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: "center" },
  action: { minHeight: 44, minWidth: 120, alignItems: "center", justifyContent: "center", marginTop: 21, borderBottomWidth: 1, borderBottomColor: colors.wine, paddingBottom: 3 },
  actionText: { color: colors.wine, fontSize: 13, fontWeight: "800" },
});
