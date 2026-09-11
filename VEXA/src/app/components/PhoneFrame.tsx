import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

interface Props {
  children: ReactNode;
}

const { width, height } = Dimensions.get("window");

export default function PhoneFrame({ children }: Props) {
  /*
   * On a real phone we don't need to draw a fake phone frame.
   * The app should simply use the complete device screen.
   */
  return (
    <View style={styles.container}>

      {/* Background */}
      <LinearGradient
        colors={["#080512", "#02040A", "#02040A"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient glow - top */}
      <View style={styles.topGlow} />

      {/* Ambient glow - bottom */}
      <View style={styles.bottomGlow} />

      {/* Main app screen */}
      <View style={styles.screen}>
        {children}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#02040A",
  },

  screen: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#060912",
  },

  topGlow: {
    position: "absolute",

    width: 500,
    height: 350,

    borderRadius: 250,

    top: -180,
    left: width / 2 - 250,

    backgroundColor: "#7C3AED",

    opacity: 0.08,
  },

  bottomGlow: {
    position: "absolute",

    width: 350,
    height: 350,

    borderRadius: 175,

    bottom: -180,
    right: -100,

    backgroundColor: "#6366F1",

    opacity: 0.06,
  },
});