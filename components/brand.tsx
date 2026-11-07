import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View, type PressableProps } from "react-native";

import { colors } from "@/constants/tokens";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.brandRow} accessibilityLabel="Eliane Fashion">
      <View style={[styles.mark, compact && styles.markCompact]}>
        <Text style={[styles.markText, compact && styles.markTextCompact]}>EF</Text>
      </View>
      {!compact && <Text style={styles.wordmark}>ELIANE FASHION</Text>}
    </View>
  );
}

export function IconButton({ icon, label, onPress, badge, ...props }: PressableProps & { icon: keyof typeof Ionicons.glyphMap; label: string; badge?: number }) {
  return (
    <Pressable {...props} onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
      <Ionicons name={icon} size={21} color={colors.ink} />
      {!!badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
    </Pressable>
  );
}

export function SectionTitle({ eyebrow, title, action, onAction }: { eyebrow?: string; title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {!!action && <Pressable onPress={onAction} accessibilityRole="button" accessibilityLabel={action}><Text style={styles.sectionAction}>{action}</Text></Pressable>}
    </View>
  );
}

export function PillButton({ children, active = false, onPress }: { children: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pill, active && styles.pillActive, pressed && styles.pressed]} accessibilityRole="button" accessibilityState={{ selected: active }}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  mark: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center" },
  markCompact: { width: 32, height: 32, borderRadius: 16 },
  markText: { color: colors.paper, fontFamily: "Georgia", fontSize: 13, letterSpacing: -1 },
  markTextCompact: { fontSize: 11 },
  wordmark: { color: colors.ink, fontSize: 12, fontWeight: "700", letterSpacing: 2.1 },
  iconButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", position: "relative" },
  badge: { position: "absolute", top: -2, right: -2, minWidth: 17, height: 17, paddingHorizontal: 4, borderRadius: 9, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center" },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: "800" },
  sectionHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 },
  eyebrow: { color: colors.wine, fontSize: 10, fontWeight: "800", letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 5 },
  sectionTitle: { color: colors.ink, fontFamily: "Georgia", fontSize: 29, lineHeight: 31 },
  sectionAction: { color: colors.wine, fontSize: 12, fontWeight: "700", marginBottom: 3 },
  pill: { borderWidth: 1, borderColor: colors.line, borderRadius: 24, paddingHorizontal: 15, minHeight: 44, justifyContent: "center", paddingVertical: 9, backgroundColor: colors.paper },
  pillActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  pillText: { color: colors.muted, fontSize: 13, fontWeight: "700" },
  pillTextActive: { color: colors.paper },
  pressed: { opacity: 0.72 },
});
