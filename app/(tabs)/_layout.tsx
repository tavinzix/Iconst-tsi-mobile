import { Tabs } from 'expo-router';
import { Icon } from "react-native-paper";
import tema from "@/utils/tema";

export default function TabsLayout() {
    return (
        <Tabs initialRouteName='home'>
            <Tabs.Screen name="home" options={{
                title: "Home",
                tabBarIcon: ({ color }) => (
                    <Icon
                        source="home"
                        size={20}
                        color={tema.colors.primary}
                    />
                ),
            }} />
            <Tabs.Screen name="pedidos" options={{
                title: "Pedidos",
                tabBarIcon: ({ color }) => (
                    <Icon
                        source="receipt-text-outline"
                        size={20}
                        color={tema.colors.primary}
                    />
                ),
            }} />
            <Tabs.Screen name="perfilUsuario" options={{
                title: "Perfil do Usuário",
                tabBarIcon: ({ color }) => (
                    <Icon
                        source="account"
                        size={20}
                        color={tema.colors.primary}
                    />
                ),
            }} />
        </Tabs>
    );
}