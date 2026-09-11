import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { Screen } from "../../types";

interface Props {
  onNext: (screen: Screen) => void;
}

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onNext }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const dotAnims = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
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

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.55,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.25,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Loading dots
    dotAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Go to onboarding
    const timer = setTimeout(() => {
      onNext("onboarding");
    }, 2800);

    return () => clearTimeout(timer);
  }, [fadeAnim, floatAnim, glowAnim, dotAnims, onNext]);

  return (
    <View style={styles.container}>
      {/* Main background */}
      <LinearGradient
        colors={["#060912", "#0D0A1E", "#060912"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Purple glow */}
      <Animated.View
        style={[
          styles.glowOne,
          {
            opacity: glowAnim,
          },
        ]}
      />

      <View style={styles.glowTwo} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: floatAnim }],
          },
        ]}
      >
        {/* Logo mark */}
        <View style={styles.logoWrapper}>
          <LinearGradient
            colors={["#7C3AED", "#6D28D9", "#4F46E5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBox}
          >
            <Svg width={48} height={48} viewBox="0 0 48 48">
              <Path
                d="M8 12L24 38L40 12"
                stroke="white"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              <Path
                d="M16 12L24 28L32 12"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </LinearGradient>

          {/* Outer ring */}
          <View style={styles.outerRing} />
        </View>

        {/* Word mark */}
        <View style={styles.wordMark}>
          <Text style={styles.logoText}>VEXA</Text>

          <Text style={styles.tagline}>
            YOUR AI COMPANION
          </Text>
        </View>
      </Animated.View>

      {/* Loading */}
      <View style={styles.loadingContainer}>
        <View style={styles.dots}>
          {dotAnims.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: anim,
                  backgroundColor:
                    index === 0
                      ? "#7C3AED"
                      : "rgba(124,58,237,0.3)",
                },
              ]}
            />
          ))}
        </View>

        <Text style={styles.loadingText}>
          Initializing intelligence...
        </Text>
      </View>

      {/* Grid overlay */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {Array.from({ length: 12 }).map((_, index) => (
          <View
            key={`v-${index}`}
            style={[
              styles.gridVertical,
              { left: index * 40 },
            ]}
          />
        ))}

        {Array.from({ length: 22 }).map((_, index) => (
          <View
            key={`h-${index}`}
            style={[
              styles.gridHorizontal,
              { top: index * 40 },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#060912",
    overflow: "hidden",
  },

  glowOne: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#7C3AED",
    top: height * 0.08,
    left: width / 2 - 140,
  },

  glowTwo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#6366F1",
    bottom: height * 0.15,
    right: -30,
    opacity: 0.12,
  },

  logoSection: {
    alignItems: "center",
  },

  logoWrapper: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },

  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  outerRing: {
    position: "absolute",
    width: 101,
    height: 101,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.4)",
  },

  wordMark: {
    alignItems: "center",
    marginTop: 20,
  },

  logoText: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
    color: "#EEF0FF",
  },

  tagline: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "400",
    color: "#8892B0",
    letterSpacing: 2,
  },

  loadingContainer: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
  },

  dots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  loadingText: {
    fontSize: 11,
    color: "#4A5568",
    letterSpacing: 1,
  },

  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },

  gridVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#A855F7",
  },

  gridHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#A855F7",
  },
});