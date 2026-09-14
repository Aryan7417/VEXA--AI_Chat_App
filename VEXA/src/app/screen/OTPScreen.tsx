
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "../../types";



interface Props {
  phone: string;
  method: "phone" | "email";
  onNext: (screen: Screen) => void;
  onBack: () => void;
}

export default function OTPScreen({
  phone,
  method,
  onNext,
  onBack,
}: Props) {
  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [timer, setTimer] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);

  const [errorMessage, setErrorMessage] = useState("");


  const inputs = useRef<Array<TextInput | null>>([]);

  // Timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // OTP change
  const handleChange = (index: number, value: string) => {
    // Only numbers
    const numericValue = value.replace(/[^0-9]/g, "");

    if (!numericValue) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      setError(false);
      return;
    }

    const digit = numericValue.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;

    setOtp(newOtp);
    setError(false);

    // Move to next input
    if (index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto verify when all digits entered
    if (
      newOtp.every((d) => d !== "") &&
      newOtp.join("").length === 6
    ) {
      handleVerify(newOtp.join(""));
    }
  };

  // Backspace handling
  const handleKeyPress = (
    index: number,
    key: string
  ) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
const handleVerify = async (code: string) => {
  if (code.length !== 6 || verifying) return;

  try {
    setVerifying(true);
    setError(false);
    setErrorMessage("");

    console.log("Verifying OTP:", code);
    console.log("Method:", method);
    console.log("Email/Phone:", phone);

    // EMAIL OTP
    if (method === "email") {
      const response = await fetch(
        "http://172.16.50.215:3000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: phone,
            otp: code.trim(),
          }),
        }
      );

      const result = await response.json();

      console.log("Backend verify response:", result);

      if (!response.ok || !result.success) {
        setError(true);
        setErrorMessage(result.message || "Invalid OTP");
        return;
      }

      setVerified(true);

      console.log("✅ Email OTP verified successfully");

      setTimeout(() => {
        onNext("profile-setup");
      }, 500);

      return;
    }

    // PHONE OTP
    // Isko abhi baad mein Firebase confirmation ke saath connect karenge.
    if (method === "phone") {
      setError(true);
      setErrorMessage(
        "Phone verification is not configured yet."
      );
    }

  } catch (error: any) {
    console.log("OTP verification error:", error);

    setError(true);

    setErrorMessage(
      error?.message || "Invalid OTP. Please try again."
    );
  } finally {
    setVerifying(false);
  }
};


  const filled = otp.join("").length;

  const canVerify =
    filled === 6 &&
    !verifying &&
    !verified;

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

        {/* Back Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <View style={styles.content}>

          {/* Icon */}
          <View style={styles.header}>

            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>
                ✓
              </Text>
            </View>

            <Text style={styles.title}>
              Verify your number
            </Text>

            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to
            </Text>

            <Text style={styles.phone}>
              {phone}
            </Text>

          </View>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(value) =>
                  handleChange(index, value)
                }
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(
                    index,
                    nativeEvent.key
                  )
                }
                keyboardType="number-pad"
                maxLength={1}
                editable={
                  !verifying && !verified
                }
                selectTextOnFocus
                style={[
                  styles.otpInput,

                  digit &&
                  styles.otpInputFilled,

                  error &&
                  styles.otpInputError,
                ]}
              />
            ))}
          </View>

          {/* Error */}
          {error && (
            <View style={styles.errorBox}>
              <View style={styles.errorIcon}>
                <Text style={styles.errorIconText}>
                  !
                </Text>
              </View>

              <Text style={styles.errorText}>
                Incorrect code. Try again.
              </Text>
            </View>
          )}

          {/* Verified */}
          {verified && (
            <View style={styles.successBox}>
              <View style={styles.successIcon}>
                <Text style={styles.successIconText}>
                  ✓
                </Text>
              </View>

              <Text style={styles.successText}>
                Verified! Setting up your account...
              </Text>
            </View>
          )}

          {/* Verify Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!canVerify}
            onPress={() =>
              handleVerify(otp.join(""))
            }
            style={styles.verifyWrapper}
          >
            {canVerify ? (
              <LinearGradient
                colors={[
                  "#7C3AED",
                  "#6D28D9",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.verifyButton}
              >
                <Text style={styles.verifyText}>
                  Verify Code
                </Text>
              </LinearGradient>
            ) : (
              <View
                style={[
                  styles.verifyButton,
                  styles.verifyDisabled,
                ]}
              >
                {verifying ? (
                  <Text style={styles.loadingText}>
                    • • •
                  </Text>
                ) : (
                  <Text
                    style={
                      styles.verifyTextDisabled
                    }
                  >
                    {verified
                      ? "Verified ✓"
                      : "Verify Code"}
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive a code?
            </Text>

            {timer > 0 ? (
              <Text style={styles.resendTimer}>
                Resend in {timer}s
              </Text>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setTimer(30);
                  setError(false);
                  setOtp([
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                  ]);
                  inputs.current[0]?.focus();
                }}
              >
                <Text style={styles.resendButton}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Hint */}
          <Text style={styles.hint}>
            Tip: Use any 6 digits to continue
          </Text>

        </View>
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 78,
  },

  topGlow: {
    position: "absolute",
    top: -40,
    left: "50%",
    marginLeft: -150,
    width: 300,
    height: 200,
    borderRadius: 150,
    backgroundColor: "rgba(124,58,237,0.12)",
  },

  backButton: {
    position: "absolute",
    top: 48,
    left: 16,
    width: 42,
    height: 42,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  backArrow: {
    color: "#8892B0",
    fontSize: 38,
    fontWeight: "300",
    lineHeight: 40,
  },

  header: {
    marginBottom: 32,
    alignItems: "flex-start",
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(124,58,237,0.15)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  iconText: {
    color: "#A855F7",
    fontSize: 28,
    fontWeight: "700",
  },

  title: {
    color: "#EEF0FF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    color: "#8892B0",
    fontSize: 14,
    marginBottom: 5,
  },

  phone: {
    color: "#A855F7",
    fontSize: 14,
    fontWeight: "700",
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  otpInput: {
    width: 47,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#0D1220",
    borderWidth: 1.5,
    borderColor: "rgba(124,58,237,0.2)",
    color: "#EEF0FF",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  otpInputFilled: {
    backgroundColor: "rgba(124,58,237,0.12)",
    borderColor: "rgba(124,58,237,0.6)",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  otpInputError: {
    borderColor: "rgba(239,68,68,0.7)",
    color: "#EF4444",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
    marginBottom: 16,
  },

  errorIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  errorIconText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "700",
  },

  errorText: {
    color: "#EF4444",
    fontSize: 13,
  },

  successBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(16,185,129,0.1)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.3)",
    marginBottom: 16,
  },

  successIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  successIconText: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "700",
  },

  successText: {
    color: "#10B981",
    fontSize: 13,
    flex: 1,
  },

  verifyWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },

  verifyButton: {
    height: 58,
    justifyContent: "center",
    alignItems: "center",
  },

  verifyDisabled: {
    backgroundColor: "rgba(124,58,237,0.15)",
  },

  verifyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  verifyTextDisabled: {
    color: "#4A5568",
    fontSize: 16,
    fontWeight: "700",
  },

  loadingText: {
    color: "#A855F7",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 4,
  },

  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  resendText: {
    color: "#8892B0",
    fontSize: 13,
    marginRight: 6,
  },

  resendTimer: {
    color: "#4A5568",
    fontSize: 13,
    fontWeight: "600",
  },

  resendButton: {
    color: "#A855F7",
    fontSize: 13,
    fontWeight: "700",
  },

  hint: {
    color: "#4A5568",
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
  },
});

