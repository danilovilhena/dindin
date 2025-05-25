import { colors } from "@/constants/Colors";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleStart = () => {
    router.push("/(auth)/sign-up");
  };

  const handleLogin = () => {
    router.push("/(auth)/sign-in");
  };

  if (isSignedIn) {
    return <Redirect href="/(dashboard)" />;
  }

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
