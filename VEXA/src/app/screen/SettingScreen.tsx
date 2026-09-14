// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   Pressable,
//   Switch,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import { AppState, Screen } from "../../types";
// import BottomNav from "../components/BottomNav";

// interface Props {
//   state: AppState;
//   onNavigate: (screen: Screen) => void;
//   onUpdate: (updates: Partial<AppState>) => void;
// }

// function Toggle({
//   value,
//   onChange,
// }: {
//   value: boolean;
//   onChange: (v: boolean) => void;
// }) {
//   return (
//     <Switch
//       value={value}
//       onValueChange={onChange}
//       trackColor={{
//         false: "#252A38",
//         true: "#7C3AED",
//       }}
//       thumbColor="#FFFFFF"
//       ios_backgroundColor="#252A38"
//     />
//   );
// }

// export default function SettingsScreen({
//   state,
//   onNavigate,
//   onUpdate,
// }: Props) {
//   const [notifications, setNotifications] = useState(state.notifications);
//   const [streaming, setStreaming] = useState(state.streamingMessages);
//   const [language, setLanguage] = useState(state.language);

//   const languages = [
//     "English",
//     "Spanish",
//     "French",
//     "German",
//     "Japanese",
//     "Chinese",
//     "Portuguese",
//     "Arabic",
//   ];

//   const [showLanguages, setShowLanguages] = useState(false);

//   const updateNotifications = (value: boolean) => {
//     setNotifications(value);
//     onUpdate({
//       notifications: value,
//     });
//   };

//   const updateStreaming = (value: boolean) => {
//     setStreaming(value);
//     onUpdate({
//       streamingMessages: value,
//     });
//   };

//   const updateLanguage = (value: string) => {
//     setLanguage(value);
//     onUpdate({
//       language: value,
//     });
//     setShowLanguages(false);
//   };

//   const handleClearHistory = () => {
//     Alert.alert(
//       "Clear Chat History",
//       "Are you sure you want to delete all conversations?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Clear",
//           style: "destructive",
//           onPress: () => {
//             onUpdate({
//               conversations: [],
//             });
//           },
//         },
//       ]
//     );
//   };

//   const handleExport = () => {
//     Alert.alert(
//       "Export Data",
//       "Your conversation data will be prepared for export."
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Top Glow */}
//       <View style={styles.topGlow} />

//       {/* Header */}
//       <View style={styles.header}>
//         <Pressable
//           onPress={() => onNavigate("profile")}
//           style={styles.backButton}
//         >
//           <Text style={styles.backIcon}>‹</Text>
//         </Pressable>

//         <Text style={styles.headerTitle}>Settings</Text>
//       </View>

//       {/* Content */}
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Appearance */}
//         <SectionTitle title="APPEARANCE" />

//         <View style={styles.card}>
//           <SettingRow
//             icon="🎨"
//             label="Theme"
//             sub="Choose your preferred theme"
//           >
//             <View style={styles.themeContainer}>
//               {["dark", "darker"].map((theme) => {
//                 const active = state.theme === theme;

//                 return (
//                   <Pressable
//                     key={theme}
//                     onPress={() =>
//                       onUpdate({
//                         theme: theme as "dark" | "darker",
//                       })
//                     }
//                     style={[
//                       styles.themeButton,
//                       active && styles.themeButtonActive,
//                     ]}
//                   >
//                     <Text
//                       style={[
//                         styles.themeText,
//                         active && styles.themeTextActive,
//                       ]}
//                     >
//                       {theme}
//                     </Text>
//                   </Pressable>
//                 );
//               })}
//             </View>
//           </SettingRow>
//         </View>

//         {/* AI Preferences */}
//         <SectionTitle title="AI PREFERENCES" />

//         <View style={styles.card}>
//           <SettingRow
//             icon="🤖"
//             label="AI Model"
//             sub={`Active: ${state.model}`}
//           >
//             <Pressable
//               onPress={() => onNavigate("model-selection")}
//               style={styles.actionButton}
//             >
//               <Text style={styles.actionButtonText}>Change</Text>
//             </Pressable>
//           </SettingRow>

//           <Divider />

//           <SettingRow
//             icon="⚡"
//             label="Streaming"
//             sub="Show AI responses as they generate"
//           >
//             <Toggle
//               value={streaming}
//               onChange={updateStreaming}
//             />
//           </SettingRow>
//         </View>

//         {/* Notifications */}
//         <SectionTitle title="NOTIFICATIONS" />

//         <View style={styles.card}>
//           <SettingRow
//             icon="🔔"
//             label="Push Notifications"
//             sub="Receive chat updates"
//           >
//             <Toggle
//               value={notifications}
//               onChange={updateNotifications}
//             />
//           </SettingRow>

//           <Divider />

//           <SettingRow
//             icon="💬"
//             label="Message Sounds"
//             sub="Play sound on new message"
//           >
//             <Toggle
//               value={false}
//               onChange={() => {}}
//             />
//           </SettingRow>
//         </View>

//         {/* Language */}
//         <SectionTitle title="LANGUAGE & REGION" />

//         <View style={styles.card}>
//           <SettingRow
//             icon="🌐"
//             label="Language"
//             sub={language}
//           >
//             <Pressable
//               onPress={() => setShowLanguages(!showLanguages)}
//               style={styles.languageButton}
//             >
//               <Text style={styles.languageButtonText}>
//                 {language}
//               </Text>

//               <Text style={styles.chevron}>
//                 {showLanguages ? "▲" : "▼"}
//               </Text>
//             </Pressable>
//           </SettingRow>

//           {showLanguages && (
//             <View style={styles.languageList}>
//               {languages.map((item) => {
//                 const active = item === language;

//                 return (
//                   <Pressable
//                     key={item}
//                     onPress={() => updateLanguage(item)}
//                     style={[
//                       styles.languageItem,
//                       active && styles.languageItemActive,
//                     ]}
//                   >
//                     <Text
//                       style={[
//                         styles.languageText,
//                         active && styles.languageTextActive,
//                       ]}
//                     >
//                       {item}
//                     </Text>

//                     {active && (
//                       <Text style={styles.check}>✓</Text>
//                     )}
//                   </Pressable>
//                 );
//               })}
//             </View>
//           )}
//         </View>

//         {/* Data & Privacy */}
//         <SectionTitle title="DATA & PRIVACY" />

//         <View style={styles.card}>
//           <SettingRow
//             icon="🗑️"
//             label="Clear Chat History"
//             sub="Delete all conversations"
//           >
//             <Pressable
//               onPress={handleClearHistory}
//               style={styles.clearButton}
//             >
//               <Text style={styles.clearButtonText}>
//                 Clear
//               </Text>
//             </Pressable>
//           </SettingRow>

//           <Divider />

//           <SettingRow
//             icon="📤"
//             label="Export Data"
//             sub="Download your conversations"
//           >
//             <Pressable
//               onPress={handleExport}
//               style={styles.actionButton}
//             >
//               <Text style={styles.actionButtonText}>
//                 Export
//               </Text>
//             </Pressable>
//           </SettingRow>
//         </View>

//         {/* Version */}
//         <View style={styles.versionContainer}>
//           <Text style={styles.version}>
//             VEXA v1.0.0 · Build 2024.001
//           </Text>
//         </View>
//       </ScrollView>

//       {/* Bottom Navigation */}
//       <BottomNav
//         active="settings"
//         onNavigate={onNavigate}
//       />
//     </View>
//   );
// }

// /* -----------------------------
//    Reusable Components
// ----------------------------- */

// function SectionTitle({ title }: { title: string }) {
//   return (
//     <Text style={styles.sectionTitle}>
//       {title}
//     </Text>
//   );
// }

// function Divider() {
//   return <View style={styles.divider} />;
// }

// function SettingRow({
//   icon,
//   label,
//   sub,
//   children,
// }: {
//   icon: string;
//   label: string;
//   sub: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <View style={styles.settingRow}>
//       <View style={styles.iconBox}>
//         <Text style={styles.icon}>
//           {icon}
//         </Text>
//       </View>

//       <View style={styles.settingInfo}>
//         <Text style={styles.settingLabel}>
//           {label}
//         </Text>

//         <Text style={styles.settingSub}>
//           {sub}
//         </Text>
//       </View>

//       <View style={styles.rightControl}>
//         {children}
//       </View>
//     </View>
//   );
// }

// /* -----------------------------
//    Styles
// ----------------------------- */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#060912",
//   },

//   topGlow: {
//     position: "absolute",
//     top: -50,
//     left: "50%",
//     width: 300,
//     height: 200,
//     marginLeft: -150,
//     borderRadius: 150,
//     backgroundColor: "rgba(124,58,237,0.08)",
//     opacity: 0.8,
//   },

//   header: {
//     height: 92,
//     paddingTop: 42,
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(124,58,237,0.1)",
//   },

//   backButton: {
//     width: 34,
//     height: 34,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   backIcon: {
//     color: "#8892B0",
//     fontSize: 34,
//     fontWeight: "300",
//     lineHeight: 30,
//   },

//   headerTitle: {
//     color: "#EEF0FF",
//     fontSize: 22,
//     fontWeight: "700",
//   },

//   scrollView: {
//     flex: 1,
//   },

//   content: {
//     paddingHorizontal: 20,
//     paddingTop: 18,
//     paddingBottom: 110,
//   },

//   sectionTitle: {
//     color: "#8892B0",
//     fontSize: 11,
//     fontWeight: "700",
//     letterSpacing: 1.2,
//     marginBottom: 10,
//     marginTop: 4,
//   },

//   card: {
//     backgroundColor: "rgba(13,18,32,0.82)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.05)",
//     borderRadius: 18,
//     overflow: "hidden",
//     marginBottom: 22,
//   },

//   settingRow: {
//     minHeight: 76,
//     paddingHorizontal: 14,
//     paddingVertical: 14,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   iconBox: {
//     width: 38,
//     height: 38,
//     borderRadius: 12,
//     backgroundColor: "rgba(124,58,237,0.08)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },

//   icon: {
//     fontSize: 18,
//   },

//   settingInfo: {
//     flex: 1,
//     paddingRight: 8,
//   },

//   settingLabel: {
//     color: "#EEF0FF",
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 3,
//   },

//   settingSub: {
//     color: "#8892B0",
//     fontSize: 12,
//     lineHeight: 17,
//   },

//   rightControl: {
//     alignItems: "flex-end",
//     justifyContent: "center",
//   },

//   divider: {
//     height: 1,
//     backgroundColor: "rgba(255,255,255,0.04)",
//     marginLeft: 64,
//   },

//   themeContainer: {
//     flexDirection: "row",
//     gap: 6,
//   },

//   themeButton: {
//     paddingHorizontal: 10,
//     paddingVertical: 7,
//     borderRadius: 10,
//     backgroundColor: "rgba(255,255,255,0.05)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },

//   themeButtonActive: {
//     backgroundColor: "rgba(124,58,237,0.25)",
//     borderColor: "rgba(124,58,237,0.5)",
//   },

//   themeText: {
//     color: "#8892B0",
//     fontSize: 11,
//     fontWeight: "500",
//     textTransform: "capitalize",
//   },

//   themeTextActive: {
//     color: "#A855F7",
//   },

//   actionButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     backgroundColor: "rgba(124,58,237,0.15)",
//     borderWidth: 1,
//     borderColor: "rgba(124,58,237,0.3)",
//   },

//   actionButtonText: {
//     color: "#A855F7",
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   clearButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     backgroundColor: "rgba(239,68,68,0.1)",
//     borderWidth: 1,
//     borderColor: "rgba(239,68,68,0.2)",
//   },

//   clearButtonText: {
//     color: "#EF4444",
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   languageButton: {
//     minWidth: 100,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 10,
//     backgroundColor: "rgba(13,18,32,0.9)",
//     borderWidth: 1,
//     borderColor: "rgba(124,58,237,0.3)",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 6,
//   },

//   languageButtonText: {
//     color: "#A855F7",
//     fontSize: 11,
//     fontWeight: "600",
//   },

//   chevron: {
//     color: "#8892B0",
//     fontSize: 8,
//   },

//   languageList: {
//     borderTopWidth: 1,
//     borderTopColor: "rgba(255,255,255,0.04)",
//     paddingVertical: 4,
//   },

//   languageItem: {
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   languageItemActive: {
//     backgroundColor: "rgba(124,58,237,0.08)",
//   },

//   languageText: {
//     color: "#8892B0",
//     fontSize: 13,
//   },

//   languageTextActive: {
//     color: "#A855F7",
//     fontWeight: "600",
//   },

//   check: {
//     color: "#A855F7",
//     fontSize: 16,
//     fontWeight: "700",
//   },

//   versionContainer: {
//     alignItems: "center",
//     paddingVertical: 10,
//   },

//   version: {
//     color: "#4A5568",
//     fontSize: 10,
//     fontFamily: "monospace",
//   },
// });


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

const THEMES = [
  {
    id: "midnight" as const,
    name: "Midnight",
    emoji: "🌑",
    description: "Classic VEXA",
    background: "#060912",
    surface: "#0D1220",
    accent: "#7C3AED",
  },
  {
    id: "obsidian" as const,
    name: "Obsidian",
    emoji: "🖤",
    description: "Pure dark",
    background: "#000000",
    surface: "#080808",
    accent: "#8B5CF6",
  },
  {
    id: "nebula" as const,
    name: "Nebula",
    emoji: "🌌",
    description: "Cosmic blue",
    background: "#050817",
    surface: "#0B1025",
    accent: "#6366F1",
  },
  {
    id: "violet" as const,
    name: "Violet",
    emoji: "💜",
    description: "Purple mode",
    background: "#0B0614",
    surface: "#160C25",
    accent: "#A855F7",
  },
];

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

  const [showLanguages, setShowLanguages] = useState(false);
  const [showThemes, setShowThemes] = useState(true);

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

  const currentTheme =
    THEMES.find((item) => item.id === state.theme) || THEMES[0];

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

  const updateTheme = (theme: AppState["theme"]) => {
    onUpdate({
      theme,
    });
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
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.background,
        },
      ]}
    >
      {/* Top Glow */}
      <View
        style={[
          styles.topGlow,
          {
            backgroundColor: `${currentTheme.accent}20`,
          },
        ]}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            borderBottomColor: `${currentTheme.accent}18`,
          },
        ]}
      >
        <Pressable
          onPress={() => onNavigate("profile")}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Customize your VEXA experience
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <SectionTitle title="APPEARANCE" />

        <View
          style={[
            styles.card,
            {
              backgroundColor: currentTheme.surface,
              borderColor: `${currentTheme.accent}18`,
            },
          ]}
        >
          <Pressable
            onPress={() => setShowThemes(!showThemes)}
            style={styles.themeHeader}
          >
            <View style={styles.themeHeaderLeft}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: `${currentTheme.accent}18`,
                  },
                ]}
              >
                <Text style={styles.icon}>🎨</Text>
              </View>

              <View>
                <Text style={styles.settingLabel}>Theme</Text>
                <Text style={styles.settingSub}>
                  {currentTheme.emoji} {currentTheme.name} ·{" "}
                  {currentTheme.description}
                </Text>
              </View>
            </View>

            <Text style={styles.chevron}>
              {showThemes ? "▲" : "▼"}
            </Text>
          </Pressable>

          {showThemes && (
            <View style={styles.themeGrid}>
              {THEMES.map((theme) => {
                const active = state.theme === theme.id;

                return (
                  <Pressable
                    key={theme.id}
                    onPress={() => updateTheme(theme.id)}
                    style={[
                      styles.themeCard,
                      {
                        backgroundColor: theme.surface,
                        borderColor: active
                          ? theme.accent
                          : "rgba(255,255,255,0.06)",
                      },
                      active && {
                        shadowColor: theme.accent,
                        shadowOpacity: 0.35,
                        shadowRadius: 10,
                        elevation: 6,
                      },
                    ]}
                  >
                    {/* Theme Preview */}
                    <View
                      style={[
                        styles.themePreview,
                        {
                          backgroundColor: theme.background,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.previewBar,
                          {
                            backgroundColor: theme.accent,
                          },
                        ]}
                      />

                      <View
                        style={[
                          styles.previewLine,
                          {
                            backgroundColor: "rgba(255,255,255,0.12)",
                          },
                        ]}
                      />

                      <View
                        style={[
                          styles.previewLineSmall,
                          {
                            backgroundColor: "rgba(255,255,255,0.08)",
                          },
                        ]}
                      />
                    </View>

                    <View style={styles.themeInfo}>
                      <Text style={styles.themeEmoji}>
                        {theme.emoji}
                      </Text>

                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.themeName,
                            active && {
                              color: theme.accent,
                            },
                          ]}
                        >
                          {theme.name}
                        </Text>

                        <Text style={styles.themeDescription}>
                          {theme.description}
                        </Text>
                      </View>

                      {active && (
                        <View
                          style={[
                            styles.selectedCircle,
                            {
                              backgroundColor: theme.accent,
                            },
                          ]}
                        >
                          <Text style={styles.selectedCheck}>✓</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* AI Preferences */}
        <SectionTitle title="AI PREFERENCES" />

        <View
          style={[
            styles.card,
            {
              backgroundColor: currentTheme.surface,
              borderColor: `${currentTheme.accent}18`,
            },
          ]}
        >
          <SettingRow
            icon="🤖"
            label="AI Model"
            sub={`Active: ${state.model}`}
            accent={currentTheme.accent}
          >
            <Pressable
              onPress={() => onNavigate("model-selection")}
              style={[
                styles.actionButton,
                {
                  backgroundColor: `${currentTheme.accent}18`,
                  borderColor: `${currentTheme.accent}35`,
                },
              ]}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  { color: currentTheme.accent },
                ]}
              >
                Change
              </Text>
            </Pressable>
          </SettingRow>

          <Divider />

          <SettingRow
            icon="⚡"
            label="Streaming"
            sub="Show AI responses as they generate"
            accent={currentTheme.accent}
          >
            <Toggle
              value={streaming}
              onChange={updateStreaming}
            />
          </SettingRow>
        </View>

        {/* Notifications */}
        <SectionTitle title="NOTIFICATIONS" />

        <View
          style={[
            styles.card,
            {
              backgroundColor: currentTheme.surface,
              borderColor: `${currentTheme.accent}18`,
            },
          ]}
        >
          <SettingRow
            icon="🔔"
            label="Push Notifications"
            sub="Receive chat updates"
            accent={currentTheme.accent}
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
            accent={currentTheme.accent}
          >
            <Toggle
              value={false}
              onChange={() => {}}
            />
          </SettingRow>
        </View>

        {/* Language */}
        <SectionTitle title="LANGUAGE & REGION" />

        <View
          style={[
            styles.card,
            {
              backgroundColor: currentTheme.surface,
              borderColor: `${currentTheme.accent}18`,
            },
          ]}
        >
          <SettingRow
            icon="🌐"
            label="Language"
            sub={language}
            accent={currentTheme.accent}
          >
            <Pressable
              onPress={() => setShowLanguages(!showLanguages)}
              style={[
                styles.languageButton,
                {
                  borderColor: `${currentTheme.accent}35`,
                },
              ]}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  { color: currentTheme.accent },
                ]}
              >
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
                      active && {
                        backgroundColor: `${currentTheme.accent}10`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        active && {
                          color: currentTheme.accent,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {item}
                    </Text>

                    {active && (
                      <Text
                        style={[
                          styles.check,
                          { color: currentTheme.accent },
                        ]}
                      >
                        ✓
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Data & Privacy */}
        <SectionTitle title="DATA & PRIVACY" />

        <View
          style={[
            styles.card,
            {
              backgroundColor: currentTheme.surface,
              borderColor: `${currentTheme.accent}18`,
            },
          ]}
        >
          <SettingRow
            icon="🗑️"
            label="Clear Chat History"
            sub="Delete all conversations"
            accent={currentTheme.accent}
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
            accent={currentTheme.accent}
          >
            <Pressable
              onPress={handleExport}
              style={[
                styles.actionButton,
                {
                  backgroundColor: `${currentTheme.accent}18`,
                  borderColor: `${currentTheme.accent}35`,
                },
              ]}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  { color: currentTheme.accent },
                ]}
              >
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

          <Text
            style={[
              styles.currentThemeText,
              { color: currentTheme.accent },
            ]}
          >
            {currentTheme.emoji} {currentTheme.name}
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
  accent,
}: {
  icon: string;
  label: string;
  sub: string;
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <View style={styles.settingRow}>
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: `${accent}12`,
          },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
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
  },

  topGlow: {
    position: "absolute",
    top: -50,
    left: "50%",
    width: 320,
    height: 220,
    marginLeft: -160,
    borderRadius: 160,
    opacity: 0.8,
  },

  header: {
    height: 100,
    paddingTop: 42,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
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

  headerSubtitle: {
    color: "#4A5568",
    fontSize: 10,
    marginTop: 2,
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
    borderWidth: 1,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 22,
  },

  themeHeader: {
    minHeight: 76,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  themeHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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

  themeGrid: {
    paddingHorizontal: 12,
    paddingBottom: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  themeCard: {
    width: "48%",
    minHeight: 125,
    borderRadius: 15,
    borderWidth: 1,
    overflow: "hidden",
  },

  themePreview: {
    height: 62,
    padding: 10,
    justifyContent: "center",
  },

  previewBar: {
    height: 7,
    width: "65%",
    borderRadius: 5,
    marginBottom: 7,
  },

  previewLine: {
    height: 5,
    width: "82%",
    borderRadius: 5,
    marginBottom: 5,
  },

  previewLineSmall: {
    height: 5,
    width: "50%",
    borderRadius: 5,
  },

  themeInfo: {
    flex: 1,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  themeEmoji: {
    fontSize: 16,
  },

  themeName: {
    color: "#EEF0FF",
    fontSize: 12,
    fontWeight: "700",
  },

  themeDescription: {
    color: "#4A5568",
    fontSize: 9,
    marginTop: 2,
  },

  selectedCircle: {
    width: 19,
    height: 19,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedCheck: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },

  actionButtonText: {
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },

  languageButtonText: {
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

  languageText: {
    color: "#8892B0",
    fontSize: 13,
  },

  check: {
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

  currentThemeText: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 5,
  },
});