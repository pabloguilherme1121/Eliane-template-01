import { Ionicons } from "@expo/vector-icons";
import { CatalogImage } from "@/components/catalog-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatBRL, type Product } from "@/lib/catalog";
import { colors } from "@/constants/tokens";

export function ProductCard({ product, favorite, onToggleFavorite, onPress, horizontal = false, width }: { product: Product; favorite: boolean; onToggleFavorite: () => void; onPress: () => void; horizontal?: boolean; width?: number }) {
  return (
    <View style={[styles.card, horizontal && styles.horizontalCard, width ? { width } : null]}>
      <View style={[styles.imageWrap, horizontal && styles.horizontalImageWrap, width ? { height: Math.round(width * 1.3) } : null]}>
        <CatalogImage uri={product.image} label={product.category} style={styles.image} contentFit="cover" transition={180} />
        <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Ver ${product.name}`} style={styles.imageHit} />
        {!!product.badge && <View style={styles.badge}><Text style={styles.badgeText}>{product.badge}</Text></View>}
        <Pressable onPress={onToggleFavorite} hitSlop={12} accessibilityRole="button" accessibilityLabel={favorite ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`} accessibilityState={{ selected: favorite }} style={styles.heart}>
          <Ionicons name={favorite ? "heart" : "heart-outline"} size={18} color={favorite ? colors.wine : colors.ink} />
        </Pressable>
      </View>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Ver detalhes de ${product.name}`} style={({ pressed }) => [styles.copy, pressed && styles.pressed]}>
        <View style={styles.metaRow}><Text style={styles.category}>{product.category}</Text>{product.isNew && <Text style={styles.new}>NOVO</Text>}</View>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.color}>{product.color}</Text>
        <Text style={styles.price}>{formatBRL(product.price)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 170 },
  horizontalCard: { width: 144 },
  imageWrap: { height: 208, borderRadius: 13, overflow: "hidden", backgroundColor: colors.sand, position: "relative" },
  horizontalImageWrap: { height: 184 },
  image: { width: "100%", height: "100%" },
  imageHit: { ...StyleSheet.absoluteFill },
  heart: { position: "absolute", top: 8, right: 8, width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,253,249,0.9)", alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", left: 10, top: 10, backgroundColor: colors.ink, paddingHorizontal: 8, paddingVertical: 5 },
  badgeText: { color: colors.paper, fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  copy: { paddingTop: 10, gap: 3 },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  category: { color: colors.wine, fontSize: 10, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  new: { color: colors.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  name: { color: colors.ink, fontFamily: "Georgia", fontSize: 17, marginTop: 1 },
  color: { color: colors.muted, fontSize: 12 },
  price: { color: colors.ink, fontSize: 15, fontWeight: "800", marginTop: 3 },
  pressed: { opacity: 0.8 },
});
