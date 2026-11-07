import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "@/constants/tokens";

const PROMO_STATE_KEY = "eliane-fashion-first-purchase-v1";

export function FirstPurchaseModal() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(PROMO_STATE_KEY).then((state) => {
      if (mounted && !state) setVisible(true);
    }).catch(() => {
      if (mounted) setVisible(true);
    });
    return () => { mounted = false; };
  }, []);

  const close = async () => {
    setVisible(false);
    await AsyncStorage.setItem(PROMO_STATE_KEY, "dismissed").catch(() => undefined);
  };

  const submit = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Digite um e-mail válido para receber o benefício.");
      return;
    }
    setError("");
    setSubmitted(true);
    await AsyncStorage.setItem(PROMO_STATE_KEY, "captured").catch(() => undefined);
  };

  return <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
    <KeyboardAvoidingView style={styles.backdrop} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.card}>
        <Pressable onPress={close} style={styles.close} accessibilityRole="button" accessibilityLabel="Fechar oferta"><Ionicons name="close" size={19} color={colors.ink} /></Pressable>
        {!submitted ? <>
          <View style={styles.gift}><Ionicons name="gift-outline" size={23} color={colors.paper} /></View>
          <Text style={styles.eyebrow}>PRIMEIRA COMPRA</Text>
          <Text style={styles.title}>Seu primeiro look vem com um carinho especial.</Text>
          <Text style={styles.body}>Cadastre seu e-mail e receba frete grátis na primeira compra pelo app.</Text>
          <TextInput value={email} onChangeText={(value) => { setEmail(value); setError(""); }} placeholder="seu@email.com" placeholderTextColor={colors.muted} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} accessibilityLabel="E-mail para receber a promoção" />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <Pressable onPress={submit} style={({ pressed }) => [styles.button, pressed && styles.pressed]} accessibilityRole="button"><Text style={styles.buttonText}>Quero meu frete grátis</Text><Ionicons name="arrow-forward" size={16} color={colors.paper} /></Pressable>
          <Pressable onPress={close} accessibilityRole="button"><Text style={styles.later}>Agora não</Text></Pressable>
        </> : <View style={styles.successWrap}>
          <View style={styles.successIcon}><Ionicons name="checkmark" size={24} color={colors.paper} /></View>
          <Text style={styles.title}>Tudo certo!</Text>
          <Text style={styles.body}>Seu benefício de frete grátis foi reservado para a primeira compra.</Text>
          <Pressable onPress={close} style={styles.button} accessibilityRole="button"><Text style={styles.buttonText}>Continuar explorando</Text></Pressable>
        </View>}
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(39,51,59,0.56)", alignItems: "center", justifyContent: "center", padding: 22 },
  card: { width: "100%", maxWidth: 380, backgroundColor: colors.paper, padding: 25, position: "relative" },
  close: { position: "absolute", right: 14, top: 14, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", zIndex: 1 },
  gift: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center", marginBottom: 17 },
  eyebrow: { color: colors.wine, fontSize: 10, fontWeight: "800", letterSpacing: 1.7, marginBottom: 9 },
  title: { color: colors.ink, fontFamily: "Georgia", fontSize: 27, lineHeight: 31, paddingRight: 20 },
  body: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 12 },
  input: { height: 48, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, paddingHorizontal: 13, color: colors.ink, fontSize: 13, marginTop: 19 },
  error: { color: colors.error, fontSize: 11, marginTop: 7 },
  button: { minHeight: 48, backgroundColor: colors.wine, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 14, marginTop: 13 },
  buttonText: { color: colors.paper, fontSize: 12, fontWeight: "800" },
  later: { color: colors.muted, fontSize: 11, textAlign: "center", textDecorationLine: "underline", marginTop: 15 },
  successWrap: { alignItems: "center", paddingTop: 16 },
  successIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.success, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  pressed: { opacity: 0.75 },
});
