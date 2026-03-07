import { router } from "expo-router";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Entrar() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Entrar</Text>
            <TouchableHighlight 
            onPress={() => {
                router.push("/(tabs)/home")
                }}>
                <Text>Aqui</Text>
            </TouchableHighlight>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})