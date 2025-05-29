import Icon from "@/components/Icon";
import { Switch } from "@/components/ui/switch";
import { colors } from "@/constants/Colors";
import { usePaymentMethodStore } from "@/stores/paymentMethodStore";
import { PaymentMethod } from "@/types/paymentMethod";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { paymentMethods, isLoading, error, loadPaymentMethods, updatePaymentMethod, clearError } = usePaymentMethodStore();

  useEffect(() => {
    loadPaymentMethods();
  }, [loadPaymentMethods]);

  useEffect(() => {
    if (error) {
      Alert.alert("Erro", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  const handleGoBack = () => {
    router.back();
  };

  const handleTogglePaymentMethod = async (paymentMethod: PaymentMethod) => {
    await updatePaymentMethod({
      id: paymentMethod.id,
      enabled: !paymentMethod.enabled,
    });
  };

  const renderPaymentMethodItem = ({ item }: { item: PaymentMethod }) => (
    <View className="py-4 mb-3 flex-row items-center justify-between">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-xl justify-center items-center mr-3 bg-neutral-900">
          <Icon name={item.icon as any} size={20} color={colors.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white" style={{ fontFamily: "DMSans" }}>
            {item.name}
          </Text>
        </View>
      </View>
      <Switch className="shadow-none!" checked={item.enabled} onCheckedChange={() => handleTogglePaymentMethod(item)} />
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-8 mt-16">
      <Icon name="Wallet" size={48} color={colors.dark.textSecondary} />
      <Text className="text-xl font-semibold text-white mt-4 mb-2 text-center" style={{ fontFamily: "DMSans" }}>
        Nenhuma forma de pagamento encontrada
      </Text>
      <Text className="text-base font-normal text-center leading-6" style={{ fontFamily: "DMSans", color: colors.dark.textSecondary }}>
        Suas formas de pagamento aparecerão aqui
      </Text>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.dark.primary }}>
      <SafeAreaView className="flex-1 px-5 pt-5">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity className="p-1 -ml-2" onPress={handleGoBack}>
              <Icon name="ChevronLeft" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-white" style={{ fontFamily: "DMSans" }}>
              Formas de Pagamento
            </Text>
            <Text className="text-sm font-normal mt-0.5" style={{ fontFamily: "DMSans", color: colors.dark.textSecondary }}>
              Ative ou desative suas formas de pagamento
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1">
          {isLoading ? (
            <View className="flex-1 justify-center items-center gap-4">
              <ActivityIndicator size="small" color={colors.primary} />
              <Text className="text-base font-medium" style={{ fontFamily: "DMSans", color: colors.dark.textSecondary }}>
                Carregando formas de pagamento...
              </Text>
            </View>
          ) : (
            <FlatList
              data={paymentMethods}
              renderItem={renderPaymentMethodItem}
              keyExtractor={(item) => item.id}
              className="flex-grow pb-5"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
