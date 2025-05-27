import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@clerk/clerk-expo";
import { useUser } from "@clerk/clerk-expo";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@/components/Icon";
import { useMemo } from "react";
import { icons } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();

  const userName = useMemo(() => user?.fullName || `${user?.firstName} ${user?.lastName}` || "Usuário", [user?.fullName, user?.firstName, user?.lastName]);

  const handleUpdateData = () => {
    router.push("/personal-data");
  };

  const handleCategories = () => {
    // TODO: Navigate to categories screen
    console.log("Categorias");
  };

  const handlePaymentMethods = () => {
    // TODO: Navigate to payment methods screen
    console.log("Formas de Pagamento");
  };

  const handleSettings = () => {
    // TODO: Navigate to settings screen
    console.log("Configurações");
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirectUrl: "/" });
      router.replace("../");
    } catch (error) {
      console.error(error);
    }
  };

  const BUTTONS: { label: string; icon: keyof typeof icons; onPress: () => void }[] = [
    { label: "Dados Pessoais", icon: "User", onPress: handleUpdateData },
    { label: "Categorias", icon: "Tags", onPress: handleCategories },
    { label: "Formas de Pagamento", icon: "Wallet", onPress: handlePaymentMethods },
    { label: "Configurações", icon: "Settings", onPress: handleSettings },
  ];

  return (
    <SafeAreaView className="flex-1 p-6 bg-[#121212]">
      <View className="flex gap-8 items-center mb-12">
        <UserAvatar user={user} enableUpload={true} />
        <Text className="text-white text-4xl font-bold text-center">{userName}</Text>
      </View>

      {/* Button Group */}
      <View className="flex-1">
        {BUTTONS?.map((button, index) => (
          <TouchableOpacity key={index} onPress={button.onPress} className={cn("py-4 flex-row items-center justify-between")}>
            <View className="flex-row items-center">
              <View className="bg-neutral-900 p-3 rounded-xl mr-4">
                <Icon name={button.icon as any} size={20} color="#2B7FFF" />
              </View>
              <Text className="text-white text-lg font-semibold">{button.label}</Text>
            </View>
            <Icon name="ChevronRight" size={20} color="#B0B0B0" />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={handleLogout} className="flex-row justify-center items-center gap-4 py-4">
        <Icon name="LogOut" size={20} color="#f87171" />
        <Text className="text-red-400 text-lg font-medium">Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
