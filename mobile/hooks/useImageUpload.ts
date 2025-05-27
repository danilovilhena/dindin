import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState<"pick" | "take" | false>(false);
  const { user } = useUser();

  const pickImage = async (): Promise<string | null> => {
    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        // alert("Permissão para acessar a galeria é necessária!");
        return null;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error("Error picking image:", error);
      // alert("Erro ao selecionar imagem");
      return null;
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      // Request permission to access camera
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permissão para acessar a câmera é necessária!");
        return null;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error("Error taking photo:", error);
      // alert("Erro ao tirar foto");
      return null;
    }
  };

  const uploadImage = async (imageUri: string, source: "pick" | "take"): Promise<boolean> => {
    if (!user) {
      // alert("Usuário não encontrado");
      return false;
    }

    setIsUploading(source);

    try {
      // Get file extension from URI
      const fileExtension = imageUri.split(".").pop() || "jpg";
      const fileName = `avatar.${fileExtension}`;

      // Create file object for React Native
      const file = {
        uri: imageUri,
        type: `image/${fileExtension}`,
        name: fileName,
      } as any;

      // Upload image to Clerk
      await user.setProfileImage({ file });

      // Reload user data to get updated image URL
      await user.reload();

      // alert("Foto do perfil atualizada com sucesso!");
      return true;
    } catch (error) {
      console.error("Error uploading image:", error);
      // alert("Erro ao fazer upload da imagem");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    pickImage,
    takePhoto,
    uploadImage,
    isUploading,
  };
};
