import { StyleSheet } from "react-native";
import { DS } from "../../constants/ds";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.bg },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 8, paddingBottom: 16 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 9 },
  headerTitle: { fontSize: 16, fontWeight: "600", color: DS.text1, letterSpacing: -0.3 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  notifBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: DS.surface2, borderWidth: 1, borderColor: DS.border2, alignItems: "center", justifyContent: "center", overflow: "visible" },
  notifEmoji: { fontSize: 14 },
  notifBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
<<<<<<< HEAD
    backgroundColor: DS.accent,
=======
    backgroundColor: DS.text1,
>>>>>>> 7d11747ab31ea83a11d599a14b4ffdf79b2adc6c
    borderWidth: 1.5,
    borderColor: DS.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadgeText: { fontSize: 9, fontWeight: "700", color: "#0A0A0A", lineHeight: 11 },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: DS.surface2, borderWidth: 1, borderColor: DS.border2, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 11, fontWeight: "600", color: DS.text1, letterSpacing: -0.3 },

  titleSection: { paddingHorizontal: 22, paddingBottom: 16 },
  pageTitle: { fontSize: 26, fontWeight: "600", color: DS.text1, letterSpacing: -0.8 },
  pageSubtitle: { fontSize: 13, color: DS.text2, marginTop: 4, letterSpacing: -0.15 },

  scroll: { paddingBottom: 120 },
  scrollEmpty: { flexGrow: 1 },

  listCard: { marginHorizontal: 16 },
  cardCell: { marginHorizontal: 16, backgroundColor: DS.surface2, borderLeftWidth: 1, borderRightWidth: 1, borderColor: DS.border },
  cardFirst: { borderTopWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  cardLast: { borderBottomWidth: 1, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  loadingMore: { paddingVertical: 16, alignItems: "center" },

  orgRow: { flexDirection: "row", alignItems: "center", padding: 14, paddingHorizontal: 16, gap: 13 },
  orgRowBorder: { borderBottomWidth: 1, borderBottomColor: DS.border },
  orgAvatar: { width: 36, height: 36, borderRadius: 8, backgroundColor: DS.surface3, borderWidth: 1, borderColor: DS.border, alignItems: "center", justifyContent: "center" },
  orgAvatarText: { fontSize: 13, fontWeight: "600", color: DS.text2, letterSpacing: -0.3 },
  orgInfo: { flex: 1, gap: 4 },
  orgName: { fontSize: 14, fontWeight: "500", color: DS.text1, letterSpacing: -0.15 },
  orgMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  memberCount: { fontSize: 11, color: DS.text3 },

  roleTag: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6, backgroundColor: DS.surface3, borderWidth: 1, borderColor: DS.border },
  roleDot: { width: 5, height: 5, borderRadius: 3 },
  roleTagText: { fontSize: 11, fontWeight: "600", color: DS.text1, letterSpacing: -0.1 },

  chevron: { width: 6, height: 10, justifyContent: "center", alignItems: "center" },
  chevronLine1: { position: "absolute", width: 1.3, height: 6, backgroundColor: DS.text4, borderRadius: 1, top: 0, right: 0, transform: [{ rotate: "45deg" }, { translateY: 1 }] },
  chevronLine2: { position: "absolute", width: 1.3, height: 6, backgroundColor: DS.text4, borderRadius: 1, bottom: 0, right: 0, transform: [{ rotate: "-45deg" }, { translateY: -1 }] },

  centred: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 8 },
  errorText: { fontSize: 14, color: DS.red, textAlign: "center" },
  retryBtn: { marginTop: 4 },
  retryLabel: { fontSize: 13, color: DS.text2, textDecorationLine: "underline" },
  emptyText: { fontSize: 15, color: DS.text2, fontWeight: "500" },
  emptyHint: { fontSize: 13, color: DS.text3 },

  fab: { position: "absolute", right: 16, flexDirection: "row", alignItems: "center", gap: 7, height: 36, paddingHorizontal: 14, borderRadius: 6, backgroundColor: DS.text1, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 8 },
  fabPlus: { fontSize: 16, fontWeight: "400", color: "#0A0A0A", lineHeight: 18 },
  fabLabel: { fontSize: 13, fontWeight: "500", color: "#0A0A0A", letterSpacing: -0.1 },

  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheetWrapper: { justifyContent: "flex-end" },
  sheet: { backgroundColor: DS.bg, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderWidth: 1, borderBottomWidth: 0, borderColor: DS.border2, padding: 24, paddingTop: 12 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: DS.border2, alignSelf: "center", marginBottom: 22 },
  sheetTitle: { fontSize: 20, fontWeight: "600", color: DS.text1, letterSpacing: -0.6 },
  sheetSubtitle: { fontSize: 13, color: DS.text2, marginTop: 5, marginBottom: 24, letterSpacing: -0.15 },
  slugRow: { marginBottom: 16, gap: 6 },
  slugLabel: { fontSize: 13, fontWeight: "500", color: DS.text1, letterSpacing: -0.1 },
  slugValue: { height: 36, borderRadius: 6, borderWidth: 1, borderColor: DS.border, paddingHorizontal: 12, fontSize: 14, color: DS.text3, letterSpacing: -0.1, textAlignVertical: "center", lineHeight: 36 },
  sheetError: { fontSize: 13, color: DS.red, fontWeight: "500", marginBottom: 12 },
  sheetActions: { flexDirection: "row", marginTop: 8 },
});
