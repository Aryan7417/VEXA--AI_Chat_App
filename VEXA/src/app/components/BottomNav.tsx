import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../types";

interface Props {
  active: "home" | "chats" | "search" | "settings";
  onNavigate: (screen: Screen) => void;
}

const tabs = [
  {
    id: "home" as const,
    label: "Home",
    screen: "home" as Screen,
    icon: "home-outline" as const,
    activeIcon: "home" as const,
  },
  {
    id: "chats" as const,
    label: "Chats",
    screen: "chats" as Screen,
    icon: "chatbubble-outline" as const,
    activeIcon: "chatbubble" as const,
  },
  {
    id: "search" as const,
    label: "Search",
    screen: "search" as Screen,
    icon: "search-outline" as const,
    activeIcon: "search" as const,
  },
  {
    id: "settings" as const,
    label: "Settings",
    screen: "settings" as Screen,
    icon: "settings-outline" as const,
    activeIcon: "settings" as const,
  },
];

export default function BottomNav({ active, onNavigate }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        {tabs.map((tab) => {
          const isActive = active === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onNavigate(tab.screen)}
              activeOpacity={0.7}
              style={styles.tab}
            >
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={22}
                  color={isActive ? "#A855F7" : "#4A5568"}
                />

                {/* Active indicator */}
                {isActive && <View style={styles.activeDot} />}
              </View>

              {/* Label */}
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? "#A855F7" : "#4A5568",
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,

    backgroundColor: "#060912",

    borderTopWidth: 1,
    borderTopColor: "rgba(124,58,237,0.15)",

    paddingBottom: 24,
  },

  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
  },

  tab: {
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  activeDot: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",

    width: 4,
    height: 4,
    borderRadius: 2,

    backgroundColor: "#A855F7",

    shadowColor: "#A855F7",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4,

    elevation: 4,
  },

  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "500",
  },
});