import { AuthContext } from "@/context/AuthProvider";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function Preload() {
    const { login, recuperaCredencialnaCache } = useContext<any>(AuthContext);

    async function entrar() {
        const dados = await recuperaCredencialnaCache()
        if (!dados) {
            router.replace("/entrar");
            return;
        }
        const response = await login(dados);
        if (response.sucesso) {
            router.replace("/(tabs)/home");
        } else {
            router.replace("/entrar");
        }
    }

    useEffect(() => {
        entrar()
    }, []);


    return (
        <View>
            <Text> Loading...</Text>
        </View>
    );
}