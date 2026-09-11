import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";

import { AppState, Conversation, Screen } from "../../types";
import BottomNav from "../components/BottomNav";

interface Props {
  state: AppState;
  onNavigate: (screen: Screen) => void;
  onOpenChat: (convId: string) => void;
  onDeleteChat: (convId: string) => void;
  onRenameChat: (convId: string, name: string) => void;
}

const modelColors: Record<string, string> = {
  fast: "#F59E0B",
  smart: "#A855F7",
  code: "#10B981",
};

const modelIcons: Record<string, string> = {
  fast: "⚡",
  smart: "🧠",
  code: "💻",
};

export default function ChatsScreen({
  state,
  onNavigate,
  onOpenChat,
  onDeleteChat,
  onRenameChat,
}: Props) {
  const [search, setSearch] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return state.conversations;
    }

    return state.conversations.filter(
      (conversation) =>
        conversation.title.toLowerCase().includes(query) ||
        conversation.preview.toLowerCase().includes(query)
    );
  }, [search, state.conversations]);

  // const formatDate = (date: string | number | Date) => {
  //   const messageDate = new Date(date)
  //   const now = new Date()

  //   if (isNaN(messageDate.getTime())) {
  //     return ""
  //   }

  //   const diff = Math.max(0, now.getTime() - messageDate.getTime())

  //   if (diff < 60_000) {
  //     return "Just now"
  //   }

  //   if (diff < 3_600_000) {
  //     return `${Math.floor(diff / 60_000)}m ago`
  //   }

  //   if (diff < 86_400_000) {
  //     return `${Math.floor(diff / 3_600_000)}h ago`
  //   }

  //   if (diff < 604_800_000) {
  //     return `${Math.floor(diff / 86_400_000)}d ago`
  //   }

  //   return messageDate.toLocaleDateString("en-IN", {
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric",
  //   })
  // }


  const formatDate = (date: string | number | Date) => {
    let messageDate: Date

    if (typeof date === "number") {
      messageDate = new Date(date < 10_000_000_000 ? date * 1000 : date)
    } else {
      messageDate = new Date(date)
    }

    const now = new Date()

    if (isNaN(messageDate.getTime())) {
      return ""
    }

    const diff = Math.max(0, now.getTime() - messageDate.getTime())

    if (diff < 60_000) return "Just now"
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`

    return messageDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }


  const openChat = (conversation: Conversation) => {
    setMenuId(null);
    onOpenChat(conversation.id);
    onNavigate("chat");
  };

  const startRename = (conversation: Conversation) => {
    setRenameId(conversation.id);
    setRenameValue(conversation.title);
    setMenuId(null);
  };

  const saveRename = () => {
    if (!renameId) return;

    const name = renameValue.trim();

    if (!name) return;

    onRenameChat(renameId, name);
    setRenameId(null);
    setRenameValue("");
  };

  const deleteChat = (conversation: Conversation) => {
    onDeleteChat(conversation.id);
    setMenuId(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Conversations</Text>

          <TouchableOpacity
            style={styles.newButton}
            onPress={() => onNavigate("home")}
            activeOpacity={0.8}
          >
            <Text style={styles.plus}>+</Text>
            <Text style={styles.newText}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search conversations..."
            placeholderTextColor="#4A5568"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Conversation list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>💬</Text>
            </View>

            <Text style={styles.emptyText}>
              {search ? "No results found" : "No conversations yet"}
            </Text>

            {!search && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => onNavigate("home")}
              >
                <Text style={styles.emptyButtonText}>Start a conversation</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtered.map((conversation) => (
            <View key={conversation.id} style={styles.conversationWrapper}>
              {/* Conversation card */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => openChat(conversation)}
                style={[
                  styles.conversationCard,
                  menuId === conversation.id && styles.conversationActive,
                ]}
              >
                {/* Model icon */}
                <View style={styles.modelIconContainer}>
                  <Text style={styles.modelIcon}>
                    {modelIcons[conversation.model] || "🧠"}
                  </Text>
                </View>

                {/* Content */}
                <View style={styles.conversationContent}>
                  <View style={styles.titleRow}>
                    <Text
                      style={styles.conversationTitle}
                      numberOfLines={1}
                    >
                      {conversation.title}
                    </Text>

                    <Text style={styles.timestamp}>
                      {formatDate(conversation.timestamp)}
                    </Text>
                  </View>

                  <View style={styles.previewRow}>
                    <View
                      style={[
                        styles.modelBadge,
                        {
                          backgroundColor:
                            `${modelColors[conversation.model] || "#A855F7"}18`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.modelBadgeText,
                          {
                            color:
                              modelColors[conversation.model] || "#A855F7",
                          },
                        ]}
                      >
                        {conversation.model}
                      </Text>
                    </View>

                    <Text
                      style={styles.preview}
                      numberOfLines={1}
                    >
                      {conversation.preview}
                    </Text>
                  </View>
                </View>

                {/* Menu */}
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() =>
                    setMenuId(
                      menuId === conversation.id
                        ? null
                        : conversation.id
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuDots}>•••</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Context menu */}
              {menuId === conversation.id && (
                <View style={styles.contextMenu}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => startRename(conversation)}
                  >
                    <Text style={styles.menuItemIcon}>✎</Text>
                    <Text style={styles.menuItemText}>Rename</Text>
                  </TouchableOpacity>

                  <View style={styles.menuDivider} />

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => deleteChat(conversation)}
                  >
                    <Text style={styles.deleteIcon}>⌫</Text>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Tap outside context menu */}
      {menuId && (
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuId(null)}
        />
      )}

      {/* Rename modal */}
      <Modal
        visible={renameId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameId(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setRenameId(null)}
        >
          <Pressable
            style={styles.renameModal}
            onPress={(event) => event.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Rename Chat</Text>

            <TextInput
              value={renameValue}
              onChangeText={setRenameValue}
              placeholder="Chat name"
              placeholderTextColor="#4A5568"
              style={styles.renameInput}
              autoFocus
              selectTextOnFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setRenameId(null);
                  setRenameValue("");
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !renameValue.trim() && styles.saveButtonDisabled,
                ]}
                disabled={!renameValue.trim()}
                onPress={saveRename}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNav
        active="chats"
        onNavigate={onNavigate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060912",
  },

  /* Header */

  header: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 14,
    backgroundColor: "rgba(6,9,18,0.98)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124,58,237,0.1)",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  heading: {
    color: "#EEF0FF",
    fontSize: 22,
    fontWeight: "700",
  },

  newButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#7C3AED",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },

  plus: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "600",
  },

  newText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  /* Search */

  searchContainer: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(13,18,32,0.8)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.2)",
    borderRadius: 16,
    paddingHorizontal: 12,
  },

  searchIcon: {
    color: "#4A5568",
    fontSize: 24,
    marginRight: 7,
  },

  searchInput: {
    flex: 1,
    color: "#EEF0FF",
    fontSize: 14,
  },

  /* List */

  list: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },

  conversationWrapper: {
    position: "relative",
    zIndex: 10,
  },

  conversationCard: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 8,
    borderRadius: 18,
    backgroundColor: "rgba(13,18,32,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  conversationActive: {
    borderColor: "rgba(124,58,237,0.3)",
    backgroundColor: "rgba(124,58,237,0.08)",
  },

  modelIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,58,237,0.12)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.2)",
    marginRight: 12,
  },

  modelIcon: {
    fontSize: 18,
  },

  conversationContent: {
    flex: 1,
    minWidth: 0,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },

  conversationTitle: {
    flex: 1,
    color: "#EEF0FF",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 8,
  },

  timestamp: {
    color: "#4A5568",
    fontSize: 10,
  },

  previewRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  modelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 7,
  },

  modelBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  preview: {
    flex: 1,
    color: "#8892B0",
    fontSize: 12,
  },

  menuButton: {
    paddingLeft: 8,
    paddingVertical: 10,
  },

  menuDots: {
    color: "#4A5568",
    fontSize: 13,
    letterSpacing: 1,
  },

  /* Context menu */

  contextMenu: {
    position: "absolute",
    right: 8,
    top: 65,
    width: 155,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#0D1220",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.3)",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
    zIndex: 100,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 13,
  },

  menuItemIcon: {
    width: 24,
    color: "#A855F7",
    fontSize: 18,
  },

  menuItemText: {
    color: "#EEF0FF",
    fontSize: 13,
    fontWeight: "600",
  },

  menuDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  deleteIcon: {
    width: 24,
    color: "#EF4444",
    fontSize: 18,
  },

  deleteText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
  },

  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },

  /* Empty */

  emptyContainer: {
    flex: 1,
    minHeight: 450,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,58,237,0.08)",
    marginBottom: 15,
  },

  emptyIconText: {
    fontSize: 26,
    opacity: 0.6,
  },

  emptyText: {
    color: "#4A5568",
    fontSize: 14,
    marginBottom: 18,
  },

  emptyButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(124,58,237,0.15)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.25)",
  },

  emptyButtonText: {
    color: "#A855F7",
    fontSize: 12,
    fontWeight: "600",
  },

  /* Rename modal */

  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.72)",
  },

  renameModal: {
    width: "100%",
    padding: 22,
    borderRadius: 24,
    backgroundColor: "#0D1220",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.3)",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 15,
  },

  modalTitle: {
    color: "#EEF0FF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  renameInput: {
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 15,
    color: "#EEF0FF",
    backgroundColor: "#060912",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.3)",
    fontSize: 15,
    marginBottom: 16,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "rgba(124,58,237,0.1)",
  },

  cancelText: {
    color: "#8892B0",
    fontSize: 14,
    fontWeight: "600",
  },

  saveButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#7C3AED",
  },

  saveButtonDisabled: {
    opacity: 0.4,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});