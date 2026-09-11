import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Svg, {
  Circle,
  Path,
  Polyline,
  Rect,
} from "react-native-svg";

import { AppState, Message, Model, Screen } from "../../types";
import BottomNav from "../components/BottomNav";

interface Props {
  state: AppState;
  initialMessage?: string;
  onNavigate: (screen: Screen) => void;
  onAddMessage: (convId: string, msg: Message) => void;
}

const AI_RESPONSES = [
  `That's a great question! Let me break this down for you in a clear and comprehensive way.

Here's what you need to know:

1. **Core concept** — The fundamental idea here is built on a layered approach that scales naturally.

2. **Implementation** — You can start with a simple structure:

\`\`\`javascript
const vexa = {
  model: 'smart',
  context: [],
  async chat(message) {
    return await this.process(message);
  }
};
\`\`\`

3. **Best practices** — Always validate inputs and handle edge cases gracefully.

Would you like me to dive deeper into any of these points?`,

  `I've analyzed your request and here's my comprehensive response:

**Summary:** Your approach is solid, but there are a few optimizations worth considering.

The key insight is that modern AI systems work best when given **clear context** and **specific constraints**.

Think of it like giving directions — the more precise, the better the result.

> "The best AI interactions are collaborative, not transactional."

Shall I elaborate on any particular aspect?`,

  `Absolutely! Here's a quick overview:

This is a fascinating area with lots of nuance. The short answer is **yes**, but the longer answer involves understanding the tradeoffs between:

- **Speed** vs accuracy
- **Simplicity** vs completeness
- **Cost** vs quality

My recommendation would be to start simple and iterate. What specific use case are you working on?`,
];

const MODEL_BADGE: Record<
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

export default function ChatScreen({
  state,
  initialMessage,
  onNavigate,
  onAddMessage,
}: Props) {
  const activeConv = state.conversations.find(
    (c) => c.id === state.activeConversationId
  );

  const [messages, setMessages] = useState<Message[]>(
    activeConv?.messages || []
  );

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamText, setStreamText] = useState("");

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [dislikedIds, setDislikedIds] = useState<Set<string>>(new Set());

  const [showModel, setShowModel] = useState(false);

  const flatListRef = useRef<FlatList<Message>>(null);
  const initialized = useRef(false);

  /*
   * Keep messages synced with currently opened conversation
   */
  useEffect(() => {
    setMessages(activeConv?.messages || []);
  }, [state.activeConversationId]);

  /*
   * Automatically send initial message
   */
  useEffect(() => {
    if (initialMessage && !initialized.current) {
      initialized.current = true;
      sendMessage(initialMessage);
    }
  }, [initialMessage]);

  /*
   * Scroll to bottom whenever messages change
   */
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);
  }, [messages, streamText, isTyping]);

  /*
   * Send message
   */
  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setStreamText("");

    /*
     * Save user message to global App state
     */
    if (state.activeConversationId) {
      onAddMessage(state.activeConversationId, userMsg);
    }

    const response =
      AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];

    let i = 0;

    const interval = setInterval(() => {
      i++;

      const currentText = response.slice(0, i * 3);
      setStreamText(currentText);

      if (i * 3 >= response.length) {
        clearInterval(interval);

        setIsTyping(false);
        setStreamText("");

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMsg]);

        if (state.activeConversationId) {
          onAddMessage(state.activeConversationId, aiMsg);
        }
      }
    }, 20);
  };

  /*
   * Copy text
   */
  const handleCopy = async (id: string, content: string) => {
    try {
      await Clipboard.setStringAsync(content);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.log("Copy failed:", error);
    }
  };

  /*
   * Like
   */
  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  /*
   * Dislike
   */
  const toggleDislike = (id: string) => {
    setDislikedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  /*
   * VEXA logo
   */
  const VexaLogo = ({
    size = 20,
    color = "#FFFFFF",
  }: {
    size?: number;
    color?: string;
  }) => {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
      >
        <Path
          d="M8 12L24 38L40 12"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  };

  /*
   * Back icon
   */
  const BackIcon = () => (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M19 12H5M12 5l-7 7 7 7"
        stroke="#8892B0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  /*
   * More icon
   */
  const MoreIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Circle cx="12" cy="5" r="1.5" fill="#8892B0" />
      <Circle cx="12" cy="12" r="1.5" fill="#8892B0" />
      <Circle cx="12" cy="19" r="1.5" fill="#8892B0" />
    </Svg>
  );

  /*
   * Send icon
   */
  const SendIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  /*
   * Copy icon
   */
  const CopyIcon = () => (
    <Svg width={14} height={14} viewBox="0 0 24 24">
      <Rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />

      <Path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="2"
      />
    </Svg>
  );

  /*
   * Like icon
   */
  const LikeIcon = ({ filled }: { filled: boolean }) => (
    <Svg width={14} height={14} viewBox="0 0 24 24">
      <Path
        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
        stroke={filled ? "#10B981" : "#4A5568"}
        fill={filled ? "#10B981" : "none"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  /*
   * Dislike icon
   */
  const DislikeIcon = ({ filled }: { filled: boolean }) => (
    <Svg width={14} height={14} viewBox="0 0 24 24">
      <Path
        d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"
        stroke={filled ? "#EF4444" : "#4A5568"}
        fill={filled ? "#EF4444" : "none"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  /*
   * Regenerate icon
   */
  const RegenerateIcon = () => (
    <Svg width={14} height={14} viewBox="0 0 24 24">
      <Polyline
        points="23 4 23 11 16 11"
        stroke="#4A5568"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <Path
        d="M20.49 15a9 9 0 1 1-2.12-9.36L23 11"
        stroke="#4A5568"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  /*
   * Render markdown-like content
   *
   * Handles:
   * **bold**
   * `inline code`
   * ```code blocks```
   * > quotes
   * normal text
   */
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
      <View>
        {parts.map((part, index) => {
          /*
           * Code block
           */
          if (part.startsWith("```")) {
            const code = part
              .replace(/```\w*\n?/, "")
              .replace(/```$/, "");

            return (
              <View key={index} style={styles.codeContainer}>
                <View style={styles.codeHeader}>
                  <Text style={styles.codeLabel}>code</Text>

                  <Pressable
                    onPress={() =>
                      handleCopy(`code-${index}`, code)
                    }
                  >
                    <Text
                      style={[
                        styles.copyText,
                        copiedId === `code-${index}` &&
                          styles.copiedText,
                      ]}
                    >
                      {copiedId === `code-${index}`
                        ? "copied!"
                        : "copy"}
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.codeText}>{code}</Text>
              </View>
            );
          }

          /*
           * Normal text
           */
          return (
            <View key={index}>
              {part.split("\n").map((line, lineIndex) => {
                if (!line.trim()) {
                  return (
                    <View
                      key={lineIndex}
                      style={{ height: 8 }}
                    />
                  );
                }

                /*
                 * Quote
                 */
                if (line.startsWith("> ")) {
                  return (
                    <View
                      key={lineIndex}
                      style={styles.quoteContainer}
                    >
                      <Text style={styles.quoteText}>
                        {line.substring(2)}
                      </Text>
                    </View>
                  );
                }

                /*
                 * Bullet
                 */
                if (line.startsWith("- ")) {
                  return (
                    <Text
                      key={lineIndex}
                      style={styles.messageText}
                    >
                      {"• "}
                      {renderInlineText(line.substring(2))}
                    </Text>
                  );
                }

                return (
                  <Text
                    key={lineIndex}
                    style={styles.messageText}
                  >
                    {renderInlineText(line)}
                  </Text>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  /*
   * Basic inline markdown
   */
  const renderInlineText = (text: string): any => {
    const parts = text.split(
      /(\*\*.*?\*\*|`.*?`)/
    );

    return parts.map((part, index) => {
      if (
        part.startsWith("**") &&
        part.endsWith("**")
      ) {
        return (
          <Text
            key={index}
            style={styles.boldText}
          >
            {part.slice(2, -2)}
          </Text>
        );
      }

      if (
        part.startsWith("`") &&
        part.endsWith("`")
      ) {
        return (
          <Text
            key={index}
            style={styles.inlineCode}
          >
            {part.slice(1, -1)}
          </Text>
        );
      }

      return (
        <Text key={index}>
          {part}
        </Text>
      );
    });
  };

  const mInfo = MODEL_BADGE[state.model];

  /*
   * Empty chat
   */
  const EmptyChat = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyLogo}>
        <VexaLogo size={30} color="#A855F7" />
      </View>

      <Text style={styles.emptyText}>
        Start a conversation
      </Text>
    </View>
  );

  /*
   * AI avatar
   */
  const AiAvatar = () => (
    <View style={styles.aiAvatar}>
      <VexaLogo size={13} />
    </View>
  );

  /*
   * Message renderer
   */
  const renderMessage = ({
    item: msg,
  }: {
    item: Message;
  }) => {
    /*
     * USER MESSAGE
     */
    if (msg.role === "user") {
      return (
        <View style={styles.userMessageRow}>
          <View style={styles.userBubble}>
            <Text style={styles.userMessageText}>
              {msg.content}
            </Text>
          </View>
        </View>
      );
    }

    /*
     * AI MESSAGE
     */
    return (
      <View style={styles.aiMessageRow}>
        <AiAvatar />

        <View style={styles.aiMessageColumn}>
          <View style={styles.aiBubble}>
            {renderContent(msg.content)}
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={() =>
                handleCopy(msg.id, msg.content)
              }
              style={styles.actionButton}
            >
              <CopyIcon />

              <Text
                style={[
                  styles.actionText,
                  copiedId === msg.id &&
                    styles.copiedText,
                ]}
              >
                {copiedId === msg.id
                  ? "Copied"
                  : "Copy"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => toggleLike(msg.id)}
              style={styles.actionButton}
            >
              <LikeIcon
                filled={likedIds.has(msg.id)}
              />
            </Pressable>

            <Pressable
              onPress={() =>
                toggleDislike(msg.id)
              }
              style={styles.actionButton}
            >
              <DislikeIcon
                filled={dislikedIds.has(msg.id)}
              />
            </Pressable>

            <Pressable
              onPress={() =>
                sendMessage(msg.content)
              }
              style={styles.actionButton}
            >
              <RegenerateIcon />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  /*
   * Typing / streaming UI
   */
  const TypingMessage = () => (
    <View style={styles.aiMessageRow}>
      <AiAvatar />

      <View style={styles.aiMessageColumn}>
        <View style={styles.aiBubble}>
          {streamText ? (
            <Text style={styles.messageText}>
              {streamText}
              <Text style={styles.cursor}>▌</Text>
            </Text>
          ) : (
            <View style={styles.typingContainer}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
      keyboardVerticalOffset={
        Platform.OS === "ios" ? 10 : 0
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => onNavigate("chats")}
          style={styles.headerButton}
        >
          <BackIcon />
        </Pressable>

        <View style={styles.headerIdentity}>
          <View style={styles.headerLogo}>
            <VexaLogo size={16} />
          </View>

          <View>
            <Text style={styles.headerTitle}>
              VEXA
            </Text>

            <Text style={styles.activeText}>
              ● Active
            </Text>
          </View>
        </View>

        {/* Model */}
        <Pressable
          onPress={() =>
            setShowModel((prev) => !prev)
          }
          style={styles.modelButton}
        >
          <Text style={styles.modelIcon}>
            {mInfo.icon}
          </Text>

          <Text
            style={[
              styles.modelText,
              { color: mInfo.color },
            ]}
          >
            {mInfo.label}
          </Text>
        </Pressable>

        <Pressable style={styles.headerButton}>
          <MoreIcon />
        </Pressable>
      </View>

      {/* Model popup */}
      {showModel && (
        <View style={styles.modelPopup}>
          {(Object.keys(MODEL_BADGE) as Model[]).map(
            (model) => {
              const info = MODEL_BADGE[model];

              return (
                <Pressable
                  key={model}
                  style={[
                    styles.modelOption,
                    state.model === model &&
                      styles.selectedModel,
                  ]}
                  onPress={() => {
                    setShowModel(false);
                  }}
                >
                  <Text style={styles.modelOptionIcon}>
                    {info.icon}
                  </Text>

                  <Text
                    style={[
                      styles.modelOptionText,
                      { color: info.color },
                    ]}
                  >
                    {info.label}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>
      )}

      {/* MESSAGES */}
      <View style={styles.messagesContainer}>
        {messages.length === 0 && !isTyping ? (
          <EmptyChat />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={
              styles.messagesContent
            }
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              isTyping ? (
                <TypingMessage />
              ) : null
            }
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({
                animated: false,
              })
            }
          />
        )}
      </View>

      {/* INPUT */}
      <View style={styles.inputArea}>
        <View style={styles.inputRow}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Continue the conversation..."
              placeholderTextColor="#4A5568"
              multiline
              maxLength={4000}
              style={styles.textInput}
              editable={!isTyping}
            />

            {/* Input tools */}
            <View style={styles.inputTools}>
              <Pressable style={styles.toolButton}>
                <Text style={styles.toolIcon}>
                  📎
                </Text>
              </Pressable>

              <Pressable style={styles.toolButton}>
                <Text style={styles.toolIcon}>
                  🎙️
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Send */}
          <Pressable
            onPress={() => sendMessage(input)}
            disabled={
              !input.trim() || isTyping
            }
            style={[
              styles.sendButton,
              input.trim() && !isTyping
                ? styles.sendButtonActive
                : styles.sendButtonDisabled,
            ]}
          >
            <SendIcon />
          </Pressable>
        </View>
      </View>

      {/* Bottom navigation */}
      <BottomNav
        active="chats"
        onNavigate={onNavigate}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060912",
  },

  /* HEADER */

  header: {
    height: 76,
    paddingTop: 25,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    backgroundColor: "rgba(6,9,18,0.98)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124,58,237,0.1)",
  },

  headerButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  headerIdentity: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  headerLogo: {
    width: 32,
    height: 32,
    borderRadius: 11,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#7C3AED",
  },

  headerTitle: {
    color: "#EEF0FF",
    fontSize: 14,
    fontWeight: "700",
  },

  activeText: {
    marginTop: 2,
    color: "#10B981",
    fontSize: 10,
  },

  modelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,

    paddingHorizontal: 9,
    paddingVertical: 7,

    borderRadius: 12,

    backgroundColor: "rgba(124,58,237,0.12)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.25)",
  },

  modelIcon: {
    fontSize: 11,
  },

  modelText: {
    fontSize: 11,
    fontWeight: "600",
  },

  /* MODEL POPUP */

  modelPopup: {
    position: "absolute",
    top: 72,
    right: 45,
    zIndex: 100,

    width: 120,
    padding: 6,

    borderRadius: 14,

    backgroundColor: "#0D1220",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.25)",
  },

  modelOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    paddingHorizontal: 10,
    paddingVertical: 9,

    borderRadius: 9,
  },

  selectedModel: {
    backgroundColor: "rgba(124,58,237,0.12)",
  },

  modelOptionIcon: {
    fontSize: 13,
  },

  modelOptionText: {
    fontSize: 12,
    fontWeight: "600",
  },

  /* MESSAGES */

  messagesContainer: {
    flex: 1,
  },

  messagesContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 15,
  },

  /* EMPTY */

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },

  emptyLogo: {
    width: 64,
    height: 64,
    borderRadius: 24,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(124,58,237,0.1)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.2)",
  },

  emptyText: {
    marginTop: 15,
    color: "#8892B0",
    fontSize: 14,
  },

  /* USER MESSAGE */

  userMessageRow: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 15,
  },

  userBubble: {
    maxWidth: "82%",

    paddingHorizontal: 15,
    paddingVertical: 11,

    borderRadius: 22,
    borderTopRightRadius: 7,

    backgroundColor: "#7C3AED",

    shadowColor: "#7C3AED",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  userMessageText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 22,
  },

  /* AI MESSAGE */

  aiMessageRow: {
    width: "100%",
    flexDirection: "row",
    gap: 9,
    marginBottom: 15,
  },

  aiAvatar: {
    width: 28,
    height: 28,

    marginTop: 3,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#7C3AED",
  },

  aiMessageColumn: {
    flex: 1,
  },

  aiBubble: {
    paddingHorizontal: 14,
    paddingVertical: 11,

    borderRadius: 22,
    borderTopLeftRadius: 7,

    backgroundColor: "rgba(13,18,32,0.95)",

    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.15)",
  },

  messageText: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 24,
  },

  boldText: {
    color: "#EEF0FF",
    fontWeight: "700",
  },

  inlineCode: {
    color: "#A855F7",
    backgroundColor: "rgba(124,58,237,0.15)",
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },

  /* CODE */

  codeContainer: {
    marginVertical: 7,

    borderRadius: 12,

    overflow: "hidden",

    backgroundColor: "#0A0E1A",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.2)",
  },

  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderBottomWidth: 1,
    borderBottomColor: "rgba(124,58,237,0.15)",
  },

  codeLabel: {
    color: "#A855F7",
    fontSize: 11,
    fontFamily:
      Platform.OS === "ios"
        ? "Courier"
        : "monospace",
  },

  copyText: {
    color: "#8892B0",
    fontSize: 11,
    fontFamily:
      Platform.OS === "ios"
        ? "Courier"
        : "monospace",
  },

  copiedText: {
    color: "#10B981",
  },

  codeText: {
    padding: 12,

    color: "#CBD5E1",

    fontSize: 12,
    lineHeight: 18,

    fontFamily:
      Platform.OS === "ios"
        ? "Courier"
        : "monospace",
  },

  /* QUOTE */

  quoteContainer: {
    marginVertical: 5,
    paddingLeft: 11,

    borderLeftWidth: 3,
    borderLeftColor: "#7C3AED",
  },

  quoteText: {
    color: "#8892B0",
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
  },

  /* ACTIONS */

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,

    marginTop: 7,
    paddingLeft: 3,
  },

  actionButton: {
    minHeight: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  actionText: {
    color: "#4A5568",
    fontSize: 11,
  },

  /* TYPING */

  typingContainer: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 4,
  },

  typingDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor: "#A855F7",
  },

  cursor: {
    color: "#A855F7",
  },

  /* INPUT */

  inputArea: {
    paddingHorizontal: 14,
    paddingTop: 7,
    paddingBottom: 82,

    backgroundColor: "#060912",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  textInputContainer: {
    flex: 1,

    minHeight: 52,
    maxHeight: 130,

    borderRadius: 22,

    backgroundColor: "rgba(13,18,32,0.95)",

    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.25)",
  },

  textInput: {
    minHeight: 48,
    maxHeight: 95,

    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 5,

    color: "#EEF0FF",

    fontSize: 14,
  },

  inputTools: {
    height: 32,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
    gap: 8,
  },

  toolButton: {
    width: 28,
    height: 28,

    alignItems: "center",
    justifyContent: "center",
  },

  toolIcon: {
    fontSize: 16,
    color: "#8892B0",
  },

  sendButton: {
    width: 48,
    height: 48,

    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonActive: {
    backgroundColor: "#7C3AED",

    shadowColor: "#7C3AED",
    shadowOpacity: 0.5,
    shadowRadius: 10,

    elevation: 5,
  },

  sendButtonDisabled: {
    backgroundColor: "rgba(124,58,237,0.2)",
  },
});
