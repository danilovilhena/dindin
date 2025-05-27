import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import Icon from "@/components/Icon";
import { colors } from "@/constants/Colors";

export default function PersonalDataScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  // Refs for navigation between inputs
  const lastNameRef = useRef<TextInput>(null);

  const handleGoBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Erro", "Nome e sobrenome são obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setIsLoading(false);
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack} disabled={isLoading}>
            <Icon name="ChevronLeft" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Dados Pessoais</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              placeholder="Digite seu nome"
              placeholderTextColor={colors.dark.textSecondary}
              onChangeText={setFirstName}
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
              value={lastName}
              placeholder="Digite seu sobrenome"
              placeholderTextColor={colors.dark.textSecondary}
              onChangeText={setLastName}
              returnKeyType="next"
              onSubmitEditing={() => handleSave()}
              blurOnSubmit={false}
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} onPress={handleSave} disabled={isLoading}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.dark.primary} />
                <Text style={styles.saveButtonText}>Salvando...</Text>
              </View>
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
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
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 4,
    zIndex: 1,
  },
  headerText: {
    fontFamily: "DMSans",
    fontWeight: "700",
    fontSize: 24,
    color: colors.white,
    textAlign: "center",
    flex: 1,
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
  disabledInput: {
    backgroundColor: colors.dark.tertiary,
    color: colors.dark.textSecondary,
  },
  helperText: {
    fontSize: 12,
    fontFamily: "DMSans",
    fontWeight: "400",
    color: colors.dark.textTertiary,
    marginLeft: 4,
    marginTop: 4,
  },
  bottomSection: {
    paddingTop: 20,
  },
  saveButton: {
    backgroundColor: colors.blue,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
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
});
