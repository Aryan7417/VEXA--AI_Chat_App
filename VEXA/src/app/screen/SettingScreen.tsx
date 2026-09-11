import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  StyleSheet,
  Alert,
} from "react-native";
import { AppState, Screen } from "../../types";
import BottomNav from "../components/BottomNav";

interface Props {
  state: AppState;
  onNavigate: (screen: Screen) => void;
  onUpdate: (updates: Partial<AppState>) => void;
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{
        false: "#252A38",
        true: "#7C3AED",
      }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="#252A38"
    />
  );
}

export default function SettingsScreen({
  state,
  onNavigate,
  onUpdate,
}: Props) {
  const [notifications, setNotifications] = useState(state.notifications);
  const [streaming, setStreaming] = useState(state.streamingMessages);
  const [language, setLanguage] = useState(state.language);

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Chinese",
    "Portuguese",
    "Arabic",
  ];

  const [showLanguages, setShowLanguages] = useState(false);

  const updateNotifications = (value: boolean) => {
    setNotifications(value);
    onUpdate({
      notifications: value,
    });
  };

  const updateStreaming = (value: boolean) => {
    setStreaming(value);
    onUpdate({
      streamingMessages: value,
    });
  };

  const updateLanguage = (value: string) => {
    setLanguage(value);
    onUpdate({
      language: value,
    });
    setShowLanguages(false);
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to delete all conversations?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            onUpdate({
              conversations: [],
            });
          },
        },
      ]
    );
  };

  const handleExport = () => {
    Alert.alert(
      "Export Data",
      "Your conversation data will be prepared for export."
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Glow */}
      <View style={styles.topGlow} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => onNavigate("profile")}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <SectionTitle title="APPEARANCE" />

        <View style={styles.card}>
          <SettingRow
            icon="🎨"
            label="Theme"
            sub="Choose your preferred theme"
          >
            <View style={styles.themeContainer}>
              {["dark", "darker"].map((theme) => {
                const active = state.theme === theme;

                return (
                  <Pressable
                    key={theme}
                    onPress={() =>
                      onUpdate({
                        theme: theme as "dark" | "darker",
                      })
                    }
                    style={[
                      styles.themeButton,
                      active && styles.themeButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.themeText,
                        active && styles.themeTextActive,
                      ]}
                    >
                      {theme}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SettingRow>
        </View>

        {/* AI Preferences */}
        <SectionTitle title="AI PREFERENCES" />

        <View style={styles.card}>
          <SettingRow
            icon="🤖"
            label="AI Model"
            sub={`Active: ${state.model}`}
          >
            <Pressable
              onPress={() => onNavigate("model-selection")}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Change</Text>
            </Pressable>
          </SettingRow>

          <Divider />

          <SettingRow
            icon="⚡"
            label="Streaming"
            sub="Show AI responses as they generate"
          >
            <Toggle
              value={streaming}
              onChange={updateStreaming}
            />
          </SettingRow>
        </View>

        {/* Notifications */}
        <SectionTitle title="NOTIFICATIONS" />

        <View style={styles.card}>
          <SettingRow
            icon="🔔"
            label="Push Notifications"
            sub="Receive chat updates"
          >
            <Toggle
              value={notifications}
              onChange={updateNotifications}
            />
          </SettingRow>

          <Divider />

          <SettingRow
            icon="💬"
            label="Message Sounds"
            sub="Play sound on new message"
          >
            <Toggle
              value={false}
              onChange={() => {}}
            />
          </SettingRow>
        </View>

        {/* Language */}
        <SectionTitle title="LANGUAGE & REGION" />

        <View style={styles.card}>
          <SettingRow
            icon="🌐"
            label="Language"
            sub={language}
          >
            <Pressable
              onPress={() => setShowLanguages(!showLanguages)}
              style={styles.languageButton}
            >
              <Text style={styles.languageButtonText}>
                {language}
              </Text>

              <Text style={styles.chevron}>
                {showLanguages ? "▲" : "▼"}
              </Text>
            </Pressable>
          </SettingRow>

          {showLanguages && (
            <View style={styles.languageList}>
              {languages.map((item) => {
                const active = item === language;

                return (
                  <Pressable
                    key={item}
                    onPress={() => updateLanguage(item)}
                    style={[
                      styles.languageItem,
                      active && styles.languageItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        active && styles.languageTextActive,
                      ]}
                    >
                      {item}
                    </Text>

                    {active && (
                      <Text style={styles.check}>✓</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Data & Privacy */}
        <SectionTitle title="DATA & PRIVACY" />

        <View style={styles.card}>
          <SettingRow
            icon="🗑️"
            label="Clear Chat History"
            sub="Delete all conversations"
          >
            <Pressable
              onPress={handleClearHistory}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>
                Clear
              </Text>
            </Pressable>
          </SettingRow>

          <Divider />

          <SettingRow
            icon="📤"
            label="Export Data"
            sub="Download your conversations"
          >
            <Pressable
              onPress={handleExport}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>
                Export
              </Text>
            </Pressable>
          </SettingRow>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.version}>
            VEXA v1.0.0 · Build 2024.001
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav
        active="settings"
        onNavigate={onNavigate}
      />
    </View>
  );
}

/* -----------------------------
   Reusable Components
----------------------------- */

function SectionTitle({ title }: { title: string }) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function SettingRow({
  icon,
  label,
  sub,
  children,
}: {
  icon: string;
  label: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>
          {icon}
        </Text>
      </View>

      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>
          {label}
        </Text>

        <Text style={styles.settingSub}>
          {sub}
        </Text>
      </View>

      <View style={styles.rightControl}>
        {children}
      </View>
    </View>
  );
}

/* -----------------------------
   Styles
----------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060912",
  },

  topGlow: {
    position: "absolute",
    top: -50,
    left: "50%",
    width: 300,
    height: 200,
    marginLeft: -150,
    borderRadius: 150,
    backgroundColor: "rgba(124,58,237,0.08)",
    opacity: 0.8,
  },

  header: {
    height: 92,
    paddingTop: 42,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124,58,237,0.1)",
  },

  backButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  backIcon: {
    color: "#8892B0",
    fontSize: 34,
    fontWeight: "300",
    lineHeight: 30,
  },

  headerTitle: {
    color: "#EEF0FF",
    fontSize: 22,
    fontWeight: "700",
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 110,
  },

  sectionTitle: {
    color: "#8892B0",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 4,
  },

  card: {
    backgroundColor: "rgba(13,18,32,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 22,
  },

  settingRow: {
    minHeight: 76,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(124,58,237,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  icon: {
    fontSize: 18,
  },

  settingInfo: {
    flex: 1,
    paddingRight: 8,
  },

  settingLabel: {
    color: "#EEF0FF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 3,
  },

  settingSub: {
    color: "#8892B0",
    fontSize: 12,
    lineHeight: 17,
  },

  rightControl: {
    alignItems: "flex-end",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginLeft: 64,
  },

  themeContainer: {
    flexDirection: "row",
    gap: 6,
  },

  themeButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  themeButtonActive: {
    backgroundColor: "rgba(124,58,237,0.25)",
    borderColor: "rgba(124,58,237,0.5)",
  },

  themeText: {
    color: "#8892B0",
    fontSize: 11,
    fontWeight: "500",
    textTransform: "capitalize",
  },

  themeTextActive: {
    color: "#A855F7",
  },

  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(124,58,237,0.15)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.3)",
  },

  actionButtonText: {
    color: "#A855F7",
    fontSize: 12,
    fontWeight: "700",
  },

  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
  },

  clearButtonText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "700",
  },

  languageButton: {
    minWidth: 100,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(13,18,32,0.9)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },

  languageButtonText: {
    color: "#A855F7",
    fontSize: 11,
    fontWeight: "600",
  },

  chevron: {
    color: "#8892B0",
    fontSize: 8,
  },

  languageList: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.04)",
    paddingVertical: 4,
  },

  languageItem: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  languageItemActive: {
    backgroundColor: "rgba(124,58,237,0.08)",
  },

  languageText: {
    color: "#8892B0",
    fontSize: 13,
  },

  languageTextActive: {
    color: "#A855F7",
    fontWeight: "600",
  },

  check: {
    color: "#A855F7",
    fontSize: 16,
    fontWeight: "700",
  },

  versionContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },

  version: {
    color: "#4A5568",
    fontSize: 10,
    fontFamily: "monospace",
  },
});
