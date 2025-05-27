import Icon from "@/components/Icon";
import { colors } from "@/constants/Colors";
import "@/global.css";
import { Tabs } from "expo-router";
import { icons } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS: { name: string; label: string; icon: keyof typeof icons }[] = [
  { name: "index", label: "Início", icon: "House" },
  { name: "goals", label: "Metas", icon: "Target" },
  { name: "add", label: "Adicionar", icon: "SquarePlus" },
  { name: "transactions", label: "Transações", icon: "ChartSpline" },
  { name: "profile", label: "Perfil", icon: "User" },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const inset = insets.bottom - 10;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          paddingBottom: inset,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#999999",
        tabBarShowLabel: false,
        //@ts-ignore
        tabBarButton: (props) => <Pressable {...props} android_ripple={null} />,
      }}
    >
      {TABS?.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, focused }) => (
              <View
                className={`flex p-2.5 rounded-xl ${
                  focused ? "bg-blue-600" : "bg-transparent"
                }`}
              >
                <Icon name={tab.icon} size={24} color={color} />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.backgroundColor,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
});
