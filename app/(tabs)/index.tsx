import { Ionicons } from "@expo/vector-icons";
import { CatalogImage } from "@/components/catalog-image";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark, IconButton, PillButton, SectionTitle } from "@/components/brand";
import { ProductCard } from "@/components/product-card";
import { colors } from "@/constants/tokens";
import { HERO_IMAGE, lookbookFeed, products } from "@/lib/catalog";
import { openWhatsApp } from "@/lib/contact";
import { useStore } from "@/lib/store";

export default function HomeScreen() {
  const { cartCount, isFavorite, toggleFavorite } = useStore();
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topbar}><BrandMark /><IconButton icon="bag-handle-outline" label="Abrir sacola" badge={cartCount} onPress={() => router.push("/(tabs)/bag")} /></View>
        <Pressable onPress={() => router.push("/(tabs)/catalog")} style={({ pressed }) => [styles.shippingBanner, pressed && styles.pressed]} accessibilityRole="button"><View style={styles.shippingIcon}><Ionicons name="airplane-outline" size={17} color={colors.paper} /></View><View style={styles.shippingCopy}><Text style={styles.shippingTitle}>DESCUBRA SUA PRÓXIMA PEÇA FAVORITA</Text><Text style={styles.shippingBody}>Peças e tamanhos disponíveis para consulta</Text></View><Ionicons name="arrow-forward" size={16} color={colors.wine} /></Pressable>
        <View style={styles.hero}>
          <CatalogImage uri={HERO_IMAGE} variant="hero" style={styles.heroImage} contentFit="cover" transition={300} priority="high" />
          <View style={styles.heroShade} />
          <View style={styles.heroCopy}>
            <Text style={styles.heroKicker}>MODA • ESTILO • TENDÊNCIAS</Text>
            <Text style={styles.heroTitle}>Moda que{`\n`}combina com você.</Text>
            <Text style={styles.heroBody}>Looks reais, confortáveis e cheios de personalidade.</Text>
            <Pressable onPress={() => openWhatsApp()} style={({ pressed }) => [styles.heroCta, pressed && styles.pressed]} accessibilityRole="button"><Text style={styles.heroCtaText}>Peça ajuda para escolher</Text><Ionicons name="logo-whatsapp" size={16} color={colors.paper} /></Pressable>
          </View>
          <View style={styles.heroStamp}><Text style={styles.heroStampText}>EF</Text><Text style={styles.heroStampSub}>CURADORIA</Text></View>
        </View>
        <View style={styles.intro}><Text style={styles.introQuote}>“Seu estilo, do seu jeito.”</Text><Text style={styles.introBody}>Tendências para vestir a vida real: do look de domingo ao conforto que acompanha sua rotina.</Text></View>
        <Pressable onPress={() => openWhatsApp()} style={({ pressed }) => [styles.contactBanner, pressed && styles.pressed]} accessibilityRole="button"><View style={styles.contactIcon}><Ionicons name="logo-whatsapp" size={19} color={colors.paper} /></View><View style={styles.contactCopy}><Text style={styles.contactTitle}>Precisa de ajuda para escolher?</Text><Text style={styles.contactBody}>Fale com a gente pelo WhatsApp</Text></View><Ionicons name="arrow-forward" size={17} color={colors.wine} /></Pressable>
        <SectionTitle eyebrow="Escolhas da semana" title="Peças que chegaram" action="Ver tudo" onAction={() => router.push("/(tabs)/catalog")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} favorite={isFavorite(product.id)} onToggleFavorite={() => toggleFavorite(product.id)} onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } })} horizontal />)}
        </ScrollView>
        <View style={styles.collectionCard}>
          <View style={styles.collectionCopy}><Text style={styles.collectionEyebrow}>TENDÊNCIAS DA SEMANA</Text><Text style={styles.collectionTitle}>Looks que chegam{`\n`}e viram favoritos.</Text><Pressable onPress={() => router.push({ pathname: "/(tabs)/catalog", params: { category: "Novidades" } })} accessibilityRole="button"><Text style={styles.collectionLink}>Ver novidades  →</Text></Pressable></View>
          <View style={styles.collectionOrb}><Text style={styles.orbText}>01</Text></View>
        </View>
        <SectionTitle eyebrow="Do seu jeito" title="Explore por categoria" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRail}>
          {["Vestidos", "Macaquinhos", "Tricot", "Moletons", "Fitness", "Saias"].map((category) => <PillButton key={category} onPress={() => router.push({ pathname: "/(tabs)/catalog", params: { category } })}>{category}</PillButton>)}
        </ScrollView>
        <View style={styles.editorialNote}>
          <Ionicons name="sparkles-outline" size={22} color={colors.wine} />
          <View style={{ flex: 1 }}><Text style={styles.editorialTitle}>Escolhas com mais personalidade</Text><Text style={styles.editorialBody}>Explore as peças, selecione seu tamanho e consulte a disponibilidade antes de fazer o pedido.</Text></View>
        </View>
        <SectionTitle eyebrow="Ideias para combinar" title="Inspiração do catálogo" action="Ver peças" onAction={() => router.push("/(tabs)/catalog")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.instagramRail}>
          {lookbookFeed.map((post) => <View key={post.id} style={styles.instagramCard}><View style={styles.instagramHeader}><View style={styles.instagramAvatar}><Text style={styles.instagramAvatarText}>EF</Text></View><Text style={styles.instagramHandle}>Combinações Eliane Fashion</Text></View><CatalogImage uri={post.image} label="Inspiração" style={styles.instagramImage} contentFit="cover" /><Text style={styles.instagramCaption}>{post.caption}</Text></View>)}
        </ScrollView>
        <View style={styles.footerNote}><Text style={styles.footerLine}>ELIANE FASHION</Text><Text style={styles.footerSmall}>Moda • estilo • tendências</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  content: { width: "100%", maxWidth: 1000, alignSelf: "center", paddingHorizontal: 18, paddingBottom: 40 },
  topbar: { height: 67, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  shippingBanner: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.wineSoft, padding: 13, borderRadius: 10, marginBottom: 13 },
  shippingIcon: { width: 31, height: 31, borderRadius: 16, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center" },
  shippingCopy: { flex: 1 },
  shippingTitle: { color: colors.ink, fontSize: 11, fontWeight: "800", letterSpacing: 0.4 },
  shippingBody: { color: colors.muted, fontSize: 12, marginTop: 3 },
  hero: { height: 445, borderRadius: 17, overflow: "hidden", backgroundColor: colors.sand, position: "relative", marginBottom: 27 },
  heroImage: { ...StyleSheet.absoluteFill },
  heroShade: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(255,248,241,0.49)" },
  heroCopy: { position: "absolute", left: 20, top: 35, width: 225 },
  heroKicker: { color: colors.wine, fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 15 },
  heroTitle: { color: colors.ink, fontFamily: "Georgia", fontSize: 37, lineHeight: 41, letterSpacing: -1.1 },
  heroBody: { color: colors.ink, fontSize: 14, marginTop: 15, lineHeight: 22, width: 204 },
  heroCta: { backgroundColor: colors.wine, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 12, minHeight: 48, paddingVertical: 12, borderRadius: 7, marginTop: 22 },
  heroCtaText: { color: colors.paper, fontSize: 11, fontWeight: "800" },
  heroStamp: { position: "absolute", right: 17, bottom: 18, alignItems: "center", backgroundColor: "rgba(251,248,244,0.83)", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  heroStampText: { color: colors.wine, fontFamily: "Georgia", fontSize: 28 },
  heroStampSub: { color: colors.ink, fontSize: 8, letterSpacing: 2.5, fontWeight: "800", marginTop: -3 },
  intro: { borderLeftWidth: 2, borderLeftColor: colors.wine, paddingLeft: 14, marginBottom: 36 },
  introQuote: { color: colors.ink, fontFamily: "Georgia", fontSize: 22, marginBottom: 8 },
  introBody: { color: colors.muted, fontSize: 13, lineHeight: 19, maxWidth: 280 },
  rail: { gap: 14, paddingBottom: 35 },
  collectionCard: { minHeight: 171, backgroundColor: colors.ink, padding: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 37, overflow: "hidden" },
  collectionCopy: { zIndex: 1 },
  contactBanner: { flexDirection: "row", alignItems: "center", gap: 11, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, padding: 13, marginBottom: 34 },
  contactIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center" },
  contactCopy: { flex: 1 },
  contactTitle: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  contactBody: { color: colors.muted, fontSize: 11, marginTop: 3 },
  collectionEyebrow: { color: colors.sand, fontSize: 10, fontWeight: "800", letterSpacing: 1.7, marginBottom: 12 },
  collectionTitle: { color: colors.paper, fontFamily: "Georgia", fontSize: 25, lineHeight: 28 },
  collectionLink: { color: colors.sand, fontSize: 11, fontWeight: "800", marginTop: 18 },
  collectionOrb: { width: 142, height: 142, borderRadius: 71, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center", marginRight: -44, opacity: 0.95 },
  orbText: { color: colors.paper, fontFamily: "Georgia", fontSize: 50, opacity: 0.85 },
  categoryRail: { gap: 9, paddingBottom: 30 },
  testimonialRail: { gap: 12, paddingBottom: 34 },
  testimonialCard: { width: 278, minHeight: 164, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 17 },
  stars: { color: colors.wine, fontSize: 13, letterSpacing: 2, marginBottom: 13 },
  testimonialQuote: { color: colors.ink, fontFamily: "Georgia", fontSize: 16, lineHeight: 22 },
  testimonialName: { color: colors.ink, fontSize: 11, fontWeight: "800", marginTop: 16 },
  testimonialCity: { color: colors.muted, fontSize: 10, marginTop: 3 },
  instagramRail: { gap: 14, paddingBottom: 32 },
  instagramCard: { width: 250, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  instagramHeader: { height: 45, flexDirection: "row", alignItems: "center", paddingHorizontal: 11, gap: 8 },
  instagramAvatar: { width: 25, height: 25, borderRadius: 13, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center" },
  instagramAvatarText: { color: colors.paper, fontSize: 8, fontWeight: "800" },
  instagramHandle: { flex: 1, color: colors.ink, fontSize: 10, fontWeight: "800" },
  instagramImage: { width: 248, height: 285, backgroundColor: colors.sand },
  instagramActions: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 11, paddingTop: 10 },
  instagramLikes: { color: colors.ink, fontSize: 10, fontWeight: "800", paddingHorizontal: 11, marginTop: 7 },
  instagramCaption: { color: colors.muted, fontSize: 11, lineHeight: 16, paddingHorizontal: 11, paddingTop: 4, paddingBottom: 13 },
  footerNote: { alignItems: "center", borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 22, gap: 5 },
  footerLine: { color: colors.ink, fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  footerSmall: { color: colors.muted, fontSize: 11 },
  editorialNote: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 17, backgroundColor: colors.wineSoft, borderRadius: 12, marginBottom: 35 },
  editorialTitle: { color: colors.ink, fontSize: 16, fontWeight: "700", marginBottom: 6 },
  editorialBody: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  pressed: { opacity: 0.75 },
});
