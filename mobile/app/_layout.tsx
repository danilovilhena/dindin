import { colors } from "@/constants/Colors";
import { ClerkProvider } from "@clerk/clerk-expo";
import { resourceCache } from "@clerk/clerk-expo/resource-cache";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache} __experimental_resourceCache={resourceCache}>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }} />
        <PortalHost />
      </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.primary,
  },
});
