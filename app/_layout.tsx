import { AuthProvider } from '@/context/AuthProvider';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import tema from '@/utils/tema';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '@/context/UserProvider';

const themeLight = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: tema.colors.primary,
        primaryDark: tema.colors.primary_dark,
        white: tema.colors.white,
        black: tema.colors.black,
        onPrimary: tema.colors.white,
    },
};

const themeDark = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: tema.colors.primary,
        primaryDark: tema.colors.primary_dark,
        white: tema.colors.white,
        black: tema.colors.black,
        onPrimary: tema.colors.white,
    },
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <PaperProvider theme={colorScheme === "dark" ? themeDark : themeLight}>
            <AuthProvider>
                <UserProvider>
                    <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

                    <Stack initialRouteName='entrar'
                        screenOptions={{
                            headerShown: false,
                        }}>
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="entrar" />
                        <Stack.Screen name="cadastrarUsuario" />
                    </Stack>
                </UserProvider>
            </AuthProvider>
        </PaperProvider>
    );
}

