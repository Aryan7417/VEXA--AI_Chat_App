import { ClerkProvider } from "@clerk/expo";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Ignore storage errors
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env"
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ClerkProvider>
  );
}