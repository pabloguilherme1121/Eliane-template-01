import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark, IconButton } from "@/components/brand";
import { EmptyState } from "@/components/empty-state";
import { ProductCard } from "@/components/product-card";
import { colors } from "@/constants/tokens";
import { products } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export default function FavoritesScreen() {
  const { favorites, isFavorite, toggleFavorite } = useStore();
  const saved = products.filter((product) => favorites.includes(product.id));
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topbar}><BrandMark compact /><IconButton icon="heart-outline" label="Favoritos" badge={saved.length || undefined} /></View>
        <Text style={styles.eyebrow}>Sua seleção</Text><Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>{saved.length ? `${saved.length} ${saved.length === 1 ? "peça guardada" : "peças guardadas"}` : "Guarde o que conversar com você."}</Text>
        {saved.length === 0 ? <EmptyState icon="heart-outline" title="Sua curadoria começa aqui" body="Toque no coração de uma peça para guardar seus achados e voltar quando quiser." action="Explorar catálogo" onAction={() => router.push("/(tabs)/catalog")} /> : <View style={styles.grid}>{saved.map((product) => <ProductCard key={product.id} product={product} favorite={isFavorite(product.id)} onToggleFavorite={() => toggleFavorite(product.id)} onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } })} />)}</View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.paper }, content: { paddingHorizontal: 18, paddingBottom: 42 }, topbar: { height: 67, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, eyebrow: { color: colors.wine, fontSize: 10, fontWeight: "800", letterSpacing: 1.8, textTransform: "uppercase", marginTop: 16, marginBottom: 6 }, title: { color: colors.ink, fontFamily: "Georgia", fontSize: 38, lineHeight: 41 }, subtitle: { color: colors.muted, fontSize: 13, marginTop: 8, marginBottom: 26 }, grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 28 },
});
