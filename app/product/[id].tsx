import { Ionicons } from "@expo/vector-icons";
import { CatalogImage } from "@/components/catalog-image";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconButton, PillButton } from "@/components/brand";
import { colors } from "@/constants/tokens";
import { formatBRL, products } from "@/lib/catalog";
import { openWhatsApp } from "@/lib/contact";
import { productDetailImageHeight } from "@/lib/layout";
import { useStore } from "@/lib/store";

/** Gera URLs diretas para todos os produtos conhecidos no modo web estático. */
export function generateStaticParams() {
  return products.map(({ id }) => ({ id }));
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductDetailContent key={id} id={id} />;
}

function ProductDetailContent({ id }: { id: string }) {
  const product = useMemo(() => products.find((item) => item.id === id), [id]);
  const { width: screenWidth } = useWindowDimensions();
  const { cartCount, isFavorite, toggleFavorite, addToCart } = useStore();
  const gallery = product?.images ?? (product ? [product.image] : []);
  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState(product?.sizes[0] ?? "");
  if (!product) return <SafeAreaView style={styles.safe}><View style={styles.notFound}><Text style={styles.notFoundTitle}>Peça não encontrada</Text><Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar à loja" style={styles.backAction}><Text style={styles.backLink}>Voltar</Text></Pressable></View></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topbar}><IconButton icon="arrow-back" label="Voltar" onPress={() => router.back()} /><Text style={styles.topTitle}>Detalhes</Text><View style={styles.topActions}><IconButton icon={isFavorite(product.id) ? "heart" : "heart-outline"} label="Favoritar" onPress={() => toggleFavorite(product.id)} /><IconButton icon="bag-handle-outline" label="Abrir sacola" badge={cartCount} onPress={() => router.push("/(tabs)/bag")} /></View></View>
        <View style={[styles.imageFrame, { height: productDetailImageHeight(screenWidth) }]}><CatalogImage uri={gallery[selectedImage] ?? product.image} label={product.category} style={styles.image} contentFit="cover" transition={250} priority="high" />{product.badge && <View style={styles.badge}><Text style={styles.badgeText}>{product.badge}</Text></View>}</View>
        {gallery.length > 1 && <View style={styles.galleryStrip}>{gallery.map((image, index) => <Pressable key={image} onPress={() => setSelectedImage(index)} style={[styles.thumbnail, selectedImage === index && styles.thumbnailActive]} accessibilityRole="button" accessibilityState={{ selected: selectedImage === index }} accessibilityLabel={`Ver imagem ${index + 1}`}><CatalogImage uri={image} compact style={styles.thumbnailImage} contentFit="cover" /></Pressable>)}</View>}
        <View style={styles.detail}><View style={styles.detailMeta}><Text style={styles.category}>{product.category}</Text>{product.isNew && <Text style={styles.new}>NOVA CHEGADA</Text>}</View><Text style={styles.name}>{product.name}</Text><Text style={styles.color}>{product.color}</Text><Text style={styles.price}>{formatBRL(product.price)}</Text><View style={styles.divider} /><Text style={styles.description}>{product.description}</Text><View style={styles.sizeHeader}><Text style={styles.label}>Escolha o tamanho</Text><Pressable onPress={() => openWhatsApp(`Olá! Gostaria de ajuda com as medidas do produto ${product.name}.`)} accessibilityRole="link" accessibilityLabel={`Consultar medidas de ${product.name} pelo WhatsApp`} style={styles.sizeHelp}><Text style={styles.guide}>Consulte suas medidas com a equipe</Text></Pressable></View><View style={styles.sizes}>{product.sizes.map((item) => <PillButton key={item} active={size === item} onPress={() => setSize(item)}>{item}</PillButton>)}</View><Pressable onPress={() => addToCart(product, size)} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]} accessibilityRole="button"><Text style={styles.addText}>Adicionar à sacola</Text><Ionicons name="arrow-forward" size={17} color={colors.paper} /></Pressable><Pressable onPress={() => openWhatsApp(`Olá! Gostaria de consultar a disponibilidade e o valor final de ${product.name}, tamanho ${size}.`)} style={({ pressed }) => [styles.whatsappButton, pressed && styles.pressed]} accessibilityRole="button"><Ionicons name="logo-whatsapp" size={16} color={colors.wine} /><Text style={styles.whatsappText}>Consultar pelo WhatsApp</Text></Pressable><View style={styles.detailsRow}><Ionicons name="leaf-outline" size={19} color={colors.wine} /><View><Text style={styles.detailsTitle}>Feito para a vida real</Text><Text style={styles.detailsText}>Modelagens confortáveis para vestir seus momentos.</Text></View></View><View style={styles.detailsRow}><Ionicons name="refresh-outline" size={19} color={colors.wine} /><View><Text style={styles.detailsTitle}>Dúvidas sobre trocas?</Text><Text style={styles.detailsText}>Consulte as condições e os prazos com a equipe.</Text></View></View></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.paper }, content: { width: "100%", maxWidth: 760, alignSelf: "center", paddingHorizontal: 18, paddingBottom: 42 }, topbar: { height: 70, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, topTitle: { color: colors.ink, fontFamily: "Georgia", fontSize: 18 }, topActions: { flexDirection: "row", gap: 7 }, imageFrame: { height: 440, backgroundColor: colors.sand, position: "relative", overflow: "hidden" }, image: { width: "100%", height: "100%" }, galleryStrip: { flexDirection: "row", gap: 9, paddingTop: 10 }, thumbnail: { width: 60, height: 72, borderWidth: 1, borderColor: "transparent" }, thumbnailActive: { borderColor: colors.wine }, thumbnailImage: { width: "100%", height: "100%" }, badge: { position: "absolute", left: 14, top: 14, backgroundColor: colors.ink, paddingHorizontal: 9, paddingVertical: 6 }, badgeText: { color: colors.paper, fontSize: 9, fontWeight: "800", letterSpacing: 0.5 }, detail: { paddingTop: 23 }, detailMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, category: { color: colors.wine, fontSize: 10, fontWeight: "800", letterSpacing: 1.6, textTransform: "uppercase" }, new: { color: colors.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1 }, name: { color: colors.ink, fontFamily: "Georgia", fontSize: 31, lineHeight: 36, marginTop: 9 }, color: { color: colors.muted, fontSize: 13, marginTop: 6 }, price: { color: colors.ink, fontSize: 16, fontWeight: "800", marginTop: 15 }, divider: { borderTopWidth: 1, borderTopColor: colors.line, marginVertical: 21 }, description: { color: colors.muted, fontSize: 14, lineHeight: 22 }, sizeHeader: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between", marginTop: 28, marginBottom: 11 }, label: { color: colors.ink, fontSize: 12, fontWeight: "800" }, guide: { color: colors.wine, fontSize: 11, fontWeight: "800", textDecorationLine: "underline" }, sizeHelp: { minHeight: 44, justifyContent: "center" }, sizes: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, addButton: { height: 52, backgroundColor: colors.wine, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 26 }, addText: { color: colors.paper, fontSize: 14, fontWeight: "800" }, whatsappButton: { height: 45, borderWidth: 1, borderColor: colors.wine, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10 }, whatsappText: { color: colors.wine, fontSize: 13, fontWeight: "800" }, detailsRow: { flexDirection: "row", alignItems: "flex-start", gap: 11, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 15, marginTop: 18 }, detailsTitle: { color: colors.ink, fontSize: 12, fontWeight: "800", marginBottom: 3 }, detailsText: { color: colors.muted, fontSize: 11 }, pressed: { opacity: 0.75 }, notFound: { flex: 1, alignItems: "center", justifyContent: "center" }, notFoundTitle: { color: colors.ink, fontFamily: "Georgia", fontSize: 25 }, backAction: { minWidth: 88, minHeight: 44, alignItems: "center", justifyContent: "center" }, backLink: { color: colors.wine, marginTop: 15, fontWeight: "800" },
});
