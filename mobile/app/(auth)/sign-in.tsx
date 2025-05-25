import { ClerkErrors } from "@/constants/ClerkErrors";
import { colors } from "@/constants/Colors";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Refs for input navigation
  const passwordRef = React.useRef<TextInput>(null);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded || isLoading) return;

    // Clear any previous errors and set loading state
    setError(null);
    setIsLoading(true);

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(dashboard)");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // Handle Clerk API errors
      if (isClerkAPIResponseError(err)) {
        const clerkError = err.errors[0];
        const errorCode = clerkError.code;
        if (errorCode === "session_exists") {
          router.replace("/(dashboard)");
          return;
        }
        const errorMessage =
          ClerkErrors[errorCode] || ClerkErrors["generic_error"];
        setError(errorMessage);
      } else {
        // Handle network or other errors
        setError(ClerkErrors["network_error"]);
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with chevron and title */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Entrar</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              autoComplete="email"
              value={emailAddress}
              placeholder="Digite seu email"
              placeholderTextColor={colors.dark.textSecondary}
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                ref={passwordRef}
                style={styles.passwordInput}
                value={password}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                placeholderTextColor={colors.dark.textSecondary}
                secureTextEntry={!showPassword}
                onChangeText={(password) => setPassword(password)}
                returnKeyType="done"
                onSubmitEditing={onSignInPress}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}
                disabled={isLoading}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.dark.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        {/* Bottom Section with Button and Link */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isLoading && styles.primaryButtonDisabled,
            ]}
            onPress={onSignInPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.dark.primary} />
                <Text style={styles.primaryButtonText}>Entrando...</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Continuar</Text>
            )}
          </TouchableOpacity>

          <Link href="/sign-up" style={styles.link}>
            <Text style={styles.linkText}>
              Não possui uma conta?{" "}
              <Text style={styles.linkTextBold}>Criar conta</Text>
            </Text>
          </Link>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerText: {
    fontFamily: "DMSans",
    fontWeight: "700",
    fontSize: 24,
    color: colors.white,
  },
  formContainer: {
    flex: 1,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "DMSans",
    fontWeight: "500",
    color: colors.dark.textSecondary,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: "DMSans",
    fontWeight: "400",
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    paddingRight: 50,
    fontSize: 16,
    fontFamily: "DMSans",
    fontWeight: "400",
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.dark.border,
    flex: 1,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    fontFamily: "DMSans",
    fontWeight: "500",
    flex: 1,
    lineHeight: 20,
  },
  bottomSection: {
    gap: 16,
    paddingTop: 20,
  },
  primaryButton: {
    backgroundColor: colors.yellow,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: colors.dark.primary,
    fontSize: 16,
    fontFamily: "DMSans",
    fontWeight: "800",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  linkText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "DMSans",
    fontWeight: "400",
    textAlign: "center",
  },
  link: {
    alignItems: "center",
  },
  linkTextBold: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "DMSans",
    fontWeight: "700",
  },
});
