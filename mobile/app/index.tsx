import { colors } from "@/constants/Colors";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [isLoggedInLocally, setIsLoggedInLocally] = useState<boolean | null>(
    null
  );

  // Load cached login state immediately
  useEffect(() => {
    AsyncStorage.getItem("isLoggedIn").then((value) => {
      setIsLoggedInLocally(value === "true");
    });
  }, []);

  // Handle navigation logic when both Clerk and local state are ready
  useEffect(() => {
    if (isLoaded && isLoggedInLocally !== null) {
      if (isLoggedInLocally && !isSignedIn) {
        // Token expired or session invalid, clear local state and stay on landing
        AsyncStorage.removeItem("isLoggedIn");
        setIsLoggedInLocally(false);
      } else if (isLoggedInLocally && isSignedIn) {
        // Both local and remote confirm user is signed in
        router.replace("/(dashboard)");
      }
    }
  }, [isLoaded, isSignedIn, isLoggedInLocally, router]);

  // Save login state when Clerk confirms user is signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      AsyncStorage.setItem("isLoggedIn", "true");
    } else if (isLoaded && !isSignedIn) {
      AsyncStorage.removeItem("isLoggedIn");
    }
  }, [isLoaded, isSignedIn]);

  const handleStart = () => {
    router.push("/(auth)/sign-up");
  };

  const handleLogin = () => {
    router.push("/(auth)/sign-in");
  };

  // Show loading if we're still waiting for either Clerk or local storage
  if (!isLoaded || isLoggedInLocally === null) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ActivityIndicator size="large" color={colors.yellow} />
        </SafeAreaView>
      </View>
    );
  }

  // If we have cached login state and user should be signed in, redirect immediately
  if (isLoggedInLocally && !isLoaded) {
    return <Redirect href="/(dashboard)" />;
  }

  // If Clerk confirms user is signed in, redirect
  if (isSignedIn && isLoaded) {
    return <Redirect href="/(dashboard)" />;
  }

  // Show landing page for non-authenticated users
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logoImage}
        />

        <View style={styles.bottomSection}>
          <Text style={styles.headerText}>
            Uma forma fácil de gerenciar suas finanças
          </Text>
          <View style={styles.buttonsContainer}>
            <Pressable style={styles.primaryButton} onPress={handleStart}>
              <Text style={styles.primaryButtonText}>Começar agora</Text>
            </Pressable>
            <Pressable style={styles.textButton} onPress={handleLogin}>
              <Text style={styles.textButtonText}>
                Já possui uma conta?{" "}
                <Text style={styles.textButtonTextBold}>Entrar</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.primary,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderColor: colors.white,
    resizeMode: "contain",
  },
  bottomSection: {
    alignItems: "center",
    gap: 48,
    width: "100%",
  },
  headerText: {
    fontFamily: "DMSans",
    fontWeight: "900",
    fontSize: 36,
    textAlign: "center",
    color: colors.white,
    lineHeight: 40,
  },
  buttonsContainer: {
    gap: 16,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: colors.yellow,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.dark.primary,
    fontSize: 16,
    fontFamily: "DMSans",
    fontWeight: "800",
  },
  textButton: {
    alignItems: "center",
  },
  textButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "DMSans",
    fontWeight: "400",
  },
  textButtonTextBold: {
    fontWeight: "700",
  },
});
