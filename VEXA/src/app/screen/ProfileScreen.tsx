import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native"

import { AppState, Screen } from "../../types"

interface Props {
  state: AppState
  onNavigate: (screen: Screen) => void
  onLogout: () => void
}

const stats = [
  {
    label: "Conversations",
    getValue: (s: AppState) => s.conversations.length.toString(),
  },
  {
    label: "Messages",
    getValue: (s: AppState) =>
      s.conversations
        .reduce((total, conversation) => total + conversation.messages.length, 0)
        .toString(),
  },
  {
    label: "Days Active",
    getValue: () => "1",
  },
]

export default function ProfileScreen({
  state,
  onNavigate,
  onLogout,
}: Props) {
  const menuItems = [
    {
      icon: "👤",
      label: "Edit Profile",
      sub: "Update name and avatar",
      action: () => { },
    },
    {
      icon: "🤖",
      label: "AI Model",
      sub: `Currently: ${state.model}`,
      action: () => onNavigate("model-selection"),
    },
    {
      icon: "🔔",
      label: "Notifications",
      sub: state.notifications ? "Enabled" : "Disabled",
      action: () => onNavigate("settings"),
    },
    {
      icon: "🔒",
      label: "Privacy & Security",
      sub: "Manage your data",
      action: () => { },
    },
    {
      icon: "❓",
      label: "Help & Support",
      sub: "FAQs and contact us",
      action: () => { },
    },
    {
      icon: "⭐",
      label: "Rate VEXA",
      sub: "Share your feedback",
      action: () => { },
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Glow */}
      <View style={styles.glow} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity
          onPress={() => onNavigate("settings")}
          style={styles.settingsButton}
          activeOpacity={0.7}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar + Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>🧑</Text>
            </View>

            {/* Online indicator */}
            <View style={styles.onlineOuter}>
              <View style={styles.onlineDot} />
            </View>
          </View>

          <Text style={styles.userName}>
            {state.userName || "User"}
          </Text>

          <Text style={styles.phone}>
            {state.phone || "+1 555 0100"}
          </Text>

          <View style={styles.proBadge}>
            <Text style={styles.proText}>VEXA Pro</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>
                {stat.getValue(state)}
              </Text>

              <Text style={styles.statLabel}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.action}
              activeOpacity={0.7}
              style={styles.menuItem}
            >
              {/* Icon */}
              <View style={styles.menuIconContainer}>
                <Text style={styles.menuIcon}>
                  {item.icon}
                </Text>
              </View>

              {/* Text */}
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>
                  {item.label}
                </Text>

                <Text style={styles.menuSubtitle}>
                  {item.sub}
                </Text>
              </View>

              {/* Arrow */}
              <Text style={styles.arrow}>
                ›
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={onLogout}
          activeOpacity={0.7}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutIcon}>↪</Text>

          <Text style={styles.logoutText}>
            Sign Out
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          VEXA v1.0.0 · Made with ♥
        </Text>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNavItem
          label="Home"
          icon="⌂"
          onPress={() => onNavigate("home")}
        />

        <BottomNavItem
          label="Chats"
          icon="💬"
          onPress={() => onNavigate("chats")}
        />

        <BottomNavItem
          label="Search"
          icon="⌕"
          onPress={() => onNavigate("search")}
        />

        <BottomNavItem
          label="Settings"
          icon="⚙"
          active
          onPress={() => onNavigate("settings")}
        />
      </View>
    </SafeAreaView>
  )
}

/* -------------------------------- */
/* Bottom Navigation Item            */
/* -------------------------------- */

interface BottomNavItemProps {
  label: string
  icon: string
  active?: boolean
  onPress: () => void
}

function BottomNavItem({
  label,
  icon,
  active = false,
  onPress,
}: BottomNavItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.navItem}
    >
      <Text
        style={[
          styles.navIcon,
          active && styles.navIconActive,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.navLabel,
          active && styles.navLabelActive,
        ]}
      >
        {label}
      </Text>

      {active && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  )
}

/* -------------------------------- */
/* Styles                            */
/* -------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060912",
  },

  glow: {
    position: "absolute",
    top: -80,
    alignSelf: "center",
    width: 400,
    height: 300,
    borderRadius: 200,
    backgroundColor: "rgba(124,58,237,0.08)",
  },

  /* Header */

  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#EEF0FF",
  },

  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,58,237,0.12)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.2)",
  },

  settingsIcon: {
    fontSize: 18,
  },

  /* Scroll */

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  /* Profile */

  profileSection: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 28,
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
  },

  avatarEmoji: {
    fontSize: 40,
  },

  onlineOuter: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#060912",
  },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },

  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#EEF0FF",
  },

  phone: {
    marginTop: 4,
    fontSize: 13,
    color: "#8892B0",
  },

  proBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(124,58,237,0.12)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.25)",
  },

  proText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#A855F7",
  },

  /* Stats */

  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 5,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "rgba(13,18,32,0.8)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.15)",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#EEF0FF",
  },

  statLabel: {
    marginTop: 2,
    fontSize: 10,
    color: "#8892B0",
    textAlign: "center",
  },

  /* Menu */

  menuContainer: {
    marginBottom: 8,
  },

  menuItem: {
    minHeight: 72,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "rgba(13,18,32,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,58,237,0.1)",
  },

  menuIcon: {
    fontSize: 18,
  },

  menuTextContainer: {
    flex: 1,
    marginLeft: 14,
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EEF0FF",
  },

  menuSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#8892B0",
  },

  arrow: {
    fontSize: 26,
    fontWeight: "300",
    color: "#4A5568",
    marginLeft: 8,
  },

  /* Logout */

  logoutButton: {
    height: 56,
    marginTop: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239,68,68,0.08)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
  },

  logoutIcon: {
    fontSize: 22,
    color: "#EF4444",
    marginRight: 8,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EF4444",
  },

  footer: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 11,
    color: "#4A5568",
  },

  /* Bottom Navigation */

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 82,
    paddingBottom: 12,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#060912",
    borderTopWidth: 1,
    borderTopColor: "rgba(124,58,237,0.15)",
  },

  navItem: {
    minWidth: 60,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 22,
    color: "#4A5568",
  },

  navIconActive: {
    color: "#A855F7",
  },

  navLabel: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "500",
    color: "#4A5568",
  },

  navLabelActive: {
    color: "#A855F7",
  },

  activeIndicator: {
    position: "absolute",
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#A855F7",
  },
})
