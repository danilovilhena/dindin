import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserResource } from "@clerk/types";
import { Text, TouchableOpacity, View } from "react-native";
import { AvatarUploadDialog } from "./avatar-upload-dialog";
import Icon from "@/components/Icon";

interface UserAvatarProps {
  user: UserResource | null | undefined;
  enableUpload?: boolean;
}

export const UserAvatar = ({ user, enableUpload = false }: UserAvatarProps) => {
  if (!user) return null;

  const avatarContent = (
    <View className="relative">
      <Avatar alt={user?.fullName ?? ""} className="size-24">
        <AvatarFallback>
          <Text>
            {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
          </Text>
        </AvatarFallback>
        <AvatarImage source={{ uri: user?.imageUrl }} />
      </Avatar>
    </View>
  );

  if (enableUpload) {
    return (
      <AvatarUploadDialog>
        <TouchableOpacity activeOpacity={0.8}>{avatarContent}</TouchableOpacity>
      </AvatarUploadDialog>
    );
  }

  return avatarContent;
};
