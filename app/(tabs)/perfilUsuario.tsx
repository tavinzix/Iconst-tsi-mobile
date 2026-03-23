import { AuthContext } from "@/context/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Dialog, useTheme, Text } from "react-native-paper";
import { router } from "expo-router";
import { UserContext } from "@/context/UserProvider";

export default function PerfilUsuario() {
    const { user, imagemUsuario } = useContext<any>(AuthContext)
    const { userInfo, loadingUser } = useContext<any>(UserContext);
    const theme = useTheme();
    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [mensagemDialog, setMensagemDialog] = useState("");

    async function editaPerfil(formData: any) {
        router.navigate("/editarPerfilUsuario");
    }

    useEffect(() => {
        if (!user) {
            router.navigate("/entrar");
        }
    }, [user]);

    if (loadingUser) {
        return (
            <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }} >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Carregando informações do usuário...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }} >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <>
                        <Image style={styles.image} source={{ uri: imagemUsuario }} />
                        <Text>Nome: {userInfo?.nomeCompleto}</Text>
                        <Text>CPF: {userInfo?.cpf}</Text>
                        <Text>Email: {userInfo?.email}</Text>
                        <Text>Telefone: {userInfo?.telefone}</Text>
                        <Button mode="contained" onPress={editaPerfil} >
                            Editar perfil
                        </Button>

                    </>
                </ScrollView>
            </KeyboardAvoidingView>

            <Dialog visible={dialogVisivel} onDismiss={() => setDialogVisivel(false)}>
                <Dialog.Icon icon="alert-circle-outline" size={60} />
                <Dialog.Title style={styles.textDialog}>Erro</Dialog.Title>
                <Dialog.Content>
                    <Text style={styles.textDialog} variant="bodyLarge">
                        {mensagemDialog}
                    </Text>
                </Dialog.Content>
            </Dialog>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        width: 350,
        height: 100,
        marginTop: 100,
        marginBottom: 40,
        objectFit: "fill",
        borderRadius: 50
    },
    formContainer: {
        width: "100%",
        maxWidth: 500,
        padding: 10,
        borderRadius: 16,
        gap: 6,
    },
    textDialog: {
        textAlign: "center",
    },
    textError: {
        width: 350,
    },
    button: {
        marginTop: 30,
        width: "100%",
        height: 50,
        justifyContent: "center",
        borderRadius: 10
    },
})