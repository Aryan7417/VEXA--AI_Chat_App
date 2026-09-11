import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Rect,
  Path,
  Circle,
} from "react-native-svg";

import { Screen } from "../../types";

interface Props {
  onNext: (screen: Screen) => void;
}

/* -------------------------------------------------------------------------- */
/*                                  SLIDES                                    */
/* -------------------------------------------------------------------------- */

const slides = [
  {
    tag: "AI CHAT",
    title: "Talk to VEXA,\nanytime.",
    description:
      "Engage in natural conversations with an AI that understands context, nuance, and your unique needs — available 24/7.",
    accent: "#7C3AED",
    icon: "chat",
  },

  {
    tag: "LEARNING",
    title: "Learn & grow\nwith AI.",
    description:
      "Whether it's a new language, a complex concept, or creative writing — VEXA adapts to your learning style and pace.",
    accent: "#6366F1",
    icon: "learning",
  },

  {
    tag: "CODE & CREATE",
    title: "Code, create,\nimagine.",
    description:
      "Debug code, generate scripts, write stories, brainstorm ideas — VEXA is your creative co-pilot for every project.",
    accent: "#A855F7",
    icon: "code",
  },
];

/* -------------------------------------------------------------------------- */
/*                              ILLUSTRATIONS                                 */
/* -------------------------------------------------------------------------- */

function SlideIcon({
  type,
}: {
  type: string;
}) {
  if (type === "chat") {
    return (
      <Svg width={56} height={56} viewBox="0 0 56 56">
        <Rect
          width={56}
          height={56}
          rx={16}
          fill="rgba(124,58,237,0.15)"
        />

        <Path
          d="M14 36L28 14L42 36"
          stroke="#A855F7"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <Circle
          cx={28}
          cy={38}
          r={2.5}
          fill="#A855F7"
        />

        <Path
          d="M20 28h16"
          stroke="rgba(168,85,247,0.4)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (type === "learning") {
    return (
      <Svg width={56} height={56} viewBox="0 0 56 56">
        <Rect
          width={56}
          height={56}
          rx={16}
          fill="rgba(99,102,241,0.15)"
        />

        <Path
          d="M14 28c0-7.73 6.27-14 14-14s14 6.27 14 14-6.27 14-14 14"
          stroke="#818CF8"
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />

        <Path
          d="M28 20v8l5 5"
          stroke="#818CF8"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <Path
          d="M18 38l-4 4"
          stroke="rgba(129,140,248,0.5)"
          strokeWidth={2}
          strokeLinecap="round"
        />

        <Circle
          cx={14}
          cy={42}
          r={2}
          fill="#818CF8"
        />
      </Svg>
    );
  }

  return (
    <Svg width={56} height={56} viewBox="0 0 56 56">
      <Rect
        width={56}
        height={56}
        rx={16}
        fill="rgba(168,85,247,0.12)"
      />

      <Rect
        x={14}
        y={18}
        width={28}
        height={20}
        rx={3}
        stroke="#C084FC"
        strokeWidth={2.2}
        fill="none"
      />

      <Path
        d="M21 26l4 4-4 4"
        stroke="#C084FC"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <Path
        d="M29 34h6"
        stroke="rgba(192,132,252,0.5)"
        strokeWidth={2}
        strokeLinecap="round"
      />

      <Circle
        cx={36}
        cy={16}
        r={5}
        fill="#7C3AED"
      />

      <Path
        d="M34 16l1.5 1.5L38 14"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                         ONBOARDING SCREEN                                  */
/* -------------------------------------------------------------------------- */

export default function OnboardingScreen({
  onNext,
}: Props) {
  const [current, setCurrent] = useState(0);

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const floatAnim = useRef(
    new Animated.Value(0)
  ).current;

  const dotAnim = useRef(
    new Animated.Value(0)
  ).current;

  const slide = slides[current];

  /* ---------------------------------------------------------------------- */
  /*                           SLIDE ANIMATION                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    fadeAnim.setValue(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [current]);

  /* ---------------------------------------------------------------------- */
  /*                          FLOATING ANIMATION                             */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1500,
          useNativeDriver: true,
        }),

        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  /* ---------------------------------------------------------------------- */
  /*                              NEXT                                       */
  /* ---------------------------------------------------------------------- */

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      onNext("login");
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                              UI                                         */
  /* ---------------------------------------------------------------------- */

  return (
    <View style={styles.container}>

      {/* Background */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          styles.background,
        ]}
      />

      {/* Skip */}
      <View style={styles.skipContainer}>
        <Pressable
          onPress={() => onNext("login")}
          hitSlop={10}
        >
          <Text style={styles.skipText}>
            Skip
          </Text>
        </Pressable>
      </View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >

        {/* Illustration */}
        <Animated.View
          style={[
            styles.illustrationWrapper,
            {
              transform: [
                {
                  translateY: floatAnim,
                },
              ],
            },
          ]}
        >

          <View style={styles.illustrationBox}>
            <SlideIcon type={slide.icon} />
          </View>

          {/* Floating dot */}
          <View
            style={[
              styles.floatingDotOne,
              {
                backgroundColor: slide.accent,
                shadowColor: slide.accent,
              },
            ]}
          />

          <View style={styles.floatingDotTwo} />
        </Animated.View>

        {/* Tag */}
        <View style={styles.tag}>
          <Text style={styles.tagText}>
            {slide.tag}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {slide.title}
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          {slide.description}
        </Text>
      </Animated.View>

      {/* Bottom controls */}
      <View style={styles.bottomContainer}>

        {/* Pagination */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => setCurrent(index)}
              hitSlop={8}
            >
              <View
                style={[
                  styles.paginationDot,
                  index === current
                    ? styles.paginationActive
                    : styles.paginationInactive,
                ]}
              />
            </Pressable>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.buttonWrapper,
            pressed && styles.buttonPressed,
          ]}
        >
          <LinearGradient
            colors={["#7C3AED", "#6D28D9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {current < slides.length - 1
                ? "Continue"
                : "Get Started"}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  STYLES                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060912",
    overflow: "hidden",
  },

  background: {
    backgroundColor: "#060912",
  },

  skipContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 58,
  },

  skipText: {
    fontSize: 13,
    color: "#8892B0",
    fontWeight: "500",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  illustrationWrapper: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 34,
  },

  illustrationBox: {
    width: 140,
    height: 140,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(124,58,237,0.08)",

    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.2)",

    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 10,
  },

  floatingDotOne: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,

    top: -2,
    right: 0,

    opacity: 0.7,

    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },

  floatingDotTwo: {
    position: "absolute",

    width: 6,
    height: 6,
    borderRadius: 3,

    bottom: -2,
    left: 0,

    backgroundColor: "#6366F1",

    opacity: 0.5,
  },

  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: "rgba(124,58,237,0.12)",

    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.25)",

    marginBottom: 12,
  },

  tagText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#A855F7",
    letterSpacing: 1.2,
  },

  title: {
    textAlign: "center",

    fontSize: 30,
    fontWeight: "700",

    color: "#EEF0FF",

    lineHeight: 36,

    marginBottom: 16,
  },

  description: {
    textAlign: "center",

    fontSize: 14,

    color: "#8892B0",

    lineHeight: 24,

    maxWidth: 290,
  },

  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,

    alignItems: "center",
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",

    gap: 8,

    marginBottom: 30,
  },

  paginationDot: {
    height: 6,
    borderRadius: 3,
  },

  paginationActive: {
    width: 24,
    backgroundColor: "#7C3AED",
  },

  paginationInactive: {
    width: 6,
    backgroundColor: "rgba(124,58,237,0.25)",
  },

  buttonWrapper: {
    width: "100%",

    borderRadius: 16,

    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 15,

    elevation: 8,
  },

  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  button: {
    width: "100%",

    borderRadius: 16,

    paddingVertical: 16,

    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});