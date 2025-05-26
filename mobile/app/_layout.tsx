import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { resourceCache } from "@clerk/clerk-expo/resource-cache";
import { View, StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
      __experimental_resourceCache={resourceCache}
    >
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }} />
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
