

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "../../types";
import {
  getAuth,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";

interface Props {
  onNext: (screen: Screen, value?: string) => void;
}

const API_URL = "http://172.16.50.215:3000";

const countries = [
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+44", flag: "🇬🇧", name: "GB" },
  { code: "+91", flag: "🇮🇳", name: "IN" },
  { code: "+49", flag: "🇩🇪", name: "DE" },
  { code: "+33", flag: "🇫🇷", name: "FR" },
  { code: "+81", flag: "🇯🇵", name: "JP" },
  { code: "+86", flag: "🇨🇳", name: "CN" },
  { code: "+55", flag: "🇧🇷", name: "BR" },
];

type LoginMethod = "phone" | "email";

export default function PhoneLoginScreen({ onNext }: Props) {
  const [method, setMethod] = useState<LoginMethod>("phone");

  const [country, setCountry] = useState(countries[2]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [showCountries, setShowCountries] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPhoneValid =
    phone.replace(/\D/g, "").length >= 7;

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // =========================
  // PHONE OTP
  // =========================

  const handlePhoneContinue = async () => {
    if (!isPhoneValid || loading) return;

    try {
      setLoading(true);

      const phoneNumber =
        `${country.code}${phone.replace(/\D/g, "")}`;

      console.log("Sending Phone OTP to:", phoneNumber);

      const auth = getAuth();

      await signInWithPhoneNumber(
        auth,
        phoneNumber
      );

      console.log("Phone OTP sent successfully");

      onNext("otp", phoneNumber);
    } catch (error) {
      console.log("Firebase OTP Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EMAIL OTP
  // =========================

  const handleEmailContinue = async () => {
    if (!isEmailValid || loading) return;

    try {
      setLoading(true);

      const cleanEmail = email.trim().toLowerCase();

      console.log("Sending Email OTP to:", cleanEmail);

      const response = await fetch(
        `${API_URL}/api/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      const data = await response.json();

      console.log("Email OTP response:", data);

      if (!response.ok || !data.success) {
        console.log(
          "Email OTP Error:",
          data.message
        );
        return;
      }

      console.log("Email OTP sent successfully");

      onNext("otp", cleanEmail);
    } catch (error) {
      console.log(
        "Backend connection error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (method === "phone") {
      handlePhoneContinue();
    } else {
      handleEmailContinue();
    }
  };

  const isValid =
    method === "phone"
      ? isPhoneValid
      : isEmailValid;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.container}>

        {/* Top Glow */}
        <View style={styles.topGlow} />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Logo */}
          <View style={styles.logoContainer}>

            <LinearGradient
              colors={[
                "#7C3AED",
                "#6D28D9",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logo}
            >
              <Text style={styles.logoText}>
                V
              </Text>
            </LinearGradient>

            <Text style={styles.title}>
              Welcome to VEXA
            </Text>

            <Text style={styles.subtitle}>
              Choose how you want to continue.
              We'll send you a verification code.
            </Text>

          </View>

          {/* =========================
              LOGIN METHOD
          ========================= */}

          <Text style={styles.label}>
            CONTINUE WITH
          </Text>

          <View style={styles.methodContainer}>

            {/* PHONE */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setMethod("phone");
                setShowCountries(false);
              }}
              style={[
                styles.methodButton,
                method === "phone" &&
                styles.methodButtonActive,
              ]}
            >
              <Text style={styles.methodIcon}>
                📱
              </Text>

              <Text
                style={[
                  styles.methodText,
                  method === "phone" &&
                  styles.methodTextActive,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>

            {/* EMAIL */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setMethod("email");
                setShowCountries(false);
              }}
              style={[
                styles.methodButton,
                method === "email" &&
                styles.methodButtonActive,
              ]}
            >
              <Text style={styles.methodIcon}>
                ✉️
              </Text>

              <Text
                style={[
                  styles.methodText,
                  method === "email" &&
                  styles.methodTextActive,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>

          </View>

          {/* =========================
              PHONE FORM
          ========================= */}

          {method === "phone" && (
            <>
              <Text style={styles.label}>
                PHONE NUMBER
              </Text>

              <View style={styles.phoneRow}>

                {/* Country Picker */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    setShowCountries(
                      !showCountries
                    )
                  }
                  style={styles.countryButton}
                >
                  <Text style={styles.flag}>
                    {country.flag}
                  </Text>

                  <Text
                    style={styles.countryCode}
                  >
                    {country.code}
                  </Text>

                  <Text style={styles.arrow}>
                    {showCountries
                      ? "▲"
                      : "▼"}
                  </Text>
                </TouchableOpacity>

                {/* Phone Input */}
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Mobile number"
                  placeholderTextColor="#4A5568"
                  keyboardType="phone-pad"
                  maxLength={15}
                  style={[
                    styles.phoneInput,
                    phone.length > 0 &&
                    styles.phoneInputActive,
                  ]}
                />

              </View>

              {/* Country Dropdown */}
              {showCountries && (
                <View
                  style={styles.dropdown}
                >
                  {countries.map(
                    (item, index) => (
                      <TouchableOpacity
                        key={`${item.code}-${item.name}-${index}`}
                        activeOpacity={0.7}
                        onPress={() => {
                          setCountry(item);
                          setShowCountries(false);
                        }}
                        style={
                          styles.countryItem
                        }
                      >
                        <Text
                          style={
                            styles.countryFlag
                          }
                        >
                          {item.flag}
                        </Text>

                        <Text
                          style={
                            styles.countryName
                          }
                        >
                          {item.name}
                        </Text>

                        <Text
                          style={
                            styles.countryItemCode
                          }
                        >
                          {item.code}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              )}
            </>
          )}

          {/* =========================
              EMAIL FORM
          ========================= */}

          {method === "email" && (
            <>
              <Text style={styles.label}>
                EMAIL ADDRESS
              </Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#4A5568"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={[
                  styles.emailInput,
                  email.length > 0 &&
                  styles.phoneInputActive,
                ]}
              />

              <Text style={styles.emailHint}>
                We'll send a 6-digit verification
                code to this email.
              </Text>
            </>
          )}

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing, you agree to our{" "}
            <Text style={styles.termsAccent}>
              Terms of Service
            </Text>
            {" "}and{" "}
            <Text style={styles.termsAccent}>
              Privacy Policy
            </Text>
          </Text>

          {/* Continue Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!isValid || loading}
            onPress={handleContinue}
            style={styles.continueWrapper}
          >
            <LinearGradient
              colors={
                isValid && !loading
                  ? [
                    "#7C3AED",
                    "#6D28D9",
                  ]
                  : [
                    "rgba(124,58,237,0.15)",
                    "rgba(124,58,237,0.15)",
                  ]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueButton}
            >

              {loading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text
                  style={[
                    styles.continueText,
                    !isValid &&
                    styles.continueTextDisabled,
                  ]}
                >
                  {method === "email"
                    ? "Send OTP"
                    : "Continue"}
                </Text>
              )}

            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>

        {/* Grid Effect */}
        <View
          style={styles.gridOverlay}
          pointerEvents="none"
        />

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060912",
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 75,
    paddingBottom: 40,
  },

  topGlow: {
    position: "absolute",
    top: -50,
    left: "50%",
    marginLeft: -150,
    width: 300,
    height: 200,
    borderRadius: 150,
    backgroundColor:
      "rgba(124,58,237,0.12)",
    opacity: 0.8,
  },

  logoContainer: {
    marginBottom: 32,
  },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
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
    lineHeight: 23,
  },

  label: {
    color: "#8892B0",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 10,
  },

  /* METHOD */

  methodContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },

  methodButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#0D1220",
    borderWidth: 1,
    borderColor:
      "rgba(124,58,237,0.20)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  methodButtonActive: {
    backgroundColor:
      "rgba(124,58,237,0.16)",
    borderColor:
      "rgba(124,58,237,0.65)",
  },

  methodIcon: {
    fontSize: 18,
  },

  methodText: {
    color: "#8892B0",
    fontSize: 15,
    fontWeight: "600",
  },

  methodTextActive: {
    color: "#FFFFFF",
  },

  /* PHONE */

  phoneRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 0,
  },

  countryButton: {
    height: 56,
    minWidth: 92,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#0D1220",
    borderWidth: 1,
    borderColor:
      "rgba(124,58,237,0.25)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  flag: {
    fontSize: 19,
  },

  countryCode: {
    color: "#EEF0FF",
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 5,
  },

  arrow: {
    color: "#8892B0",
    fontSize: 9,
  },

  phoneInput: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#0D1220",
    borderWidth: 1,
    borderColor:
      "rgba(124,58,237,0.2)",
    color: "#EEF0FF",
    fontSize: 16,
  },

  phoneInputActive: {
    borderColor:
      "rgba(124,58,237,0.5)",
    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  /* EMAIL */

  emailInput: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#0D1220",
    borderWidth: 1,
    borderColor:
      "rgba(124,58,237,0.2)",
    color: "#EEF0FF",
    fontSize: 16,
  },

  emailHint: {
    marginTop: 9,
    color: "#4A5568",
    fontSize: 12,
  },

  /* COUNTRY */

  dropdown: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#0D1220",
    borderWidth: 1,
    borderColor:
      "rgba(124,58,237,0.25)",
    elevation: 10,
  },

  countryItem: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor:
      "rgba(255,255,255,0.04)",
  },

  countryFlag: {
    fontSize: 19,
    width: 35,
  },

  countryName: {
    flex: 1,
    color: "#EEF0FF",
    fontSize: 14,
    fontWeight: "500",
  },

  countryItemCode: {
    color: "#8892B0",
    fontSize: 13,
  },

  /* TERMS */

  terms: {
    marginTop: 20,
    marginBottom: 28,
    color: "#4A5568",
    fontSize: 12,
    lineHeight: 19,
  },

  termsAccent: {
    color: "#7C3AED",
  },

  /* BUTTON */

  continueWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },

  continueButton: {
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  continueTextDisabled: {
    color: "#4A5568",
  },

  /* GRID */

  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.02,
    borderWidth: 1,
    borderColor: "#A855F7",
  },
});