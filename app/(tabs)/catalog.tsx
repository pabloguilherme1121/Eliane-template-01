import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark, IconButton, PillButton } from "@/components/brand";
import { EmptyState } from "@/components/empty-state";
import { ProductCard } from "@/components/product-card";
import { colors } from "@/constants/tokens";
import { categories, products } from "@/lib/catalog";
import { catalogCardWidth } from "@/lib/layout";
import { matchesCatalogQuery } from "@/lib/catalog-search";
import { useStore } from "@/lib/store";

const colorOptions = ["Todos", "Coral intenso", "Verde esmeralda", "Aveia", "Lavanda", "Lavanda esportivo", "Neutro elegante"];
const sizeOptions = ["Todos", "P", "M", "G", "GG", "XG", "38", "40", "42", "44", "46", "48", "50", "52", "54"];
const priceOptions = ["Todos", "Até R$ 180", "R$ 180–250", "Acima de R$ 250"];

export default function CatalogScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const searchRef = useRef<TextInput>(null);
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = catalogCardWidth(screenWidth);
  const { cartCount, isFavorite, toggleFavorite } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(typeof params.category === "string" ? params.category : "Todos");
  const [priceFilter, setPriceFilter] = useState("Todos");
  const [selectedColor, setSelectedColor] = useState("Todos");
  const [selectedSize, setSelectedSize] = useState("Todos");
  const [sortMode, setSortMode] = useState<"relevance" | "price-asc" | "price-desc">("relevance");
  const [showAdvanced, setShowAdvanced] = useState(false);
  useEffect(() => {
    if (typeof params.category === "string" && categories.includes(params.category)) setCategory(params.category);
  }, [params.category]);

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const matchesQuery = matchesCatalogQuery(product, query);
      const matchesCategory = category === "Todos" || (category === "Novidades" ? product.isNew : product.category === category);
      const matchesPrice = priceFilter === "Todos" || (priceFilter === "Até R$ 180" ? product.price <= 180 : priceFilter === "R$ 180–250" ? product.price > 180 && product.price <= 250 : product.price > 250);
      const matchesColor = selectedColor === "Todos" || product.color === selectedColor;
      const matchesSize = selectedSize === "Todos" || product.sizes.includes(selectedSize);
      return matchesQuery && matchesCategory && matchesPrice && matchesColor && matchesSize;
    });
    return [...result].sort((a, b) => sortMode === "price-asc" ? a.price - b.price : sortMode === "price-desc" ? b.price - a.price : 0);
  }, [category, priceFilter, query, selectedColor, selectedSize, sortMode]);

  const rows = Array.from({ length: Math.ceil(filtered.length / 2) }, (_, index) => filtered.slice(index * 2, index * 2 + 2));
  const activeFilterCount = [category !== "Todos", priceFilter !== "Todos", selectedColor !== "Todos", selectedSize !== "Todos"].filter(Boolean).length;
  const resetFilters = () => {
    setQuery("");
    setCategory("Todos");
    setPriceFilter("Todos");
    setSelectedColor("Todos");
    setSelectedSize("Todos");
    setSortMode("relevance");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topbar}><BrandMark compact /><View style={styles.topActions}><IconButton icon="search-outline" label="Buscar produtos" onPress={() => searchRef.current?.focus()} /><IconButton icon="bag-handle-outline" label="Abrir sacola" badge={cartCount} onPress={() => router.push("/(tabs)/bag")} /></View></View>
        <Text style={styles.eyebrow}>Curadoria Eliane</Text><Text style={styles.title}>Catálogo</Text>
        <View style={styles.search}><Ionicons name="search" size={18} color={colors.muted} /><TextInput ref={searchRef} value={query} onChangeText={setQuery} placeholder="Buscar por peça, cor..." placeholderTextColor={colors.muted} style={styles.searchInput} accessibilityLabel="Buscar produtos" returnKeyType="search" />{query.length > 0 && <Pressable onPress={() => { setQuery(""); searchRef.current?.focus(); }} style={styles.clearSearch} accessibilityRole="button" accessibilityLabel="Limpar busca"><Ionicons name="close-circle" size={21} color={colors.muted} /></Pressable>}</View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{categories.map((item) => <PillButton key={item} active={category === item} onPress={() => setCategory(item)}>{item}</PillButton>)}</ScrollView>
        <Pressable onPress={() => setShowAdvanced((value) => !value)} style={styles.advancedToggle} accessibilityRole="button" accessibilityLabel={showAdvanced ? "Fechar filtros avançados" : "Abrir filtros avançados"} accessibilityState={{ expanded: showAdvanced }}><View style={styles.advancedLabel}><Ionicons name="options-outline" size={17} color={colors.wine} /><Text style={styles.advancedText}>Filtros avançados</Text>{activeFilterCount > 0 && <View style={styles.filterCount}><Text style={styles.filterCountText}>{activeFilterCount}</Text></View>}</View><Ionicons name={showAdvanced ? "chevron-up" : "chevron-down"} size={16} color={colors.ink} /></Pressable>
        {showAdvanced && <View style={styles.advancedPanel}>
          <Text style={styles.filterLabel}>Faixa de preço</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionRail}>{priceOptions.map((item) => <PillButton key={item} active={priceFilter === item} onPress={() => setPriceFilter(item)}>{item}</PillButton>)}</ScrollView>
          <Text style={styles.filterLabel}>Cor</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionRail}>{colorOptions.map((item) => <PillButton key={item} active={selectedColor === item} onPress={() => setSelectedColor(item)}>{item}</PillButton>)}</ScrollView>
          <Text style={styles.filterLabel}>Tamanho</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionRail}>{sizeOptions.map((item) => <PillButton key={item} active={selectedSize === item} onPress={() => setSelectedSize(item)}>{item}</PillButton>)}</ScrollView>
          <Pressable onPress={resetFilters} style={styles.clearFilters} accessibilityRole="button"><Text style={styles.clearFiltersText}>Limpar todos os filtros</Text></Pressable>
        </View>}
        <View style={styles.resultRow}><Text style={styles.resultCount} accessibilityLiveRegion="polite">{filtered.length} {filtered.length === 1 ? "peça" : "peças"}</Text><Pressable style={styles.sort} onPress={() => setSortMode((current) => current === "relevance" ? "price-asc" : current === "price-asc" ? "price-desc" : "relevance")} accessibilityRole="button" accessibilityLabel="Alterar ordenação"><Ionicons name="swap-vertical-outline" size={16} color={colors.ink} /><Text style={styles.sortText}>{sortMode === "relevance" ? "Relevância" : sortMode === "price-asc" ? "Menor preço" : "Maior preço"}</Text></Pressable></View>
        {filtered.length === 0 ? <EmptyState icon="search-outline" title="Nada por aqui ainda" body="Tente outra busca ou ajuste seus filtros." action="Limpar filtros" onAction={resetFilters} /> : <View style={styles.grid}>{rows.map((row, index) => <View style={styles.gridRow} key={`row-${index}`}>{row.map((product) => <ProductCard key={product.id} width={cardWidth} product={product} favorite={isFavorite(product.id)} onToggleFavorite={() => toggleFavorite(product.id)} onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } })} />)}{row.length === 1 && <View style={{ width: cardWidth }} />}</View>)}</View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  content: { width: "100%", maxWidth: 1000, alignSelf: "center", paddingHorizontal: 18, paddingBottom: 42 },
  topbar: { height: 67, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  topActions: { flexDirection: "row", gap: 8 },
  eyebrow: { color: colors.wine, fontSize: 10, fontWeight: "800", letterSpacing: 1.8, textTransform: "uppercase", marginTop: 16, marginBottom: 6 },
  title: { color: colors.ink, fontFamily: "Georgia", fontSize: 38, lineHeight: 41, marginBottom: 20 },
  search: { height: 52, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 10, borderRadius: 2 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 15 },
  clearSearch: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
  filters: { gap: 8, paddingVertical: 18 },
  advancedToggle: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 13, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  advancedLabel: { flexDirection: "row", alignItems: "center", gap: 8 },
  advancedText: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  filterCount: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center", marginLeft: 2 },
  filterCountText: { color: colors.paper, fontSize: 10, fontWeight: "800" },
  advancedPanel: { backgroundColor: colors.white, borderBottomWidth: 1, borderColor: colors.line, padding: 13 },
  filterLabel: { color: colors.ink, fontSize: 11, fontWeight: "800", marginTop: 5, marginBottom: 9 },
  optionRail: { gap: 8, paddingBottom: 12 },
  clearFilters: { alignSelf: "flex-start", paddingTop: 3 },
  clearFiltersText: { color: colors.wine, fontSize: 11, fontWeight: "800", textDecorationLine: "underline" },
  resultRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: 13, marginTop: 17, marginBottom: 18 },
  resultCount: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  sort: { flexDirection: "row", alignItems: "center", gap: 6 },
  sortText: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  grid: { gap: 24 },
  gridRow: { flexDirection: "row", justifyContent: "flex-start", gap: 12 },
  spacer: { width: 170 },
});
