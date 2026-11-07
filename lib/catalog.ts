export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  color: string;
  description: string;
  sizes: string[];
  image: string;
  images?: string[];
  badge?: string;
  isNew?: boolean;
};

export const HERO_IMAGE = "/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-1.webp";

export const products: Product[] = [
  {
    id: "vestido-viva",
    name: "Vestido Viva",
    category: "Vestidos",
    price: 189.9,
    color: "Coral intenso",
    description: "Uma peça que valoriza o movimento, com caimento confortável e comprimento midi para acompanhar seus dias com estilo.",
    sizes: ["38", "40", "42", "44", "46", "48", "50", "52", "54"],
    image: "/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-2.webp",
    images: ["/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-2.webp", "/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-1.webp"],
    badge: "Queridinho",
    isNew: true,
  },
  {
    id: "macaquinho-movimento",
    name: "Macaquinho Movimento",
    category: "Macaquinhos",
    price: 219.9,
    color: "Verde esmeralda",
    description: "Prático, elegante e pronto para resolver o look. A modelagem soltinha traz conforto sem perder a presença.",
    sizes: ["38", "40", "42", "44", "46", "48", "50", "52"],
    image: "/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-3.webp",
    badge: "Novidade",
    isNew: true,
  },
  {
    id: "conjunto-tricot-nuvem",
    name: "Conjunto Tricot Nuvem",
    category: "Tricot",
    price: 239.9,
    color: "Aveia",
    description: "Textura macia, combinação pronta e aquele visual arrumado que funciona do café ao encontro com as amigas.",
    sizes: ["P", "M", "G", "GG", "XG"],
    image: "/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-4.webp",
    badge: "Conforto",
  },
  {
    id: "moletom-leve",
    name: "Moletom Leve",
    category: "Moletons",
    price: 159.9,
    color: "Lavanda",
    description: "Aquele moletom gostoso que deixa o look moderno. Combine com jeans, saia ou o conjunto completo.",
    sizes: ["P", "M", "G", "GG", "XG"],
    image: "/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-5.webp",
  },
  {
    id: "fitness-energia",
    name: "Conjunto Energia",
    category: "Fitness",
    price: 179.9,
    color: "Lavanda esportivo",
    description: "Liberdade para se movimentar com uma produção bonita e confortável, dentro e fora da academia.",
    sizes: ["P", "M", "G", "GG", "XG"],
    image: "/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-5.webp",
    isNew: true,
  },
  {
    id: "saia-essencial",
    name: "Saia Midi Essencial",
    category: "Saias",
    price: 149.9,
    color: "Neutro elegante",
    description: "A peça que combina com a sua blusa favorita e deixa o armário mais versátil, leve e atual.",
    sizes: ["38", "40", "42", "44", "46", "48", "50", "52"],
    image: "/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-2.webp",
  },
];

export const categories = ["Todos", "Novidades", "Vestidos", "Macaquinhos", "Tricot", "Moletons", "Fitness", "Saias"];

export const orders = [
  { id: "EF-2481", date: "12 de outubro de 2026", status: "Em trânsito", total: 219.9, items: "1 item" },
  { id: "EF-2314", date: "28 de setembro de 2026", status: "Entregue", total: 399.8, items: "2 itens" },
];

export const lookbookFeed = [
  { id: "post-1", image: "/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-2.webp", caption: "Um vestido bonito muda o dia ✨" },
  { id: "post-2", image: "/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-3.webp", caption: "Look pronto para sair e aproveitar." },
  { id: "post-3", image: "/manus-storage/async-images/mkcUthEcblbxZlkf4RjzRm/image-4.webp", caption: "Tricot para dias leves e estilosos." },
];

export const formatBRL = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
