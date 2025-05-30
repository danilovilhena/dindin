import { CategoryFormDialog } from "@/components/category-form-dialog";
import { DeleteCategoryDialog } from "@/components/delete-category-dialog";
import Icon from "@/components/Icon";
import { colors } from "@/constants/Colors";
import { useCategoryStore } from "@/stores/categoryStore";
import { Category, CATEGORY_COLORS } from "@/types/category";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoriesScreen() {
  const router = useRouter();
  const { categories, isLoading, error, clearError } = useCategoryStore();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (error) {
      Alert.alert("Erro", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  const handleGoBack = () => {
    router.back();
  };

  const handleAddCategory = () => {
    setShowAddDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = (category: Category) => {
    setDeletingCategory(category);
  };

  const handleCategoryPress = (category: Category) => {
    setEditingCategory(category);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity onPress={() => handleCategoryPress(item)}>
      <View className="py-2 mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-xl justify-center items-center mr-3" style={{ backgroundColor: CATEGORY_COLORS[item.color] }}>
            <Icon name={item.icon as any} size={20} color={colors.white} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-white mb-0.5" style={{ fontFamily: "DMSans" }}>
              {item.name}
            </Text>
            <View className="flex-row items-center gap-1">
              <Icon name={item.type === "gasto" ? "Minus" : "Plus"} size={16} color={item.type === "gasto" ? "#f87171" : "#4ade80"} />
              <Text className={`text-sm font-normal ${item.type === "gasto" ? "text-red-400" : "text-green-400"}`} style={{ fontFamily: "DMSans" }}>
                {item.type === "gasto" ? "Gasto" : "Receita"}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row gap-0">
          <TouchableOpacity className="p-2 rounded-lg" onPress={() => handleEditCategory(item)}>
            <Icon name="Pencil" size={16} color={colors.dark.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 rounded-lg" onPress={() => handleDeleteCategory(item)}>
            <Icon name="Trash2" size={16} color={colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-8 mt-16">
      <Icon name="Tags" size={48} color={colors.dark.textSecondary} />
      <Text className="text-xl font-semibold text-white mt-4 mb-2 text-center" style={{ fontFamily: "DMSans" }}>
        Nenhuma categoria encontrada
      </Text>
      <Text className="text-base font-normal text-center leading-6" style={{ fontFamily: "DMSans", color: colors.dark.textSecondary }}>
        Crie sua primeira categoria para organizar suas despesas
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
              Categorias
            </Text>
            <Text className="text-sm font-normal mt-0.5" style={{ fontFamily: "DMSans", color: colors.dark.textSecondary }}>
              Gerencie suas categorias de despesas
            </Text>
          </View>
          <TouchableOpacity className="p-2 rounded-xl" onPress={handleAddCategory}>
            <Icon name="Plus" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1">
          {isLoading ? (
            <View className="flex-1 justify-center items-center gap-4">
              <ActivityIndicator size="small" color={colors.primary} />
              <Text className="text-base font-medium" style={{ fontFamily: "DMSans", color: colors.dark.textSecondary }}>
                Carregando categorias...
              </Text>
            </View>
          ) : (
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              className="flex-grow pb-5"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
            />
          )}
        </View>

        {/* Dialogs */}
      </SafeAreaView>
      <CategoryFormDialog visible={showAddDialog} onClose={() => setShowAddDialog(false)} mode="create" />
      <CategoryFormDialog visible={!!editingCategory} onClose={() => setEditingCategory(null)} mode="edit" category={editingCategory} />
      <DeleteCategoryDialog visible={!!deletingCategory} onClose={() => setDeletingCategory(null)} category={deletingCategory} />
    </View>
  );
}
