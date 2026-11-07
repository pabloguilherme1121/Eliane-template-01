import { Linking } from "react-native";

export const WHATSAPP_NUMBER = "5561991245746";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export async function openWhatsApp(message = "Olá! Vim pelo app Eliane Fashion e gostaria de ajuda.") {
  const url = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
  await Linking.openURL(url);
}
