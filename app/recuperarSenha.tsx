import { useEffect, useState } from "react";
import { Text, View } from "react-native";
// import { useApi } from "@/context/AuthProvider";

export default function RecuperarSenhaScreen() {

    // const { getHello } = useApi();
    // const [resultado, setResultado] = useState("");

    // useEffect(() => {
    //     async function carregar() {
    //         const data = await getHello();
    //         setResultado(data);
    //     }

    //     carregar();
    // }, []);

    return (
        <View>
            <Text>Testando conexão com API...</Text>
            {/* <Text>{resultado}</Text> */}
        </View>
    );
}