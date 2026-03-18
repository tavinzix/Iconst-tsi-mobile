import { AuthContext } from "@/context/AuthProvider";
import { router } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    const {logout, user} = useContext<any>(AuthContext)

    async function sair(){
        const resultado = await logout();
        if(resultado.sucesso){
            router.replace('/entrar')
        }else{
        }
    }

    return (
    <SafeAreaView style={styles.container}>
        <Text>Home</Text>

            <Button
                // style={styles.button}
                // mode="contained"
                // onPress={handleSubmit(entrar)}
                // loading={logando}
                // disabled={logando}
                onPress={sair}
            >
                SAir
            </Button>

        <Text>Home</Text>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})