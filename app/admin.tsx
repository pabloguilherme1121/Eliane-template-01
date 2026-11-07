import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark, PillButton } from "@/components/brand";
import { colors } from "@/constants/tokens";
import { categories, formatBRL, orders as initialOrders, products as initialProducts, type Product } from "@/lib/catalog";
import { ADMIN_STORAGE_KEYS, loadAdminState, saveAdminState } from "@/lib/admin-storage";
import { exportSalesCsv, exportSalesPdf } from "@/lib/report-export";
import { parseBRLPrice } from "@/lib/currency";
import { normalizeAdminProducts, normalizeAdminOrders, normalizeAdminSettings, nextDemoOrderId, summarizeDemo, orderStatuses } from "@/lib/admin-logic";

type AdminProduct = Product & { active: boolean };
type AdminOrder = (typeof initialOrders)[number];
type Section = "overview" | "products" | "orders" | "reports";
type Notification = { id: string; title: string; body: string; read: boolean };


export default function AdminScreen() {
  const [section, setSection] = useState<Section>("overview");
  const [products, setProducts] = useState<AdminProduct[]>(() => initialProducts.map((product) => ({ ...product, active: true })));
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders.map((order) => ({ ...order })));
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const orderSequence = useRef(2481);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const text = `${product.name} ${product.category} ${product.color}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (category === "Todos" || product.category === category);
  }), [category, products, query]);
  const visibleOrders = useMemo(() => orders.filter((order) => status === "Todos" || order.status === status), [orders, status]);
  const summary = useMemo(() => summarizeDemo(orders, products), [orders, products]);
  const activeCount = summary.activeProducts;
  const revenue = summary.total;
  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    Promise.all([
      loadAdminState(ADMIN_STORAGE_KEYS.products, initialProducts.map((product) => ({ ...product, active: true }))),
      loadAdminState(ADMIN_STORAGE_KEYS.orders, initialOrders.map((order) => ({ ...order }))),
      loadAdminState(ADMIN_STORAGE_KEYS.settings, { category: "Todos", status: "Todos", section: "overview" as Section }),
    ]).then(([storedProducts, storedOrders, storedSettings]) => {
      const safeOrders = normalizeAdminOrders(storedOrders, initialOrders);
      const safeProducts = normalizeAdminProducts(storedProducts, initialProducts);
      const safeSettings = normalizeAdminSettings(storedSettings, categories.filter((item) => item !== "Novidades"));
      setProducts(safeProducts);
      setOrders(safeOrders);
      setCategory(safeSettings.category);
      setStatus(safeSettings.status);
      setSection(safeSettings.section);
      orderSequence.current = Number(nextDemoOrderId(safeOrders).slice(3)) - 1;
      setHydrated(true);
    });
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    void saveAdminState(ADMIN_STORAGE_KEYS.products, products);
    void saveAdminState(ADMIN_STORAGE_KEYS.orders, orders);
    void saveAdminState(ADMIN_STORAGE_KEYS.settings, { category, status, section });
  }, [category, hydrated, orders, products, section, status]);

  const flash = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 2200);
  };
  const receiveDemoOrder = useCallback(() => {
    const number = orderSequence.current + 1;
    orderSequence.current = number;
    const newOrder: AdminOrder = { id: `EF-${number}`, date: new Date().toLocaleDateString("pt-BR"), status: "Recebido", total: 189.9, items: "1 item" };
    setOrders((current) => [newOrder, ...current]);
    setNotifications((current) => [{ id: newOrder.id, title: "Pedido de teste gerado", body: `Pedido #${newOrder.id} · ${formatBRL(newOrder.total)}`, read: false }, ...current]);
    flash(`Novo pedido #${newOrder.id} simulado.`);
  }, []);

  const markNotificationsRead = () => setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  const toggleProduct = (id: string) => {
    setProducts((current) => current.map((product) => product.id === id ? { ...product, active: !product.active } : product));
    const product = products.find((item) => item.id === id);
    flash(product?.active ? "Produto marcado como oculto nesta demonstração." : "Produto marcado como ativo nesta demonstração.");
  };
  const startPriceEdit = (product: AdminProduct) => { setEditingId(product.id); setPriceDraft(product.price.toFixed(2).replace(".", ",")); };
  const savePrice = (id: string) => {
    const parsed = parseBRLPrice(priceDraft);
    if (parsed === null) { flash("Digite um preço válido."); return; }
    setProducts((current) => current.map((product) => product.id === id ? { ...product, price: parsed } : product));
    setEditingId(null);
    flash("Preço atualizado nesta sessão.");
  };
  const advanceOrder = (id: string) => {
    setOrders((current) => current.map((order) => {
      if (order.id !== id) return order;
      const index = orderStatuses.indexOf(order.status);
      return { ...order, status: orderStatuses[Math.min(Math.max(index + 1, 0), orderStatuses.length - 1)] };
    }));
    flash("Status do pedido atualizado.");
  };
  const handleCsvExport = () => flash(exportSalesCsv(orders) ? "CSV exportado com sucesso." : "CSV disponível no Preview Web.");
  const handlePdfExport = () => flash(exportSalesPdf(orders) ? "PDF aberto para impressão ou salvamento." : "PDF disponível no Preview Web.");

  return <SafeAreaView style={styles.safe} edges={["top"]}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.topbar}><Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button" accessibilityLabel="Voltar"><Ionicons name="arrow-back" size={20} color={colors.ink} /></Pressable><BrandMark compact /><Pressable onPress={() => { setShowNotifications((value) => !value); markNotificationsRead(); }} style={styles.bell} accessibilityRole="button" accessibilityLabel="Abrir notificações"><Ionicons name="notifications-outline" size={20} color={colors.ink} />{unreadCount > 0 && <View style={styles.bellBadge}><Text style={styles.bellBadgeText}>{unreadCount}</Text></View>}</Pressable></View>
      {showNotifications && <View style={styles.notificationPanel}><View style={styles.notificationHead}><Text style={styles.notificationTitle}>Notificações</Text><View style={styles.livePill}><View style={styles.liveDot} /><Text style={styles.liveText}>SIMULAÇÃO</Text></View></View>{notifications.length === 0 ? <Text style={styles.emptyNotification}>Nenhuma simulação de pedido nesta sessão.</Text> : notifications.slice(0, 4).map((item) => <View key={item.id} style={styles.notificationRow}><View style={styles.notificationIcon}><Ionicons name="bag-check-outline" size={17} color={colors.wine} /></View><View style={styles.notificationCopy}><Text style={styles.notificationItemTitle}>{item.title}</Text><Text style={styles.notificationBody}>{item.body}</Text></View><Text style={styles.notificationTime}>agora</Text></View>)}</View>}
      <Text style={styles.eyebrow}>Central demonstrativa · Somente neste dispositivo</Text><Text style={styles.title}>Painel de demonstração</Text><Text style={styles.subtitle}>Estes números não representam vendas reais. As alterações ficam neste dispositivo.</Text>
      <View style={styles.liveStrip}><View style={styles.liveDot} /><Text style={styles.liveStripText}>Dados locais, pedidos simulados</Text><Pressable onPress={receiveDemoOrder} accessibilityRole="button"><Text style={styles.simulateText}>Simular novo pedido</Text></Pressable></View>
      <View style={styles.stats}><View style={styles.stat}><Text style={styles.statNumber}>{activeCount}</Text><Text style={styles.statLabel}>produtos ativos</Text></View><View style={styles.stat}><Text style={styles.statNumber}>{orders.length}</Text><Text style={styles.statLabel}>pedidos</Text></View><View style={styles.stat}><Text style={styles.statNumber}>{formatBRL(revenue)}</Text><Text style={styles.statLabel}>vendas simuladas</Text></View></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsViewport} contentContainerStyle={styles.tabs}><Pressable onPress={() => setSection("overview")} style={[styles.tab, section === "overview" && styles.tabActive]} accessibilityRole="tab"><Ionicons name="grid-outline" size={16} color={section === "overview" ? colors.paper : colors.ink} /><Text style={[styles.tabText, section === "overview" && styles.tabTextActive]}>Visão geral</Text></Pressable><Pressable onPress={() => setSection("orders")} style={[styles.tab, section === "orders" && styles.tabActive]} accessibilityRole="tab"><Ionicons name="receipt-outline" size={16} color={section === "orders" ? colors.paper : colors.ink} /><Text style={[styles.tabText, section === "orders" && styles.tabTextActive]}>Pedidos</Text></Pressable><Pressable onPress={() => setSection("products")} style={[styles.tab, section === "products" && styles.tabActive]} accessibilityRole="tab"><Ionicons name="shirt-outline" size={16} color={section === "products" ? colors.paper : colors.ink} /><Text style={[styles.tabText, section === "products" && styles.tabTextActive]}>Produtos</Text></Pressable><Pressable onPress={() => setSection("reports")} style={[styles.tab, section === "reports" && styles.tabActive]} accessibilityRole="tab"><Ionicons name="bar-chart-outline" size={16} color={section === "reports" ? colors.paper : colors.ink} /><Text style={[styles.tabText, section === "reports" && styles.tabTextActive]}>Relatórios</Text></Pressable></ScrollView>
      {section === "overview" ? <OverviewPanel orders={orders} products={products} revenue={revenue} onOrders={() => setSection("orders")} onReports={() => setSection("reports")} onProducts={() => setSection("products")} /> : section === "products" ? <ProductsPanel {...{ query, setQuery, category, setCategory, visibleProducts, editingId, priceDraft, setPriceDraft, savePrice, startPriceEdit, toggleProduct, flash }} /> : section === "orders" ? <OrdersPanel {...{ status, setStatus, visibleOrders, advanceOrder }} /> : <ReportsPanel orders={orders} products={products} revenue={revenue} onExportCsv={handleCsvExport} onExportPdf={handlePdfExport} />}
      {!!notice && <View style={styles.notice}><Ionicons name="checkmark-circle" size={17} color={colors.paper} /><Text style={styles.noticeText}>{notice}</Text></View>}
      <View style={styles.demoNote}><Ionicons name="information-circle-outline" size={17} color={colors.wine} /><Text style={styles.demoText}>Modo demonstração: notificações e alterações funcionam nesta sessão. Para produção, conecte eventos do backend, autenticação e banco.</Text></View>
    </ScrollView>
  </SafeAreaView>;
}

function OverviewPanel({ orders, products, revenue, onOrders, onReports, onProducts }: { orders: AdminOrder[]; products: AdminProduct[]; revenue: number; onOrders: () => void; onReports: () => void; onProducts: () => void }) {
  const summary = summarizeDemo(orders, products);
  const hidden = products.length - summary.activeProducts;
  return <View>
    <View style={styles.overviewHero}>
      <View style={styles.overviewHeroCopy}>
        <Text style={styles.heroKicker}>VISÃO DA DEMONSTRAÇÃO</Text>
        <Text style={styles.heroTitle}>Seu catálogo, em ordem.</Text>
        <Text style={styles.heroBody}>Explore o fluxo de pedidos fictícios e controle sua vitrine local.</Text>
      </View>
      <View style={styles.heroRing}><Ionicons name="layers-outline" size={28} color={colors.paper} /><Text style={styles.heroRingLabel}>DEMO</Text></View>
    </View>
    <View style={styles.kpiGrid}>
      <View style={styles.kpiCard}><Text style={styles.kpiLabel}>VALOR SIMULADO</Text><Text style={styles.kpiValue}>{formatBRL(revenue)}</Text><Text style={styles.kpiDelta}>Somente pedidos de teste</Text></View>
      <View style={styles.kpiCard}><Text style={styles.kpiLabel}>PEDIDOS</Text><Text style={styles.kpiValue}>{orders.length}</Text><Text style={styles.kpiDelta}>{summary.pending} em andamento</Text></View>
      <View style={styles.kpiCard}><Text style={styles.kpiLabel}>CATÁLOGO LOCAL</Text><Text style={styles.kpiValue}>{summary.activeProducts}</Text><Text style={styles.kpiDelta}>{hidden > 0 ? `${hidden} oculto${hidden > 1 ? "s" : ""}` : "Nenhuma peça oculta"}</Text></View>
    </View>
    <View style={styles.attentionHead}><Text style={styles.sectionTitle}>Precisa de atenção</Text><Text style={styles.liveCaption}>DADOS LOCAIS</Text></View>
    <Pressable onPress={onOrders} style={styles.attentionCard} accessibilityRole="button">
      <View style={[styles.attentionIcon, summary.pending > 0 ? styles.attentionIconWarm : styles.attentionIconDone]}><Ionicons name={summary.pending > 0 ? "cube-outline" : "checkmark-circle-outline"} size={20} color={summary.pending > 0 ? colors.wine : colors.success} /></View>
      <View style={styles.attentionCopy}><Text style={styles.attentionTitle}>{summary.pending > 0 ? `${summary.pending} pedidos de teste em andamento` : "Nenhum pedido de teste pendente"}</Text><Text style={styles.attentionBody}>Abra a lista para conferir os status simulados.</Text></View>
      <Ionicons name="arrow-forward" size={17} color={colors.muted} />
    </Pressable>
    <Text style={styles.sectionTitle}>Acesso rápido</Text>
    <View style={styles.quickGrid}>
      <Pressable onPress={onOrders} style={styles.quickCard} accessibilityRole="button"><View style={styles.quickCardIcon}><Ionicons name="receipt-outline" size={19} color={colors.wine} /></View><Text style={styles.quickCardTitle}>Pedidos</Text><Text style={styles.quickCardBody}>Ver fluxo de teste</Text></Pressable>
      <Pressable onPress={onProducts} style={styles.quickCard} accessibilityRole="button"><View style={styles.quickCardIcon}><Ionicons name="shirt-outline" size={19} color={colors.wine} /></View><Text style={styles.quickCardTitle}>Vitrine</Text><Text style={styles.quickCardBody}>Editar dados locais</Text></Pressable>
      <Pressable onPress={onReports} style={styles.quickCard} accessibilityRole="button"><View style={styles.quickCardIcon}><Ionicons name="bar-chart-outline" size={19} color={colors.wine} /></View><Text style={styles.quickCardTitle}>Relatórios</Text><Text style={styles.quickCardBody}>Resumo da demonstração</Text></Pressable>
    </View>
  </View>;
}

function ProductsPanel({ query, setQuery, category, setCategory, visibleProducts, editingId, priceDraft, setPriceDraft, savePrice, startPriceEdit, toggleProduct, flash }: any) {
  return <><View style={styles.search}><Ionicons name="search" size={17} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Buscar produto" placeholderTextColor={colors.muted} style={styles.searchInput} accessibilityLabel="Buscar produtos no painel" /></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRail}>{["Todos", ...categories.filter((item) => item !== "Todos" && item !== "Novidades")].map((item) => <PillButton key={item} active={category === item} onPress={() => setCategory(item)}>{item}</PillButton>)}</ScrollView><View style={styles.sectionHead}><Text style={styles.sectionTitle}>Vitrine <Text style={styles.muted}>({visibleProducts.length})</Text></Text><Pressable onPress={() => flash("Cadastro de produto disponível na próxima integração.")} style={styles.addButton} accessibilityRole="button"><Ionicons name="add" size={15} color={colors.paper} /><Text style={styles.addText}>Novo produto</Text></Pressable></View><View style={styles.list}>{visibleProducts.map((product: AdminProduct) => <View key={product.id} style={styles.productRow}><View style={styles.productIcon}><Ionicons name="shirt-outline" size={19} color={product.active ? colors.wine : colors.muted} /></View><View style={styles.productInfo}><Text style={styles.productName}>{product.name}</Text><Text style={styles.productMeta}>{product.category} · {product.color}</Text>{editingId === product.id ? <View style={styles.editPrice}><TextInput value={priceDraft} onChangeText={setPriceDraft} keyboardType="decimal-pad" style={styles.priceInput} accessibilityLabel={`Editar preço de ${product.name}`} /><Pressable onPress={() => savePrice(product.id)} accessibilityRole="button"><Text style={styles.saveText}>Salvar</Text></Pressable></View> : <Text style={styles.productPrice}>{formatBRL(product.price)}</Text>}</View><View style={styles.rowActions}><Pressable onPress={() => editingId === product.id ? savePrice(product.id) : startPriceEdit(product)} style={styles.iconAction} accessibilityRole="button" accessibilityLabel={`Editar preço de ${product.name}`}><Ionicons name={editingId === product.id ? "checkmark" : "create-outline"} size={17} color={colors.ink} /></Pressable><Pressable onPress={() => toggleProduct(product.id)} style={[styles.activePill, product.active ? styles.active : styles.inactive]} accessibilityRole="button"><Text style={[styles.activeText, product.active ? styles.activeTextOn : styles.activeTextOff]}>{product.active ? "Ativo" : "Oculto"}</Text></Pressable></View></View>)}</View></>;
}

function OrdersPanel({ status, setStatus, visibleOrders, advanceOrder }: any) {
  return <><Text style={styles.filterLabel}>Filtrar por status</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRail}>{["Todos", ...orderStatuses].map((item) => <PillButton key={item} active={status === item} onPress={() => setStatus(item)}>{item}</PillButton>)}</ScrollView><View style={styles.sectionHead}><Text style={styles.sectionTitle}>Pedidos <Text style={styles.muted}>({visibleOrders.length})</Text></Text><Text style={styles.helper}>Toque para avançar</Text></View><View style={styles.list}>{visibleOrders.map((order: AdminOrder) => <Pressable key={order.id} onPress={() => advanceOrder(order.id)} style={styles.orderRow} accessibilityRole="button" accessibilityLabel={`Atualizar status do pedido ${order.id}`}><View style={styles.orderIcon}><Ionicons name="cube-outline" size={20} color={colors.wine} /></View><View style={styles.orderInfo}><Text style={styles.orderId}>#{order.id}</Text><Text style={styles.orderMeta}>{order.date} · {order.items}</Text><Text style={styles.orderPrice}>{formatBRL(order.total)}</Text></View><View style={styles.orderRight}><View style={[styles.status, order.status === "Entregue" && styles.statusDone]}><Text style={[styles.statusText, order.status === "Entregue" && styles.statusDoneText]}>{order.status}</Text></View><Ionicons name="chevron-forward" size={16} color={colors.muted} /></View></Pressable>)}</View></>;
}

function ReportsPanel({ orders, products, revenue, onExportCsv, onExportPdf }: { orders: AdminOrder[]; products: AdminProduct[]; revenue: number; onExportCsv: () => void; onExportPdf: () => void }) {
  const summary = summarizeDemo(orders, products);
  const maxStatus = Math.max(1, ...summary.statusCounts.map((item) => item.count));
  const maxCategory = Math.max(1, ...summary.categoryCounts.map((item) => item.count));
  return <View>
    <View style={styles.reportActions}>
      <Pressable onPress={onExportCsv} style={styles.exportButton} accessibilityRole="button"><Ionicons name="document-text-outline" size={16} color={colors.paper} /><Text style={styles.exportText}>Exportar CSV</Text></Pressable>
      <Pressable onPress={onExportPdf} style={[styles.exportButton, styles.exportSecondary]} accessibilityRole="button"><Ionicons name="print-outline" size={16} color={colors.wine} /><Text style={styles.exportTextSecondary}>Imprimir PDF</Text></Pressable>
    </View>
    <View style={styles.reportCards}>
      <View style={styles.reportCard}><Ionicons name="time-outline" size={18} color={colors.wine} /><Text style={styles.reportNumber}>{summary.pending}</Text><Text style={styles.reportLabel}>pedidos de teste pendentes</Text></View>
      <View style={styles.reportCard}><Ionicons name="cart-outline" size={18} color={colors.wine} /><Text style={styles.reportNumber}>{orders.length}</Text><Text style={styles.reportLabel}>pedidos de teste no dispositivo</Text></View>
    </View>
    <View style={styles.chartCard}>
      <View style={styles.chartHead}><View><Text style={styles.chartEyebrow}>PEDIDOS DE EXEMPLO</Text><Text style={styles.chartTitle}>Distribuição por status</Text></View><Text style={styles.chartTotal}>{formatBRL(revenue)}</Text></View>
      <View style={styles.categoryChart}>{summary.statusCounts.map((item) => <View key={item.status} style={styles.categoryLine}>
        <View style={styles.categoryLineHead}><Text style={styles.categoryLabel}>{item.status}</Text><Text style={styles.categoryValue}>{item.count} pedido{item.count === 1 ? "" : "s"}</Text></View>
        <View style={styles.categoryTrack}><View style={[styles.categoryFill, { width: `${(item.count / maxStatus) * 100}%`, backgroundColor: colors.wine }]} /></View>
      </View>)}</View>
    </View>
    <View style={styles.chartCard}>
      <Text style={styles.chartEyebrow}>CATÁLOGO DE EXEMPLO</Text><Text style={styles.chartTitle}>Peças ativas por categoria</Text>
      <View style={styles.categoryChart}>{summary.categoryCounts.length === 0 ? <Text style={styles.muted}>Nenhuma peça está ativa nesta demonstração.</Text> : summary.categoryCounts.map((item) => <View key={item.category} style={styles.categoryLine}>
        <View style={styles.categoryLineHead}><Text style={styles.categoryLabel}>{item.category}</Text><Text style={styles.categoryValue}>{item.count} peça{item.count === 1 ? "" : "s"}</Text></View>
        <View style={styles.categoryTrack}><View style={[styles.categoryFill, { width: `${(item.count / maxCategory) * 100}%`, backgroundColor: colors.wine }]} /></View>
      </View>)}</View>
    </View>
    <View style={styles.insight}><Ionicons name="information-circle-outline" size={18} color={colors.wine} /><Text style={styles.insightText}><Text style={styles.insightStrong}>Dados desta demonstração. </Text>Os gráficos acompanham as alterações locais. Eles não representam vendas reais, nem um período comercial fechado.</Text></View>
  </View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper }, content: { paddingHorizontal: 18, paddingBottom: 42 }, topbar: { height: 67, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" }, bell: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.wineSoft, alignItems: "center", justifyContent: "center", position: "relative" }, bellBadge: { position: "absolute", right: -2, top: -3, minWidth: 17, height: 17, borderRadius: 9, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center" }, bellBadgeText: { color: colors.paper, fontSize: 9, fontWeight: "800" }, notificationPanel: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 13, marginBottom: 15 }, notificationHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }, notificationTitle: { color: colors.ink, fontFamily: "Georgia", fontSize: 19 }, livePill: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#E2EEE4", paddingHorizontal: 7, paddingVertical: 5 }, liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success }, liveText: { color: colors.success, fontSize: 8, fontWeight: "800", letterSpacing: 0.7 }, emptyNotification: { color: colors.muted, fontSize: 11, paddingVertical: 8 }, notificationRow: { flexDirection: "row", alignItems: "center", gap: 9, borderTopWidth: 1, borderTopColor: colors.line, paddingVertical: 10 }, notificationIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.wineSoft, alignItems: "center", justifyContent: "center" }, notificationCopy: { flex: 1 }, notificationItemTitle: { color: colors.ink, fontSize: 11, fontWeight: "800" }, notificationBody: { color: colors.muted, fontSize: 10, marginTop: 3 }, notificationTime: { color: colors.muted, fontSize: 9 }, eyebrow: { color: colors.wine, fontSize: 10, fontWeight: "800", letterSpacing: 1.7, textTransform: "uppercase", marginTop: 14, marginBottom: 7 }, title: { color: colors.ink, fontFamily: "Georgia", fontSize: 33, lineHeight: 37 }, subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 9 }, liveStrip: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.wineSoft, padding: 10, marginTop: 17 }, liveStripText: { flex: 1, color: colors.ink, fontSize: 10, fontWeight: "700" }, simulateText: { color: colors.wine, fontSize: 10, fontWeight: "800", textDecorationLine: "underline" }, stats: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "space-between", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, paddingVertical: 15, paddingHorizontal: 8, marginTop: 12 }, stat: { flexGrow: 1, flexBasis: 93, minWidth: 93, alignItems: "center" }, statNumber: { color: colors.ink, fontFamily: "Georgia", fontSize: 16, textAlign: "center" }, statLabel: { color: colors.muted, fontSize: 9, textAlign: "center", marginTop: 4 }, tabsViewport: { flexGrow: 0, marginTop: 25, marginBottom: 18 }, tabs: { flexDirection: "row", gap: 6, paddingRight: 2 }, tab: { minWidth: 111, minHeight: 48, borderWidth: 1, borderColor: colors.line, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 }, tabActive: { backgroundColor: colors.ink, borderColor: colors.ink }, tabText: { color: colors.ink, fontSize: 11, fontWeight: "800" }, tabTextActive: { color: colors.paper }, search: { height: 45, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 9 }, searchInput: { flex: 1, color: colors.ink, fontSize: 13 }, filterRail: { gap: 8, paddingVertical: 14 }, sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 5, marginBottom: 12 }, sectionTitle: { color: colors.ink, fontFamily: "Georgia", fontSize: 22 }, muted: { color: colors.muted, fontFamily: "System", fontSize: 12 }, addButton: { backgroundColor: colors.wine, minHeight: 44, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 8 }, addText: { color: colors.paper, fontSize: 10, fontWeight: "800" }, helper: { color: colors.muted, fontSize: 10 }, filterLabel: { color: colors.ink, fontSize: 12, fontWeight: "800", marginTop: 4 }, list: { gap: 9 }, productRow: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 11, flexDirection: "row", alignItems: "center", gap: 10 }, productIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.wineSoft, alignItems: "center", justifyContent: "center" }, productInfo: { flex: 1 }, productName: { color: colors.ink, fontSize: 13, fontWeight: "800" }, productMeta: { color: colors.muted, fontSize: 10, marginTop: 3 }, productPrice: { color: colors.wine, fontSize: 12, fontWeight: "800", marginTop: 5 }, rowActions: { alignItems: "flex-end", gap: 8 }, iconAction: { width: 44, height: 44, alignItems: "center", justifyContent: "center" }, activePill: { minHeight: 44, minWidth: 64, justifyContent: "center", alignItems: "center", paddingHorizontal: 7, paddingVertical: 7 }, active: { backgroundColor: "#E2EEE4" }, inactive: { backgroundColor: colors.line }, activeText: { fontSize: 9, fontWeight: "800" }, activeTextOn: { color: colors.success }, activeTextOff: { color: colors.muted }, editPrice: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 4 }, priceInput: { width: 82, minHeight: 44, borderWidth: 1, borderColor: colors.wine, color: colors.ink, paddingHorizontal: 7, fontSize: 11 }, saveText: { color: colors.wine, fontSize: 10, fontWeight: "800" }, orderRow: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 13, flexDirection: "row", alignItems: "center", gap: 10 }, orderIcon: { width: 37, height: 37, borderRadius: 19, backgroundColor: colors.wineSoft, alignItems: "center", justifyContent: "center" }, orderInfo: { flex: 1 }, orderId: { color: colors.ink, fontSize: 13, fontWeight: "800" }, orderMeta: { color: colors.muted, fontSize: 10, marginTop: 4 }, orderPrice: { color: colors.ink, fontSize: 12, fontWeight: "800", marginTop: 6 }, orderRight: { alignItems: "flex-end", gap: 9 }, status: { backgroundColor: colors.wineSoft, paddingHorizontal: 8, paddingVertical: 5 }, statusText: { color: colors.wine, fontSize: 9, fontWeight: "800" }, statusDone: { backgroundColor: "#E2EEE4" }, statusDoneText: { color: colors.success }, overviewHero: { backgroundColor: colors.ink, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }, overviewHeroCopy: { flex: 1, paddingRight: 12 }, heroKicker: { color: colors.sand, fontSize: 9, fontWeight: "800", letterSpacing: 1.4 }, heroTitle: { color: colors.paper, fontFamily: "Georgia", fontSize: 24, lineHeight: 28, marginTop: 8 }, heroBody: { color: "#DDE3E1", fontSize: 11, lineHeight: 16, marginTop: 7 }, heroRing: { width: 66, height: 66, borderRadius: 33, borderWidth: 1, borderColor: colors.wine, backgroundColor: colors.wine, alignItems: "center", justifyContent: "center" }, heroRingLabel: { color: colors.paper, fontSize: 8, fontWeight: "800", marginTop: 3, letterSpacing: 1 }, kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 25 }, kpiCard: { flexGrow: 1, flexBasis: 132, minWidth: 132, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 12, minHeight: 92 }, kpiLabel: { color: colors.muted, fontSize: 8, fontWeight: "800", letterSpacing: 1 }, kpiValue: { color: colors.ink, fontFamily: "Georgia", fontSize: 19, marginTop: 10 }, kpiDelta: { color: colors.success, fontSize: 9, marginTop: 5 }, attentionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }, liveCaption: { color: colors.wine, fontSize: 8, fontWeight: "800", letterSpacing: 0.8 }, attentionCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 13, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 25 }, attentionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }, attentionIconWarm: { backgroundColor: colors.wineSoft }, attentionIconDone: { backgroundColor: "#E2EEE4" }, attentionCopy: { flex: 1 }, attentionTitle: { color: colors.ink, fontSize: 12, fontWeight: "800" }, attentionBody: { color: colors.muted, fontSize: 10, marginTop: 4 }, quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 11 }, quickCard: { flexGrow: 1, flexBasis: 128, minWidth: 128, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 11, minHeight: 116 }, quickCardIcon: { width: 31, height: 31, borderRadius: 16, backgroundColor: colors.wineSoft, alignItems: "center", justifyContent: "center" }, quickCardTitle: { color: colors.ink, fontSize: 11, fontWeight: "800", marginTop: 11 }, quickCardBody: { color: colors.muted, fontSize: 9, lineHeight: 13, marginTop: 4 }, reportActions: { flexDirection: "row", gap: 8, marginBottom: 12 }, exportButton: { flex: 1, minHeight: 48, backgroundColor: colors.wine, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 8 }, exportSecondary: { backgroundColor: colors.wineSoft }, exportText: { color: colors.paper, fontSize: 11, fontWeight: "800" }, exportTextSecondary: { color: colors.wine, fontSize: 11, fontWeight: "800" }, reportCards: { flexDirection: "row", gap: 9 }, reportCard: { flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 13 }, reportNumber: { color: colors.ink, fontFamily: "Georgia", fontSize: 21, marginTop: 8 }, reportLabel: { color: colors.muted, fontSize: 9, marginTop: 3 }, chartCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 15, marginTop: 12 }, chartHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }, chartEyebrow: { color: colors.wine, fontSize: 9, fontWeight: "800", letterSpacing: 1.3 }, chartTitle: { color: colors.ink, fontFamily: "Georgia", fontSize: 20, marginTop: 4 }, chartTotal: { color: colors.wine, fontSize: 12, fontWeight: "800" }, barChart: { height: 170, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 6, marginTop: 18 }, barColumn: { flex: 1, height: "100%", alignItems: "center", justifyContent: "flex-end" }, barValue: { color: colors.muted, fontSize: 8, marginBottom: 5 }, barTrack: { width: "100%", height: 105, backgroundColor: colors.wineSoft, justifyContent: "flex-end" }, barFill: { width: "100%", backgroundColor: colors.wine }, barLabel: { color: colors.muted, fontSize: 9, marginTop: 6 }, categoryChart: { gap: 13, marginTop: 18 }, categoryLine: { gap: 6 }, categoryLineHead: { flexDirection: "row", justifyContent: "space-between" }, categoryLabel: { color: colors.ink, fontSize: 11, fontWeight: "700" }, categoryValue: { color: colors.muted, fontSize: 10 }, categoryTrack: { height: 9, backgroundColor: colors.wineSoft, overflow: "hidden" }, categoryFill: { height: "100%" }, insight: { flexDirection: "row", gap: 8, alignItems: "flex-start", backgroundColor: colors.wineSoft, padding: 13, marginTop: 12 }, insightText: { flex: 1, color: colors.ink, fontSize: 11, lineHeight: 17 }, insightStrong: { fontWeight: "800" }, notice: { backgroundColor: colors.ink, padding: 12, flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16 }, noticeText: { color: colors.paper, flex: 1, fontSize: 11 }, demoNote: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: colors.wineSoft, padding: 12, marginTop: 18 }, demoText: { color: colors.ink, flex: 1, fontSize: 10, lineHeight: 15 },
});
