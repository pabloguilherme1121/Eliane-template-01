import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark } from "@/components/brand";
import { EmptyState } from "@/components/empty-state";
import { ProductCard } from "@/components/product-card";
import { colors } from "@/constants/tokens";
import { products } from "@/lib/catalog";
import { productGridLayout } from "@/lib/layout";
import { useStore } from "@/lib/store";

export default function FavoritesScreen() {
  const { hydrated, favorites, isFavorite, toggleFavorite } = useStore();
  const { width: screenWidth } = useWindowDimensions();
  const { columns, cardWidth } = productGridLayout(screenWidth);
  const saved = products.filter((product) => favorites.includes(product.id));
  const rows = Array.from({ length: Math.ceil(saved.length / columns) }, (_, index) => saved.slice(index * columns, index * columns + columns));
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topbar}><BrandMark compact /><View style={styles.headerDecoration} accessible={false}><Ionicons name="heart-outline" size={20} color={colors.wine} /></View></View>
        <Text style={styles.eyebrow}>Sua seleção</Text><Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>{!hydrated ? "Recuperando seus favoritos..." : saved.length ? `${saved.length} ${saved.length === 1 ? "peça guardada" : "peças guardadas"}` : "Guarde o que conversar com você."}</Text>
        {!hydrated ? <View style={styles.loading}><ActivityIndicator color={colors.wine} accessibilityLabel="Carregando favoritos" /><Text style={styles.loadingText} accessibilityLiveRegion="polite">Recuperando sua seleção salva...</Text></View> : saved.length === 0 ? <EmptyState icon="heart-outline" title="Sua curadoria começa aqui" body="Toque no coração de uma peça para guardar seus achados e voltar quando quiser." action="Explorar catálogo" onAction={() => router.push("/(tabs)/catalog")} /> : <View style={styles.grid}>{rows.map((row, index) => <View key={`row-${index}`} style={styles.gridRow}>{row.map((product) => <ProductCard key={product.id} width={cardWidth} product={product} favorite={isFavorite(product.id)} onToggleFavorite={() => toggleFavorite(product.id)} onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } })} />)}</View>)}</View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ headerDecoration: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" }, loading: { minHeight: 180, alignItems: "center", justifyContent: "center", gap: 12 }, loadingText: { color: colors.muted, fontSize: 13, textAlign: "center" }, safe: { flex: 1, backgroundColor: colors.paper }, content: { width: "100%", maxWidth: 1000, alignSelf: "center", paddingHorizontal: 18, paddingBottom: 42 }, topbar: { height: 67, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, eyebrow: { color: colors.wine, fontSize: 10, fontWeight: "800", letterSpacing: 1.8, textTransform: "uppercase", marginTop: 16, marginBottom: 6 }, title: { color: colors.ink, fontFamily: "Georgia", fontSize: 38, lineHeight: 41 }, subtitle: { color: colors.muted, fontSize: 13, marginTop: 8, marginBottom: 26 }, grid: { gap: 24 }, gridRow: { flexDirection: "row", gap: 12 },
});
