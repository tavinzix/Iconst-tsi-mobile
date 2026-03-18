import { Stack, Tabs } from 'expo-router';
import { Icon, useTheme } from "react-native-paper";

export default function TabsLayout() {

    return (
        <Tabs initialRouteName='home'>
            <Tabs.Screen name="home" options={{
                title: "Home",
                tabBarIcon: ({ color }) => (
                    <Icon
                        source="account-group"
                        size={20}
                    />
                ),
            }} />
            <Tabs.Screen name="pagina2" />
        </Tabs>
    );
}

