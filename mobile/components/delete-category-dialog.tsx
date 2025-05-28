import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { colors } from "@/constants/Colors";
import { useCategoryStore } from "@/stores/categoryStore";
import { Category } from "@/types/category";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DeleteCategoryDialogProps {
  visible: boolean;
  onClose: () => void;
  category: Category | null;
}

export const DeleteCategoryDialog = ({ visible, onClose, category }: DeleteCategoryDialogProps) => {
  const { deleteCategory } = useCategoryStore();

  const handleDelete = async () => {
    if (!category) return;

    await deleteCategory(category.id);
    onClose();
  };

  if (!category) return null;

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="min-w-[90vw] max-w-md bg-neutral-900 border-none! rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">Excluir Categoria</DialogTitle>
        </DialogHeader>

        <View style={styles.content}>
          <Text className="text-white leading-relaxed">Esta ação não pode ser desfeita. A categoria será permanentemente removida.</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  categoryPreview: {
    borderRadius: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: "DMSans",
    fontWeight: "600",
    color: colors.white,
    marginBottom: 4,
  },

  warningContainer: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  warningText: {
    fontSize: 14,
    fontFamily: "DMSans",
    fontWeight: "500",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.dark.tertiary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "DMSans",
    fontWeight: "600",
    color: colors.white,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: "DMSans",
    fontWeight: "600",
    color: colors.white,
  },
});
