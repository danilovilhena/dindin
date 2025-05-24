import { colors } from "@/mobile/constants/Colors";
import Feather from "@react-native-vector-icons/feather";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
          display: "none",
        },
        tabBarActiveTintColor: colors.textColor,
        tabBarInactiveTintColor: "#999999",
        //@ts-ignore
        tabBarButton: (props) => <Pressable {...props} android_ripple={null} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: "Metas",
          tabBarIcon: ({ color }) => (
            <Feather name="target" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transações",
          tabBarIcon: ({ color }) => (
            <Feather name="credit-card" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
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
  tabBarLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
  },
  iconContainer: {
    position: "relative",
    width: 24,
    height: 24,
    alignItems: "center",
  },
  comingSoonBadge: {
    position: "absolute",
    top: -20,
    backgroundColor: colors.textColor,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },
  comingSoonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "DMSans_700Bold",
  },
});
