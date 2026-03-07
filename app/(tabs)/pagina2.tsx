import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Pagina2() {
    return (
    <SafeAreaView style={styles.container}>
        <Text>Pagina2</Text>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})