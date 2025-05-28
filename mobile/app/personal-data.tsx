import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import Icon from "@/components/Icon";
import { Input } from "@/components/ui/input";
import { colors } from "@/constants/Colors";

export default function PersonalDataScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  // Refs for navigation between inputs
  const lastNameRef = useRef<any>(null);

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
    <View className="flex-1" style={{ backgroundColor: colors.dark.primary }}>
      <SafeAreaView className="flex-1 px-5 pt-5">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity className="p-1 -ml-2" onPress={handleGoBack} disabled={isLoading}>
              <Icon name="ChevronLeft" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-white" style={{ fontFamily: "DMSans" }}>
              Dados Pessoais
            </Text>
            <Text className="text-sm font-normal mt-0.5" style={{ fontFamily: "DMSans", color: colors.dark.textSecondary }}>
              Gerencie suas informações pessoais
            </Text>
          </View>
        </View>

        {/* Form Container */}
        <View className="flex-1 gap-6">
          <View className="gap-2">
            <Text className="text-sm font-medium ml-1" style={{ fontFamily: "DMSans", color: colors.dark.textSecondary }}>
              Nome
            </Text>
            <Input
              value={firstName}
              placeholder="Digite seu nome"
              onChangeText={setFirstName}
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isLoading}
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium ml-1" style={{ fontFamily: "DMSans", color: colors.dark.textSecondary }}>
              Sobrenome
            </Text>
            <Input
              ref={lastNameRef}
              value={lastName}
              placeholder="Digite seu sobrenome"
              onChangeText={setLastName}
              returnKeyType="next"
              onSubmitEditing={() => handleSave()}
              blurOnSubmit={false}
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Save Button */}
        <View className="pt-5">
          <TouchableOpacity
            className={`py-4 px-8 rounded-xl w-full items-center ${isLoading ? "opacity-60" : ""}`}
            style={{ backgroundColor: colors.primary }}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" color={colors.white} />
                <Text className="text-white text-base font-semibold" style={{ fontFamily: "DMSans" }}>
                  Salvando...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-base font-semibold" style={{ fontFamily: "DMSans" }}>
                Salvar Alterações
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
