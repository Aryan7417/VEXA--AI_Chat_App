
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AppState, Screen } from "../../types";
import BottomNav from "../components/BottomNav";

interface Props {
  state: AppState;
  onNavigate: (screen: Screen) => void;
  onOpenChat: (id: string) => void;
}

export default function SearchScreen({
  state,
  onNavigate,
  onOpenChat,
}: Props) {
  const [query, setQuery] = useState("");

  const allMessages = state.conversations.flatMap((conv) =>
    conv.messages.map((msg) => ({
      ...msg,
      convTitle: conv.title,
      convId: conv.id,
    }))
  );

  const results =
    query.trim().length > 1
      ? allMessages.filter((m) =>
        m.content.toLowerCase().includes(query.toLowerCase())
      )
      : [];

  const highlight = (text: string, q: string) => {
    if (!q) return text;

    const idx = text.toLowerCase().indexOf(q.toLowerCase());

    if (idx === -1) {
      return {
        before: "",
        match: "",
        after: text.slice(0, 80) + (text.length > 80 ? "..." : ""),
      };
    }

    const start = Math.max(0, idx - 30);
    const end = Math.min(text.length, idx + q.length + 50);

    const before =
      (start > 0 ? "..." : "") + text.slice(start, idx);

    const match = text.slice(idx, idx + q.length);

    const after =
      text.slice(idx + q.length, end) +
      (end < text.length ? "..." : "");

    return {
      before,
      match,
      after,
    };
  };

  const recentTopics = [
    "Python",
    "React hooks",
    "Machine learning",
    "Writing tips",
    "SQL queries",
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>

        {/* Search Box */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search messages, conversations..."
            placeholderTextColor="#4A5568"
            style={styles.searchInput}
          />

          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery("")}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>×</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* No Query */}
        {!query && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionLabel}>
              RECENT TOPICS
            </Text>

            <View style={styles.topicContainer}>
              {recentTopics.map((topic) => (
                <Pressable
                  key={topic}
                  onPress={() => setQuery(topic)}
                  style={({ pressed }) => [
                    styles.topicButton,
                    pressed && styles.topicButtonPressed,
                  ]}
                >
                  <Text style={styles.topicText}>{topic}</Text>
                </Pressable>
              ))}
            </View>

            {state.conversations.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>⌕</Text>

                <Text style={styles.emptyText}>
                  Start some conversations to search through them
                </Text>
              </View>
            )}
          </View>
        )}

        {/* No Results */}
        {query && results.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>⌕</Text>

            <Text style={styles.noResultsText}>
              No results for "{query}"
            </Text>
          </View>
        )}

        {/* Results */}
        {results.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionLabel}>
              {results.length} RESULT
              {results.length !== 1 ? "S" : ""}
            </Text>

            {results.map((result) => {
              const h = highlight(result.content, query);

              return (
                <Pressable
                  key={result.id}
                  onPress={() => {
                    onOpenChat(result.convId);
                    onNavigate("chat");
                  }}
                  style={({ pressed }) => [
                    styles.resultCard,
                    pressed && styles.resultCardPressed,
                  ]}
                >
                  {/* Result Header */}
                  <View style={styles.resultHeader}>
                    <View
                      style={[
                        styles.roleBadge,
                        {
                          backgroundColor:
                            result.role === "user"
                              ? "rgba(124,58,237,0.2)"
                              : "rgba(99,102,241,0.2)",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          {
                            color:
                              result.role === "user"
                                ? "#A855F7"
                                : "#818CF8",
                          },
                        ]}
                      >
                        {result.role === "user"
                          ? "You"
                          : "VEXA"}
                      </Text>
                    </View>

                    <Text style={styles.inText}>in</Text>

                    <Text
                      numberOfLines={1}
                      style={styles.conversationTitle}
                    >
                      {result.convTitle}
                    </Text>
                  </View>

                  {/* Message */}
                  <Text style={styles.messageText}>
                    {typeof h === "string" ? (
                      h
                    ) : (
                      <>
                        <Text>{h.before}</Text>

                        <Text style={styles.highlight}>
                          {h.match}
                        </Text>

                        <Text>{h.after}</Text>
                      </>
                    )}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav
        active="search"
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

  header: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124,58,237,0.1)",
  },

  title: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: "700",
    color: "#EEF0FF",
  },

  searchWrapper: {
    height: 52,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(13,18,32,0.9)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.25)",
    borderRadius: 16,
    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  searchIcon: {
    marginLeft: 14,
    marginRight: 8,
    fontSize: 25,
    color: "#8892B0",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 4,
    color: "#EEF0FF",
    fontSize: 15,
  },

  clearButton: {
    width: 36,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },

  clearText: {
    fontSize: 25,
    color: "#4A5568",
    fontWeight: "300",
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  recentSection: {
    paddingTop: 24,
  },

  sectionLabel: {
    marginBottom: 14,
    fontSize: 12,
    fontWeight: "600",
    color: "#8892B0",
    letterSpacing: 0.7,
  },

  topicContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  topicButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: "rgba(124,58,237,0.1)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.2)",
  },

  topicButtonPressed: {
    backgroundColor: "rgba(124,58,237,0.2)",
  },

  topicText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#A855F7",
  },

  emptyState: {
    alignItems: "center",
    marginTop: 70,
    opacity: 0.45,
  },

  emptyIcon: {
    fontSize: 48,
    color: "#4A5568",
    marginBottom: 14,
  },

  emptyText: {
    maxWidth: 260,
    textAlign: "center",
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
  },

  noResults: {
    alignItems: "center",
    paddingTop: 64,
    opacity: 0.5,
  },

  noResultsIcon: {
    fontSize: 42,
    color: "#4A5568",
    marginBottom: 12,
  },

  noResultsText: {
    fontSize: 15,
    color: "#4A5568",
  },

  resultsSection: {
    paddingTop: 18,
  },

  resultCard: {
    width: "100%",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "rgba(13,18,32,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  resultCardPressed: {
    backgroundColor: "rgba(124,58,237,0.1)",
  },

  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
  },

  roleText: {
    fontSize: 10,
    fontWeight: "600",
  },

  inText: {
    marginHorizontal: 7,
    fontSize: 12,
    color: "#8892B0",
  },

  conversationTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#A855F7",
  },

  messageText: {
    fontSize: 13,
    color: "#8892B0",
    lineHeight: 21,
  },

  highlight: {
    backgroundColor: "rgba(168,85,247,0.3)",
    color: "#EEF0FF",
    borderRadius: 3,
  },
});
