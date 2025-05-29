import { CategoryFormDialog } from "@/components/category-form-dialog";
import Icon from "@/components/Icon";
import { Select } from "@/components/select";
import { Input } from "@/components/ui/input";
import { colors } from "@/constants/Colors";
import { useCategoryStore } from "@/stores/categoryStore";
import { usePaymentMethodStore } from "@/stores/paymentMethodStore";
import { Category, CATEGORY_COLORS } from "@/types/category";
import { PaymentMethod } from "@/types/paymentMethod";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddScreen() {
  const router = useRouter();
  const { categories, loadCategories } = useCategoryStore();
  const { paymentMethods, loadPaymentMethods } = usePaymentMethodStore();

  const [amount, setAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateMode, setDateMode] = useState<"today" | "yesterday" | "custom">("today");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  const enabledPaymentMethods = paymentMethods.filter((method) => method.enabled);
  const expenseCategories = categories.filter((category) => category.type === "gasto");
  const isFormValid = amount.trim() !== "" && selectedPaymentMethod !== null && selectedCategory !== null && expenseName.trim() !== "";

  const handleGoBack = () => {
    router.back();
  };

  const handleDateChange = (mode: "today" | "yesterday" | "custom") => {
    setDateMode(mode);

    if (mode === "today") {
      setSelectedDate(new Date());
    } else if (mode === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setSelectedDate(yesterday);
    } else {
      setDatePickerVisibility(true);
    }
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    setDateMode("custom");
    hideDatePicker();
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    // TODO: Implement expense creation
    Alert.alert("Sucesso", "Despesa adicionada com sucesso!", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  const formatAmount = (text: string) => {
    // Remove all non-numeric characters except comma
    const numericText = text.replace(/[^0-9,]/g, "");

    return numericText;
  };

  const renderPaymentMethodOption = (option: PaymentMethod) => (
    <>
      <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-neutral-700">
        <Icon name={option.icon as any} size={16} color={colors.primary} />
      </View>
      <Text className="text-white text-lg font-medium">{option.name}</Text>
    </>
  );

  const renderCategoryOption = (option: Category) => (
    <>
      <View className="w-8 h-8 rounded-lg justify-center items-center mr-3" style={{ backgroundColor: CATEGORY_COLORS[option.color] }}>
        <Icon name={option.icon as any} size={16} color={colors.white} />
      </View>
      <Text className="text-white text-base font-medium">{option.name}</Text>
    </>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.dark.primary }}>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5">
            <TouchableOpacity className="p-1 -ml-2" onPress={handleGoBack}>
              <Icon name="ChevronLeft" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white" style={{ fontFamily: "DMSans" }}>
              Adicionar Despesa
            </Text>
            <View className="w-6" />
          </View>

          <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
            {/* Amount Input */}
            <View className="mb-8 items-center justify-center">
              <View className="flex-row justify-center items-center relative w-full">
                <Text className="absolute left-0 top-7 text-3xl font-bold text-muted-foreground">R$</Text>
                <TextInput
                  className="text-5xl font-bold text-white text-center max-w-[75%]"
                  placeholder="0,00"
                  placeholderTextColor={colors.dark.textSecondary}
                  value={amount}
                  onChangeText={(text) => setAmount(formatAmount(text))}
                  keyboardType="decimal-pad"
                  style={{
                    fontFamily: "DMSans",
                    minWidth: 140,
                    lineHeight: 60,
                    includeFontPadding: false,
                  }}
                />
              </View>
            </View>

            {/* Payment Method Select */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-neutral-400 mb-3 ml-1">Forma de Pagamento</Text>
              <Select
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                options={enabledPaymentMethods}
                placeholder="Selecione a forma de pagamento"
                renderOption={renderPaymentMethodOption}
              />
            </View>

            {/* Category Select */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm font-medium text-neutral-400 ml-1">Categoria</Text>
                <TouchableOpacity className="w-8 h-8 rounded-lg justify-center items-center" onPress={() => setShowCategoryDialog(true)}>
                  <Icon name="Plus" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                options={expenseCategories}
                placeholder="Selecione a categoria"
                renderOption={renderCategoryOption}
                maxHeight={200}
              />
            </View>

            {/* Date Selection */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-neutral-400 mb-3 ml-1">Data</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                    dateMode === "today" ? "border-white bg-transparent" : "border-neutral-700 bg-neutral-800"
                  }`}
                  onPress={() => handleDateChange("today")}
                >
                  <Text className={`text-center font-medium ${dateMode === "today" ? "text-white" : "text-neutral-400"}`}>Hoje</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                    dateMode === "yesterday" ? "border-white bg-transparent" : "border-neutral-700 bg-neutral-800"
                  }`}
                  onPress={() => handleDateChange("yesterday")}
                >
                  <Text className={`text-center font-medium ${dateMode === "yesterday" ? "text-white" : "text-neutral-400"}`}>Ontem</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                    dateMode === "custom" ? "border-white bg-transparent" : "border-neutral-700 bg-neutral-800"
                  }`}
                  onPress={() => handleDateChange("custom")}
                >
                  <Text className={`text-center font-medium ${dateMode === "custom" ? "text-white" : "text-neutral-400"}`}>
                    {dateMode === "custom" ? selectedDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "Outro"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Expense Name Input */}
            <View className="mb-8">
              <Text className="text-sm font-medium text-neutral-400 mb-3 ml-1">Descrição</Text>
              <Input placeholder="Ex: Almoço no restaurante" value={expenseName} onChangeText={setExpenseName} />
            </View>
            {/* Submit Button */}
            <View className="pb-4">
              <TouchableOpacity
                className={`py-4 rounded-xl items-center ${isFormValid ? "opacity-100" : "opacity-50"}`}
                style={{ backgroundColor: colors.primary }}
                onPress={handleSubmit}
                disabled={!isFormValid}
              >
                <Text className="text-white text-lg font-bold">Adicionar Despesa</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Category Dialog */}
        <CategoryFormDialog visible={showCategoryDialog} onClose={() => setShowCategoryDialog(false)} mode="create" />

        {/* Date Picker Modal */}
        <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} />
      </SafeAreaView>
    </View>
  );
}
