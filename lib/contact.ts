import { Alert, Linking, Platform } from "react-native";
import { buildWhatsAppUrl } from "@/lib/whatsapp-link";

export const WHATSAPP_NUMBER = "5561991245746";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/** Não deixa uma falha do navegador ou do aplicativo gerar rejeições não tratadas. */
export async function openWhatsApp(
  message = "Olá! Vim pelo app Eliane Fashion e gostaria de ajuda.",
): Promise<boolean> {
  try {
    await Linking.openURL(buildWhatsAppUrl(WHATSAPP_NUMBER, message));
    return true;
  } catch {
    const warning = "Não foi possível abrir o WhatsApp. Tente novamente ou entre em contato diretamente com a loja.";
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && typeof window.alert === "function") {
        window.alert(warning);
      }
    } else {
      Alert.alert("Atendimento indisponível", warning);
    }
    return false;
  }
}
