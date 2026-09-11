import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Model, Screen } from "../../types";
import BottomNav from "../components/BottomNav";

interface Props {
  currentModel: Model;
  onSelect: (model: Model) => void;
  onNavigate: (screen: Screen) => void;
  prevScreen: Screen | null;
}

const models = [
  {
    id: "fast" as Model,
    name: "Flash",
    tagline: "Fast & Efficient",
    description:
      "Optimized for speed and everyday tasks. Perfect for quick questions, summaries, and casual conversation.",
    icon: "⚡",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    specs: [
      "~0.5s response",
      "Best for: Quick tasks",
      "Efficiency focused",
      "Low latency",
    ],
  },
  {
    id: "smart" as Model,
    name: "Smart",
    tagline: "Intelligent & Thorough",
    description:
      "Advanced reasoning and deep analysis. Ideal for complex questions, research, writing, and creative tasks.",
    icon: "🧠",
    color: "#A855F7",
    bg: "rgba(168,85,247,0.1)",
    border: "rgba(168,85,247,0.3)",
    specs: [
      "~2s response",
      "Best for: Deep reasoning",
      "High accuracy",
      "Nuanced responses",
    ],
    recommended: true,
  },
  {
    id: "code" as Model,
    name: "Code",
    tagline: "Developer's Companion",
    description:
      "Specialized for programming, debugging, code review, and technical documentation across all languages.",
    icon: "💻",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
    specs: [
      "~1.5s response",
      "Best for: Coding",
      "All languages",
      "Debug & review",
    ],
  },
];

export default function ModelSelectionScreen({
  currentModel,
  onSelect,
  onNavigate,
  prevScreen,
}: Props) {
  const handleBack = () => {
    onNavigate(prevScreen || "home");
  };

  const handleSelect = (model: Model) => {
    onSelect(model);
    onNavigate(prevScreen || "home");
  };

  return (
    <View style={styles.container}>
      {/* Top Glow */}
      <View style={styles.glow} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <View>
          <Text style={styles.headerTitle}>Select AI Model</Text>

          <Text style={styles.headerSubtitle}>
            Choose the right model for your task
          </Text>
        </View>
      </View>

      {/* Models */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {models.map((model) => {
          const isActive = currentModel === model.id;

          return (
            <Pressable
              key={model.id}
              onPress={() => handleSelect(model.id)}
              style={[
                styles.modelCard,
                {
                  backgroundColor: isActive
                    ? model.bg
                    : "rgba(13,18,32,0.7)",

                  borderColor: isActive
                    ? model.border
                    : "rgba(255,255,255,0.07)",

                  shadowColor: isActive ? model.color : "transparent",

                  transform: [
                    {
                      scale: isActive ? 1.01 : 1,
                    },
                  ],
                },
              ]}
            >
              {/* Recommended */}
              {model.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>
                    RECOMMENDED
                  </Text>
                </View>
              )}

              {/* Icon + Name */}
              <View style={styles.modelHeader}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: model.bg,
                      borderColor: model.border,
                    },
                  ]}
                >
                  <Text style={styles.modelIcon}>
                    {model.icon}
                  </Text>
                </View>

                <View style={styles.modelInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.modelName}>
                      {model.name}
                    </Text>

                    {isActive && (
                      <View
                        style={[
                          styles.activeBadge,
                          {
                            backgroundColor: `${model.color}20`,
                            borderColor: `${model.color}40`,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.activeDot,
                            {
                              backgroundColor: model.color,
                            },
                          ]}
                        />

                        <Text
                          style={[
                            styles.activeText,
                            {
                              color: model.color,
                            },
                          ]}
                        >
                          ACTIVE
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.tagline,
                      {
                        color: model.color,
                      },
                    ]}
                  >
                    {model.tagline}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.description}>
                {model.description}
              </Text>

              {/* Specs */}
              <View style={styles.specGrid}>
                {model.specs.map((spec) => (
                  <View key={spec} style={styles.specItem}>
                    <View
                      style={[
                        styles.specDot,
                        {
                          backgroundColor: model.color,
                        },
                      ]}
                    />

                    <Text style={styles.specText}>
                      {spec}
                    </Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}

        {/* Note */}
        <View style={styles.note}>
          <Text style={styles.noteText}>
            💡 You can switch models anytime. The selected model
            applies to all new conversations.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav
        active="settings"
        onNavigate={onNavigate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#060912",
  },

  glow: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -150,
    width: 300,
    height: 200,
    backgroundColor: "rgba(124,58,237,0.12)",
    borderRadius: 150,
    opacity: 0.7,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124,58,237,0.1)",
  },

  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  backIcon: {
    color: "#8892B0",
    fontSize: 34,
    fontWeight: "300",
    lineHeight: 34,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#EEF0FF",
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#8892B0",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },

  modelCard: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 20,
    marginBottom: 16,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 4,
  },

  recommendedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(168,85,247,0.2)",
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.4)",
  },

  recommendedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#A855F7",
    letterSpacing: 0.5,
  },

  modelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingRight: 90,
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  modelIcon: {
    fontSize: 24,
  },

  modelInfo: {
    flex: 1,
    marginLeft: 12,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  modelName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EEF0FF",
  },

  tagline: {
    fontSize: 12,
    marginTop: 3,
  },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },

  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  activeText: {
    fontSize: 9,
    fontWeight: "700",
  },

  description: {
    fontSize: 13,
    color: "#8892B0",
    lineHeight: 21,
    marginBottom: 16,
  },

  specGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  specItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
  },

  specDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 7,
  },

  specText: {
    flex: 1,
    fontSize: 11,
    color: "#8892B0",
  },

  note: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(124,58,237,0.06)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.15)",
  },

  noteText: {
    fontSize: 12,
    color: "#8892B0",
    lineHeight: 19,
  },
});