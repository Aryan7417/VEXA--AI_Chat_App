
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Screen } from "../../types";

interface Props {
  onNext: (screen: Screen, name: string, avatar: string | null) => void;
}

const avatarColors = [
  "#7C3AED",
  "#6366F1",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

const avatarEmojis = ["🧑", "👩", "🧔", "👨‍💻", "👩‍💻", "🤖"];

export default function CreateProfileScreen({ onNext }: Props) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const isValid = name.trim().length >= 2;

  const handleStart = () => {
    if (!isValid) return;

    onNext(
      "home",
      name.trim(),
      avatarEmojis[selectedAvatar]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#060912" />

      {/* Top purple glow */}
      <View style={styles.topGlow} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create your profile</Text>

          <Text style={styles.subtitle}>
            Personalize your VEXA experience
          </Text>
        </View>

        {/* Avatar section */}
        <View style={styles.avatarSection}>

          {/* Large Avatar */}
          <View style={styles.avatarPreviewContainer}>
            <View
              style={[
                styles.avatarPreview,
                {
                  backgroundColor: avatarColors[selectedAvatar],
                  shadowColor: avatarColors[selectedAvatar],
                },
              ]}
            >
              <Text style={styles.avatarEmojiLarge}>
                {avatarEmojis[selectedAvatar]}
              </Text>
            </View>

            {/* Edit button */}
            <Pressable style={styles.editButton}>
              <Text style={styles.editIcon}>✎</Text>
            </Pressable>
          </View>

          {/* Avatar options */}
          <View style={styles.avatarOptions}>
            {avatarEmojis.map((emoji, index) => {
              const selected = index === selectedAvatar;

              return (
                <Pressable
                  key={index}
                  onPress={() => setSelectedAvatar(index)}
                  style={[
                    styles.avatarOption,
                    {
                      backgroundColor: selected
                        ? `${avatarColors[index]}25`
                        : "rgba(13,18,32,0.8)",

                      borderColor: selected
                        ? avatarColors[index]
                        : "rgba(255,255,255,0.06)",

                      transform: [
                        {
                          scale: selected ? 1.08 : 1,
                        },
                      ],

                      shadowColor: selected
                        ? avatarColors[index]
                        : "transparent",

                      shadowOpacity: selected ? 0.4 : 0,
                      shadowRadius: 8,
                    },
                  ]}
                >
                  <Text style={styles.avatarEmoji}>
                    {emoji}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Name input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>YOUR NAME</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#4A5568"
            autoCapitalize="words"
            style={[
              styles.input,
              {
                borderColor: name
                  ? "rgba(124,58,237,0.5)"
                  : "rgba(124,58,237,0.2)",

                shadowColor: "#7C3AED",
                shadowOpacity: name ? 0.15 : 0,
                shadowRadius: 6,
              },
            ]}
          />
        </View>

        {/* Info box */}
        <View style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>i</Text>
          </View>

          <Text style={styles.infoText}>
            VEXA will use your name to personalize responses and make
            conversations feel more natural.
          </Text>
        </View>

        {/* Start button */}
        <Pressable
          disabled={!isValid}
          onPress={handleStart}
          style={[
            styles.startButton,
            {
              backgroundColor: isValid
                ? "#7C3AED"
                : "rgba(124,58,237,0.15)",

              shadowColor: "#7C3AED",
              shadowOpacity: isValid ? 0.45 : 0,
              shadowRadius: 12,

              opacity: isValid ? 1 : 0.7,
            },
          ]}
        >
          <Text
            style={[
              styles.startButtonText,
              {
                color: isValid ? "#FFFFFF" : "#4A5568",
              },
            ]}
          >
            Start Exploring
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060912",
    overflow: "hidden",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 55,
  },

  topGlow: {
    position: "absolute",
    top: -50,
    left: "50%",
    marginLeft: -150,
    width: 300,
    height: 200,
    borderRadius: 150,
    backgroundColor: "rgba(124,58,237,0.12)",
  },

  header: {
    marginBottom: 28,
  },

  title: {
    color: "#EEF0FF",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },

  subtitle: {
    marginTop: 8,
    color: "#8892B0",
    fontSize: 14,
    lineHeight: 22,
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  avatarPreviewContainer: {
    position: "relative",
    marginBottom: 22,
  },

  avatarPreview: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.45,
    shadowRadius: 20,

    elevation: 10,
  },

  avatarEmojiLarge: {
    fontSize: 40,
  },

  editButton: {
    position: "absolute",
    right: -8,
    bottom: -8,

    width: 30,
    height: 30,

    borderRadius: 15,
    backgroundColor: "#7C3AED",

    borderWidth: 2,
    borderColor: "#060912",

    alignItems: "center",
    justifyContent: "center",
  },

  editIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  avatarOptions: {
    flexDirection: "row",
    gap: 10,
  },

  avatarOption: {
    width: 44,
    height: 44,

    borderRadius: 14,
    borderWidth: 1.5,

    alignItems: "center",
    justifyContent: "center",
  },

  avatarEmoji: {
    fontSize: 22,
  },

  inputSection: {
    marginBottom: 18,
  },

  label: {
    color: "#8892B0",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 10,
  },

  input: {
    height: 56,

    borderRadius: 16,
    borderWidth: 1,

    backgroundColor: "rgba(13,18,32,0.8)",

    paddingHorizontal: 16,

    color: "#EEF0FF",
    fontSize: 16,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowRadius: 6,
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",

    padding: 16,

    borderRadius: 16,

    backgroundColor: "rgba(124,58,237,0.08)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.15)",

    marginBottom: 24,
  },

  infoIcon: {
    width: 20,
    height: 20,

    borderRadius: 10,

    borderWidth: 1.5,
    borderColor: "#A855F7",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
    marginTop: 1,
  },

  infoIconText: {
    color: "#A855F7",
    fontSize: 12,
    fontWeight: "700",
  },

  infoText: {
    flex: 1,

    color: "#8892B0",
    fontSize: 13,
    lineHeight: 20,
  },

  startButton: {
    height: 56,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    elevation: 8,
  },

  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

