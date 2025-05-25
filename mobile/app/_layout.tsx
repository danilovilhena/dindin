import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { resourceCache } from "@clerk/clerk-expo/resource-cache";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
      __experimental_resourceCache={resourceCache}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}
