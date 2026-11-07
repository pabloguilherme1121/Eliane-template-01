import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/tokens";
import { useStore } from "@/lib/store";

export function NoticeBanner() {
  const { notice, dismissNotice, storageWarning, dismissStorageWarning } = useStore();
  const message = storageWarning ?? notice;
  if (!message) return null;
  const isWarning = Boolean(storageWarning);
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable onPress={isWarning ? dismissStorageWarning : dismissNotice} style={[styles.banner, isWarning && styles.warningBanner]} accessibilityRole="button" accessibilityLabel={isWarning ? "Dispensar aviso de armazenamento" : "Dispensar aviso"}>
        <View style={styles.check}><Ionicons name={isWarning ? "alert-outline" : "information-outline"} size={16} color={colors.white} /></View>
        <Text style={styles.text} accessibilityLiveRegion="polite">{message}</Text>
        <Ionicons name="close" size={16} color={colors.paper} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 54, left: 16, right: 16, zIndex: 10, alignItems: "center" },
  warningBanner: { backgroundColor: colors.wine },
  banner: { flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: colors.ink, borderRadius: 8, paddingHorizontal: 13, paddingVertical: 11, shadowColor: "#000", shadowOpacity: 0.16, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  check: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center" },
  text: { color: colors.paper, fontSize: 12, fontWeight: "700", flexShrink: 1 },
});
