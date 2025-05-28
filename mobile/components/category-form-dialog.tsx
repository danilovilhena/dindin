import Icon from "@/components/Icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { colors } from "@/constants/Colors";
import { useCategoryStore } from "@/stores/categoryStore";
import { Category, CATEGORY_COLORS, CategoryColor, LucideIconName, ExpenseType } from "@/types/category";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CategoryFormDialogProps {
  visible: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  category?: Category | null;
}

// Curated list of popular and useful icons for categories
const POPULAR_ICONS: LucideIconName[] = [
  "ShoppingCart",
  "Car",
  "House",
  "Utensils",
  "Heart",
  "Gamepad2",
  "GraduationCap",
  "Briefcase",
  "Plane",
  "Coffee",
  "Gift",
  "Music",
  "Camera",
  "Book",
  "Dumbbell",
  "Shirt",
  "Fuel",
  "Smartphone",
  "PiggyBank",
  "Calculator",
  "Stethoscope",
  "Wrench",
  "Palette",
  "TreePine",
  "Bus",
  "Brain",
  "Bike",
  "Building2",
  "Building",
  "Store",
  "Pizza",
  "Cake",
  "Wine",
  "Salad",
  "Apple",
  "Sandwich",
  "Monitor",
  "Headphones",
  "Keyboard",
  "Mouse",
  "Tablet",
  "Watch",
  "CircleDot",
  "Trophy",
  "Target",
  "Zap",
  "Star",
  "Crown",
  "Flower",
  "Sun",
  "Moon",
  "Cloud",
  "Umbrella",
  "Rainbow",
  "Dog",
  "Cat",
  "Fish",
  "Bird",
  "Bug",
  "Leaf",
  "Hammer",
  "Scissors",
  "Paintbrush",
  "Ruler",
  "Paperclip",
  "Pin",
  "MapPin",
  "Compass",
  "Globe",
  "Mountain",
  "Waves",
  "Tent",
  "Bed",
  "Sofa",
  "Lamp",
  "Key",
  "Lock",
  "Shield",
  "Users",
  "User",
  "Baby",
  "Glasses",
  "HardHat",
  "ShoppingBag",
  "Wallet",
  "CreditCard",
  "Receipt",
  "Coins",
];

// Organized colors by families - 16 colors organized in 2 rows of 8
const COLOR_OPTIONS: CategoryColor[] = [
  // Row 1: Warm colors
  "red",
  "rose",
  "pink",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  // Row 2: Cool colors and neutrals
  "emerald",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "purple",
  "gray",
];

export const CategoryFormDialog = ({ visible, onClose, mode, category }: CategoryFormDialogProps) => {
  const { createCategory, updateCategory } = useCategoryStore();

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<LucideIconName>("ShoppingCart");
  const [selectedColor, setSelectedColor] = useState<CategoryColor>("blue");
  const [selectedType, setSelectedType] = useState<ExpenseType>("gasto");

  // Get organized icons for better performance
  const displayIcons = useMemo(() => {
    if (mode === "edit" && category) {
      // Move selected icon to first position for edit mode
      const filtered = POPULAR_ICONS.filter((icon) => icon !== category.icon);
      return [category.icon, ...filtered];
    }

    return POPULAR_ICONS;
  }, [mode, category]);

  useEffect(() => {
    if (mode === "edit" && category) {
      setName(category.name);
      setSelectedIcon(category.icon);
      setSelectedColor(category.color);
      setSelectedType(category.type);
    } else {
      setName("");
      setSelectedIcon("ShoppingCart");
      setSelectedColor("blue");
      setSelectedType("gasto");
    }
  }, [mode, category, visible]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Nome da categoria é obrigatório");
      return;
    }

    if (mode === "create") {
      await createCategory({
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        type: selectedType,
      });
    } else if (mode === "edit" && category) {
      await updateCategory({
        id: category.id,
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        type: selectedType,
      });
    }
    onClose();
  };

  const renderExpenseTypeToggle = () => (
    <View className="mb-5">
      <Text className="text-sm font-medium text-neutral-400 mb-3 ml-1">Tipo</Text>
      <View className="flex-row bg-neutral-800 rounded-xl p-1">
        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg ${selectedType === "receita" ? "bg-green-600" : "bg-transparent"}`}
          onPress={() => setSelectedType("receita")}
        >
          <Icon name="Plus" size={18} color={selectedType === "receita" ? colors.white : colors.dark.textSecondary} />
          <Text className={`ml-2 font-medium ${selectedType === "receita" ? "text-white" : "text-neutral-400"}`}>Receita</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg ${selectedType === "gasto" ? "bg-red-500" : "bg-transparent"}`}
          onPress={() => setSelectedType("gasto")}
        >
          <Icon name="Minus" size={18} color={selectedType === "gasto" ? colors.white : colors.dark.textSecondary} />
          <Text className={`ml-2 font-medium ${selectedType === "gasto" ? "text-white" : "text-neutral-400"}`}>Gasto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderIconSelector = () => (
    <View className="mb-5">
      <Text className="text-sm font-medium text-neutral-400 mb-3 ml-1">Ícone</Text>
      <View className="h-[135px]">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 0 }}>
          <View className="flex-row flex-wrap justify-between items-center">
            {displayIcons.map((iconName) => (
              <TouchableOpacity
                key={iconName}
                className={`w-11 h-11 rounded-xl justify-center items-center mb-2 ${selectedIcon === iconName ? "bg-blue-500" : "bg-neutral-700"}`}
                onPress={() => setSelectedIcon(iconName)}
              >
                <Icon name={iconName as any} size={20} color={colors.white} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderColorSelector = () => (
    <View className="mb-5">
      <Text className="text-sm font-medium text-neutral-400 mb-3 ml-1">Cor</Text>
      <View className="flex-row flex-wrap gap-2 justify-between">
        {COLOR_OPTIONS.map((colorName, index) => (
          <TouchableOpacity
            key={colorName}
            className={`w-8 h-8 rounded-full justify-center items-center ${selectedColor === colorName ? "border-2 border-white" : ""} ${
              index === 7 ? "mr-0" : ""
            }`}
            style={{
              backgroundColor: CATEGORY_COLORS[colorName],
              marginRight: index % 8 === 7 ? 0 : 4,
              marginBottom: 8,
            }}
            onPress={() => setSelectedColor(colorName)}
          ></TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="min-w-[90vw] max-w-md bg-neutral-900 border-none! rounded-2xl max-h-fit">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">{mode === "create" ? "Nova Categoria" : "Editar Categoria"}</DialogTitle>
        </DialogHeader>

        <View className="max-h-fit">
          {/* Name Input */}
          <View className="mb-5">
            <Text style={styles.inputLabel}>Nome</Text>
            <Input value={name} placeholder="Digite o nome da categoria" onChangeText={setName} />
          </View>

          {/* Expense Type Toggle */}
          {renderExpenseTypeToggle()}

          {/* Icon Selector */}
          {renderIconSelector()}
          {/* Color Selector */}
          {renderColorSelector()}
          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-2">
            <TouchableOpacity className="flex-1 py-3.5 px-5 rounded-xl bg-neutral-800 items-center" onPress={onClose}>
              <Text className="text-base font-semibold text-white">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 py-3.5 px-5 rounded-xl items-center" style={{ backgroundColor: colors.primary }} onPress={handleSave}>
              <Text className="text-base font-semibold text-white">{mode === "create" ? "Criar" : "Salvar"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 14,
    fontFamily: "DMSans",
    fontWeight: "500",
    color: colors.dark.textSecondary,
    marginLeft: 4,
    marginBottom: 8,
  },
});
