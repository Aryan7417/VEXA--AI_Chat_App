
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";

import { AppState, Screen, Model } from "../../types";
import BottomNav from "../components/BottomNav";

interface Props {
  state: AppState;
  onNavigate: (screen: Screen) => void;
  onNewChat: (message: string, model: Model) => void;
}

const suggestions = [
  {
    emoji: "💡",
    text: "Explain quantum computing simply",
    color: "#7C3AED",
  },
  {
    emoji: "🐍",
    text: "Write a Python web scraper",
    color: "#6366F1",
  },
  {
    emoji: "✍️",
    text: "Write a product launch email",
    color: "#A855F7",
  },
  {
    emoji: "🎯",
    text: "Help plan my weekly goals",
    color: "#8B5CF6",
  },
];

const modelBadges: Record<
  Model,
  {
    label: string;
    color: string;
    icon: string;
  }
> = {
  fast: {
    label: "Flash",
    color: "#F59E0B",
    icon: "⚡",
  },
  smart: {
    label: "Smart",
    color: "#A855F7",
    icon: "🧠",
  },
  code: {
    label: "Code",
    color: "#10B981",
    icon: "💻",
  },
};

export default function HomeScreen({
  state,
  onNavigate,
  onNewChat,
}: Props) {
  const [message, setMessage] = useState("");

  const modelInfo = modelBadges[state.model];

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onNewChat(trimmedMessage, state.model);
    setMessage("");
  };

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <View style={styles.container}>

      {/* Top glow */}
      <View style={styles.topGlow} />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>
            {greeting}, {state.userName || "there"} 👋
          </Text>

          <Text style={styles.heading}>
            How can I help you?
          </Text>
        </View>

        <Pressable
          onPress={() => onNavigate("profile")}
          style={styles.profileButton}
        >
          <Text style={styles.profileEmoji}>🧑</Text>
        </Pressable>
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ================= VEXA CARD ================= */}
        <View style={styles.vexaCard}>

          {/* Decorative glow */}
          <View style={styles.cardGlow} />

          <View style={styles.vexaHeader}>

            <View style={styles.vexaLogo}>
              <Text style={styles.vexaLogoText}>V</Text>
            </View>

            <View>
              <Text style={styles.vexaTitle}>
                VEXA
              </Text>

              <Text style={styles.onlineText}>
                ● Online
              </Text>
            </View>

          </View>

          <Text style={styles.vexaDescription}>
            Hello, {state.userName || "there"}! I'm VEXA,
            your AI companion. Ask me anything — from
            coding help to creative writing, I'm here to assist.
          </Text>
        </View>

        {/* ================= MODEL SELECTOR ================= */}
        <View style={styles.modelRow}>

          <Text style={styles.modelLabel}>
            Model:
          </Text>

          <Pressable
            onPress={() => onNavigate("model-selection")}
            style={styles.modelButton}
          >
            <Text style={styles.modelIcon}>
              {modelInfo.icon}
            </Text>

            <Text
              style={[
                styles.modelName,
                { color: modelInfo.color },
              ]}
            >
              {modelInfo.label}
            </Text>

            <Text style={styles.arrowDown}>
              ▼
            </Text>
          </Pressable>

        </View>

        {/* ================= SUGGESTIONS ================= */}
        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            SUGGESTIONS
          </Text>

          <View style={styles.suggestionGrid}>

            {suggestions.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => setMessage(item.text)}
                style={({ pressed }) => [
                  styles.suggestionCard,
                  pressed && styles.pressed,
                  {
                    borderColor: pressed
                      ? item.color
                      : "rgba(255,255,255,0.06)",
                  },
                ]}
              >
                <Text style={styles.suggestionEmoji}>
                  {item.emoji}
                </Text>

                <Text style={styles.suggestionText}>
                  {item.text}
                </Text>
              </Pressable>
            ))}

          </View>
        </View>

        {/* ================= RECENT CHATS ================= */}
        {state.conversations.length > 0 && (
          <View style={styles.section}>

            <Text style={styles.sectionTitle}>
              RECENT
            </Text>

            {state.conversations
              .slice(0, 3)
              .map((conversation) => (
                <Pressable
                  key={conversation.id}
                  onPress={() => {
                    onNavigate("chat");
                  }}
                  style={({ pressed }) => [
                    styles.chatCard,
                    pressed && {
                      backgroundColor:
                        "rgba(124,58,237,0.08)",
                    },
                  ]}
                >

                  {/* Chat icon */}
                  <View style={styles.chatIcon}>
                    <Text style={styles.chatIconText}>
                      💬
                    </Text>
                  </View>

                  {/* Chat information */}
                  <View style={styles.chatInfo}>

                    <Text
                      style={styles.chatTitle}
                      numberOfLines={1}
                    >
                      {conversation.title}
                    </Text>

                    <Text
                      style={styles.chatPreview}
                      numberOfLines={1}
                    >
                      {conversation.preview}
                    </Text>

                  </View>

                  <Text style={styles.chatArrow}>
                    ›
                  </Text>

                </Pressable>
              ))}

          </View>
        )}

        {/* Bottom space so composer doesn't cover content */}
        <View style={{ height: 150 }} />

      </ScrollView>

      {/* ================= CHAT COMPOSER ================= */}
      <View style={styles.composerContainer}>

        <View style={styles.composerRow}>

          {/* Input container */}
          <View style={styles.inputContainer}>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Ask VEXA anything..."
              placeholderTextColor="#4A5568"
              multiline
              maxLength={2000}
              style={styles.input}
            />

            {/* Composer actions */}
            <View style={styles.actionRow}>

              {/* Attachment */}
              <Pressable
                style={styles.actionButton}
              >
                <Text style={styles.actionIcon}>
                  📎
                </Text>
              </Pressable>

              {/* Microphone */}
              <Pressable
                style={styles.actionButton}
              >
                <Text style={styles.actionIcon}>
                  🎙️
                </Text>
              </Pressable>

            </View>

          </View>

          {/* Send */}
          <Pressable
            onPress={handleSend}
            disabled={!message.trim()}
            style={({ pressed }) => [
              styles.sendButton,
              message.trim()
                ? styles.sendButtonActive
                : styles.sendButtonDisabled,
              pressed && message.trim()
                ? styles.sendPressed
                : null,
            ]}
          >
            <Text style={styles.sendIcon}>
              ➤
            </Text>
          </Pressable>

        </View>

      </View>

      {/* ================= BOTTOM NAV ================= */}
      <BottomNav
        active="home"
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

  /* ================= TOP GLOW ================= */

  topGlow: {
    position: "absolute",
    top: -100,
    left: "50%",
    width: 300,
    height: 220,
    marginLeft: -150,
    borderRadius: 150,
    backgroundColor: "rgba(124,58,237,0.12)",
  },

  /* ================= HEADER ================= */

  header: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    flex: 1,
  },

  greeting: {
    color: "#8892B0",
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 5,
  },

  heading: {
    color: "#EEF0FF",
    fontSize: 22,
    fontWeight: "700",
  },

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6D28D9",
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.35)",
  },

  profileEmoji: {
    fontSize: 20,
  },

  /* ================= SCROLL ================= */

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  /* ================= VEXA CARD ================= */

  vexaCard: {
    minHeight: 170,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    overflow: "hidden",

    backgroundColor: "rgba(40,24,80,0.65)",

    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.25)",
  },

  cardGlow: {
    position: "absolute",
    right: -40,
    top: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(124,58,237,0.12)",
  },

  vexaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  vexaLogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,

    backgroundColor: "#6D28D9",
  },

  vexaLogoText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  vexaTitle: {
    color: "#EEF0FF",
    fontSize: 14,
    fontWeight: "700",
  },

  onlineText: {
    color: "#A855F7",
    fontSize: 11,
    marginTop: 2,
  },

  vexaDescription: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 22,
  },

  /* ================= MODEL ================= */

  modelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  modelLabel: {
    color: "#8892B0",
    fontSize: 12,
    fontWeight: "500",
    marginRight: 8,
  },

  modelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,

    backgroundColor: "rgba(124,58,237,0.12)",

    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.25)",
  },

  modelIcon: {
    fontSize: 12,
    marginRight: 5,
  },

  modelName: {
    fontSize: 12,
    fontWeight: "600",
  },

  arrowDown: {
    color: "#8892B0",
    fontSize: 9,
    marginLeft: 7,
  },

  /* ================= SECTIONS ================= */

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    color: "#8892B0",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 12,
  },

  /* ================= SUGGESTIONS ================= */

  suggestionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  suggestionCard: {
    width: "48%",
    minHeight: 115,

    padding: 14,
    marginBottom: 10,

    borderRadius: 18,

    backgroundColor: "rgba(13,18,32,0.85)",

    borderWidth: 1,
  },

  suggestionEmoji: {
    fontSize: 21,
    marginBottom: 10,
  },

  suggestionText: {
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 17,
  },

  pressed: {
    transform: [{ scale: 0.97 }],
  },

  /* ================= RECENT CHATS ================= */

  chatCard: {
    flexDirection: "row",
    alignItems: "center",

    minHeight: 68,

    paddingHorizontal: 14,
    paddingVertical: 12,

    marginBottom: 8,

    borderRadius: 16,

    backgroundColor: "rgba(13,18,32,0.65)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  chatIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(124,58,237,0.15)",

    marginRight: 12,
  },

  chatIconText: {
    fontSize: 16,
  },

  chatInfo: {
    flex: 1,
    minWidth: 0,
  },

  chatTitle: {
    color: "#EEF0FF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },

  chatPreview: {
    color: "#8892B0",
    fontSize: 12,
  },

  chatArrow: {
    color: "#4A5568",
    fontSize: 28,
    fontWeight: "300",
    marginLeft: 8,
  },

  /* ================= COMPOSER ================= */

  composerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 65,

    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 10,

    backgroundColor: "#060912",
  },

  composerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  inputContainer: {
    flex: 1,

    minHeight: 58,

    borderRadius: 22,

    backgroundColor: "rgba(13,18,32,0.95)",

    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.25)",

    overflow: "hidden",

    marginRight: 8,
  },

  input: {
    minHeight: 42,
    maxHeight: 90,

    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,

    color: "#EEF0FF",

    fontSize: 14,
    lineHeight: 20,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
    paddingBottom: 5,
  },

  actionButton: {
    width: 32,
    height: 28,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 2,
  },

  actionIcon: {
    fontSize: 17,
    opacity: 0.65,
  },

  /* ================= SEND BUTTON ================= */

  sendButton: {
    width: 50,
    height: 50,

    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonActive: {
    backgroundColor: "#6D28D9",
  },

  sendButtonDisabled: {
    backgroundColor: "rgba(124,58,237,0.2)",
  },

  sendPressed: {
    transform: [{ scale: 0.94 }],
  },

  sendIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

});

