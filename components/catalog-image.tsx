import { Image, type ImageContentFit } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, type ImageStyle, type StyleProp } from "react-native";
import { colors } from "@/constants/tokens";
import { canRequestCatalogImage } from "@/lib/image-policy";

/** Mostra um placeholder honesto se os arquivos do serviço de imagens original não estiverem disponíveis. */
export function CatalogImage({
  uri, style, contentFit = "cover", priority = "normal", transition = 180, variant = "product", label = "", compact = false,
}: {
  uri: string;
  style: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
  priority?: "low" | "normal" | "high";
  transition?: number;
  variant?: "product" | "hero";
  label?: string;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [uri]);
  if (failed || !canRequestCatalogImage(uri)) {
    if (variant === "hero") {
      return <View style={[styles.heroPlaceholder, style]} accessibilityLabel="Imagem da campanha em atualização">
        <View style={styles.heroCircle} />
        <View style={styles.heroAccent} />
      </View>;
    }
    return <View style={[styles.placeholder, style]} accessibilityLabel={`Foto ainda não disponível${label ? `: ${label}` : ""}`}>
      <View style={styles.decorativeLine} />
      <Text style={[styles.monogram, compact && styles.monogramCompact]}>EF</Text>
      {!compact && <>
        <Text style={styles.brandText}>ELIANE FASHION</Text>
        {!!label && <Text style={styles.categoryText} numberOfLines={2}>{label.toUpperCase()}</Text>}
        <Text style={styles.label}>FOTO EM ATUALIZAÇÃO</Text>
      </>}
    </View>;
  }
  return <Image source={uri} style={style} contentFit={contentFit} cachePolicy="memory-disk" priority={priority} transition={transition} onError={() => setFailed(true)} />;
}

const styles = StyleSheet.create({
  heroPlaceholder: { backgroundColor: "#EBD9D0", overflow: "hidden" },
  heroCircle: { position: "absolute", right: -75, top: 65, width: 310, height: 310, borderRadius: 155, backgroundColor: "#C9A9A9", opacity: 0.48 },
  heroAccent: { position: "absolute", right: 55, bottom: -45, width: 110, height: 370, backgroundColor: "#B57F8C", opacity: 0.25, transform: [{ rotate: "-18deg" }] },
  placeholder: { backgroundColor: colors.sand, alignItems: "center", justifyContent: "center", padding: 10 },
  decorativeLine: { position: "absolute", top: 13, left: 13, right: 13, bottom: 13, borderWidth: 1, borderColor: "rgba(145,61,80,0.15)" },
  monogram: { fontFamily: "Georgia", fontSize: 34, color: colors.wine, marginBottom: 9 },
  monogramCompact: { fontSize: 19, marginBottom: 0 },
  brandText: { color: colors.ink, fontSize: 9, fontWeight: "800", letterSpacing: 1.5, textAlign: "center" },
  categoryText: { color: colors.wine, fontSize: 11, letterSpacing: 0.3, fontWeight: "700", textAlign: "center", marginTop: 7 },
  label: { fontSize: 8, color: colors.muted, letterSpacing: 0.7, textAlign: "center", fontWeight: "700", marginTop: 9 },
});
