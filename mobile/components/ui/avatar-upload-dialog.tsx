import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import Icon from "@/components/Icon";
import { useImageUpload } from "@/hooks/useImageUpload";

interface AvatarUploadDialogProps {
  children: React.ReactNode;
  onUploadSuccess?: () => void;
}

export const AvatarUploadDialog = ({ children, onUploadSuccess }: AvatarUploadDialogProps) => {
  const { pickImage, takePhoto, uploadImage, isUploading } = useImageUpload();

  const handlePickFromGallery = async () => {
    try {
      const imageUri = await pickImage();
      if (imageUri) {
        const success = await uploadImage(imageUri, "pick");
        if (success) onUploadSuccess?.();
      }
    } catch (error) {
      console.error("Error picking from gallery:", error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const imageUri = await takePhoto();
      if (imageUri) {
        const success = await uploadImage(imageUri, "take");
        if (success) onUploadSuccess?.();
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="bg-neutral-950 border-neutral-800 overflow-hidden shadow-2xl rounded-2xl mt-2 p-0">
        <View className="gap-0">
          <TouchableOpacity
            onPress={handlePickFromGallery}
            disabled={isUploading === "pick"}
            className="flex-row items-center p-3 bg-neutral-900 rounded-lg active:bg-neutral-800 border-b border-neutral-800 rounded-b-none"
          >
            <View className="bg-neutral-800 p-2 rounded-lg mr-3">
              <Icon name="Image" size={18} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-base font-medium">Escolher da Galeria</Text>
            </View>
            {isUploading === "pick" && <ActivityIndicator size="small" color="#6B7280" />}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleTakePhoto}
            disabled={isUploading === "take"}
            className="flex-row items-center p-3 bg-neutral-900 rounded-lg active:bg-neutral-800 rounded-t-none"
          >
            <View className="bg-neutral-800 p-2 rounded-lg mr-3">
              <Icon name="Camera" size={18} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-base font-medium">Tirar Foto</Text>
            </View>
            {isUploading === "take" && <ActivityIndicator size="small" color="#6B7280" />}
          </TouchableOpacity>
        </View>
      </PopoverContent>
    </Popover>
  );
};
