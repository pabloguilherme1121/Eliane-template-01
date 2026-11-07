import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/tokens";
import { useStore } from "@/lib/store";

export function NoticeBanner() {
  const { notice, dismissNotice } = useStore();
  if (!notice) return null;
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable onPress={dismissNotice} style={styles.banner} accessibilityRole="alert">
        <View style={styles.check}><Ionicons name="checkmark" size={13} color={colors.white} /></View>
        <Text style={styles.text}>{notice}</Text>
        <Ionicons name="close" size={16} color={colors.paper} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 54, left: 16, right: 16, zIndex: 10, alignItems: "center" },
  banner: { flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: colors.ink, borderRadius: 8, paddingHorizontal: 13, paddingVertical: 11, shadowColor: "#000", shadowOpacity: 0.16, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  check: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center" },
  text: { color: colors.paper, fontSize: 12, fontWeight: "700", flexShrink: 1 },
});
