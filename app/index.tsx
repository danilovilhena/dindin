import { colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/dashboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.image}
          />
        </View>

        <Text style={styles.headerText}>
          Domine seus gastos sem complicação
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.primaryButton} onPress={handleStart}>
          <Text style={styles.primaryButtonText}>Começar agora</Text>
        </Pressable>

        {/* <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            Já possui conta?{" "}
            <Text style={styles.secondaryButtonTextLink}>Entrar agora</Text>
          </Text>
        </Pressable> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  imageContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowColor: "#E8A230",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  headerText: {
    fontFamily: "DMSans",
    fontWeight: "900",
    fontSize: 32,
    textAlign: "center",
    color: colors.textColor,
    paddingHorizontal: 20,
    lineHeight: 38,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: colors.textColor,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
  },
  secondaryButton: {
    padding: 8,
  },
  secondaryButtonText: {
    color: "#121212",
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  secondaryButtonTextLink: {
    fontFamily: "DMSans_700Bold",
  },
});
