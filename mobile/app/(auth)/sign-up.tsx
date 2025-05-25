import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSignUp, isClerkAPIResponseError } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/Colors";
import { ClerkErrors } from "@/constants/ClerkErrors";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [resendTimeout, setResendTimeout] = React.useState(0);
  const [isResending, setIsResending] = React.useState(false);

  // Refs for input navigation
  const lastNameRef = React.useRef<TextInput>(null);
  const emailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);
  const otpRefs = React.useRef<(TextInput | null)[]>([]);

  // Resend timeout effect
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimeout > 0) {
      interval = setInterval(() => {
        setResendTimeout((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimeout]);

  // Start resend timeout when entering verification
  React.useEffect(() => {
    if (pendingVerification && resendTimeout === 0) {
      setResendTimeout(30);
    }
  }, [pendingVerification]);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || isLoading) return;

    // Clear any previous errors and set loading state
    setError(null);
    setIsLoading(true);

    console.log(firstName, lastName, emailAddress, password);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
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

  // Handle OTP input change
  const handleOtpChange = (value: string, index: number) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    // Handle pasted content (6 digits)
    if (numericValue.length === 6) {
      const newCode = numericValue.split("");
      setCode(newCode);
      // Focus the last input
      otpRefs.current[5]?.focus();
      // Auto-submit
      onVerifyPress(numericValue);
      return;
    }

    // Handle pasted content (more than 6 digits, take first 6)
    if (numericValue.length > 6) {
      const newCode = numericValue.slice(0, 6).split("");
      setCode(newCode);
      // Focus the last input
      otpRefs.current[5]?.focus();
      // Auto-submit
      onVerifyPress(newCode.join(""));
      return;
    }

    // Handle single digit input or shorter pastes
    const newCode = [...code];

    if (numericValue.length === 0) {
      // Handle deletion
      newCode[index] = "";
    } else if (numericValue.length === 1) {
      // Handle single digit
      newCode[index] = numericValue;
    } else {
      // Handle multiple digits pasted (less than 6)
      // Fill from current index onwards
      for (let i = 0; i < numericValue.length && index + i < 6; i++) {
        newCode[index + i] = numericValue[i];
      }
    }

    setCode(newCode);

    // Auto-focus next input for single digit
    if (numericValue.length === 1 && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (
      newCode.every((digit) => digit !== "") &&
      newCode.join("").length === 6
    ) {
      onVerifyPress(newCode.join(""));
    }
  };

  // Handle OTP backspace
  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async (otpCode?: string) => {
    if (!isLoaded || isLoading) return;

    const verificationCode = otpCode || code.join("");
    if (verificationCode.length !== 6) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(dashboard)");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setError("Código inválido. Tente novamente.");
      }
    } catch (err: any) {
      // Handle Clerk API errors
      if (isClerkAPIResponseError(err)) {
        const clerkError = err.errors[0];
        const errorCode = clerkError.code;
        const errorMessage =
          ClerkErrors[errorCode] || "Código inválido. Tente novamente.";
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
    if (pendingVerification) {
      setPendingVerification(false);
      setCode(["", "", "", "", "", ""]);
      setError(null);
    } else {
      router.back();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle resend verification
  const onResendPress = async () => {
    if (!isLoaded || isResending || resendTimeout > 0) return;

    setIsResending(true);
    setError(null);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResendTimeout(30);
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        const clerkError = err.errors[0];
        const errorCode = clerkError.code;
        const errorMessage =
          ClerkErrors[errorCode] || ClerkErrors["generic_error"];
        setError(errorMessage);
      } else {
        setError(ClerkErrors["network_error"]);
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsResending(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header with chevron and title */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Verificar email</Text>
          </View>

          <Text style={styles.subHeaderText}>
            Digite o código de verificação que foi enviado para seu email
          </Text>

          {/* OTP Container */}
          <View style={styles.formContainer}>
            <View style={styles.otpContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    otpRefs.current[index] = ref;
                  }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleOtpKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  textAlign="center"
                  selectTextOnFocus
                  editable={!isLoading}
                />
              ))}
            </View>

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>

          {/* Bottom Section with Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                isLoading && styles.primaryButtonDisabled,
              ]}
              onPress={() => onVerifyPress()}
              disabled={isLoading || code.join("").length !== 6}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.dark.primary} />
                  <Text style={styles.primaryButtonText}>Verificando...</Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>Verificar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                (isResending || resendTimeout > 0) &&
                  styles.secondaryButtonDisabled,
              ]}
              onPress={onResendPress}
              disabled={isResending || resendTimeout > 0}
            >
              {isResending ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.secondaryButtonText}>Reenviando...</Text>
                </View>
              ) : resendTimeout > 0 ? (
                <Text style={styles.secondaryButtonText}>
                  Reenviar código em {resendTimeout}s
                </Text>
              ) : (
                <Text style={styles.secondaryButtonText}>Reenviar código</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with chevron and title */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Criar conta</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="words"
              autoComplete="given-name"
              value={firstName}
              placeholder="Digite seu nome"
              placeholderTextColor={colors.dark.textSecondary}
              onChangeText={(firstName) => setFirstName(firstName)}
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Sobrenome</Text>
            <TextInput
              ref={lastNameRef}
              style={styles.input}
              autoCapitalize="words"
              autoComplete="family-name"
              value={lastName}
              placeholder="Digite seu sobrenome"
              placeholderTextColor={colors.dark.textSecondary}
              onChangeText={(lastName) => setLastName(lastName)}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              ref={emailRef}
              style={styles.input}
              autoCapitalize="none"
              autoComplete="email"
              value={emailAddress}
              placeholder="Digite seu email"
              placeholderTextColor={colors.dark.textSecondary}
              onChangeText={(email) => setEmailAddress(email)}
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
                placeholder="Digite sua senha"
                placeholderTextColor={colors.dark.textSecondary}
                secureTextEntry={!showPassword}
                onChangeText={(password) => setPassword(password)}
                returnKeyType="done"
                onSubmitEditing={onSignUpPress}
                blurOnSubmit={false}
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
            onPress={onSignUpPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.dark.primary} />
                <Text style={styles.primaryButtonText}>Criando conta...</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Continuar</Text>
            )}
          </TouchableOpacity>

          <Link href="/sign-in" style={styles.link}>
            <Text style={styles.linkText}>
              Já possui uma conta?{" "}
              <Text style={styles.linkTextBold}>Entrar</Text>
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
  subHeaderText: {
    fontFamily: "DMSans",
    fontWeight: "400",
    fontSize: 16,
    textAlign: "center",
    color: colors.dark.textSecondary,
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
    gap: 16,
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  otpInput: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 16,
    width: 48,
    height: 56,
    fontSize: 24,
    fontFamily: "DMSans",
    fontWeight: "600",
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.dark.border,
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
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "DMSans",
    fontWeight: "600",
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
