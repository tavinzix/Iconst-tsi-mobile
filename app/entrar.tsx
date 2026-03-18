import { AuthContext } from "@/context/AuthProvider"
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, SafeAreaView, ScrollView, StyleSheet, View, } from "react-native";
import { Button, Dialog, Divider, Text, TextInput, useTheme, } from "react-native-paper";
import { StatusBar } from 'expo-status-bar';
import tema from "@/utils/tema"
const requiredMessage = "Campo obrigatório";

/*
  /^
  (?=.*\d)              // deve conter ao menos um dígito
  (?=.*[a-z])           // deve conter ao menos uma letra minúscula
  (?=.*[A-Z])           // deve conter ao menos uma letra maiúscula
  (?=.*[$*&@#])         // deve conter ao menos um caractere especial
  [0-9a-zA-Z$*&@#]{8,}  // deve conter ao menos 8 dos caracteres mencionados
$/
*/

export default function Entrar() {
    const theme = useTheme();
    const { login } = useContext<any>(AuthContext);
    const [exibirSenha, setExibirSenha] = useState(true);
    const [logando, setLogando] = useState(false);
    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [mensagemDialog, setMensagemDialog] = useState("");
    const {
        control,
        handleSubmit,
    } = useForm<any>({
        defaultValues: {
            cpf: "",
            senha: "",
        },
        mode: "onSubmit"
    });

    async function entrar(data: any) {
        setLogando(true);
        const response = await login(data);
        console.log(response)
        if (response.sucesso) {
            setLogando(false);
            router.replace("/(tabs)/home");
        } else {
            setMensagemDialog(response.mensagem);
            setDialogVisivel(true);
            setLogando(false);
        }
    }

    return (
        <>
            <StatusBar style="dark" />

            <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }} >
                <ScrollView>
                    <>
                        <Image
                            style={styles.image}
                            source={require("../assets/images/logo.png")}
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.textinput}
                                    label="CPF"
                                    placeholder="Digite seu cpf"
                                    mode="outlined"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="cpf"
                        />
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.textinput}
                                    label="Senha"
                                    placeholder="Digite sua senha"
                                    mode="outlined"
                                    autoCapitalize="none"
                                    returnKeyType="go"
                                    secureTextEntry={exibirSenha}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    right={
                                        <TextInput.Icon
                                            icon="eye"
                                            color={
                                                exibirSenha
                                                    ? theme.colors.onBackground
                                                    : theme.colors.error
                                            }
                                            onPress={() => setExibirSenha((previus) => !previus)}
                                        />
                                    }
                                />
                            )}
                            name="senha"
                        />

                        <Text
                            style={{
                                ...styles.textEsqueceuSenha,
                                color: theme.colors.tertiary,
                            }}
                            variant="labelMedium"
                            onPress={() => router.push("/(tabs)/home")}
                        >
                            Esqueceu sua senha?
                        </Text>
                        <Button
                            style={styles.button}
                            mode="contained"
                            onPress={handleSubmit(entrar)}
                            loading={logando}
                            disabled={logando}
                        >
                            {!logando ? "Entrar" : "Entrando"}
                        </Button>
                        <Divider />
                        <View style={styles.divCadastro}>
                            <Text variant="labelMedium">Não tem uma conta?</Text>
                            <Text
                                style={{ ...styles.textCadastro, color: theme.colors.tertiary }}
                                variant="labelMedium"
                                onPress={() => router.push("/cadastrarUsuario")}
                            >
                                {" "}
                                Cadastre-se.
                            </Text>
                        </View>
                    </>
                </ScrollView>
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
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    image: {
        width: 350,
        height: 100,
        marginTop: 100,
        marginBottom: 40,
        objectFit: "fill"
    },
    textinput: {
        width: 350,
        height: 50,
        marginTop: 20,
        backgroundColor: "transparent",
    },
    button: {
        marginTop: 50,
        marginBottom: 30,
        backgroundColor: tema.colors.primary
    },
    textDialog: {
        textAlign: "center",
    },
    textError: {
        width: 350,
    },
    divCadastro: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
    },
    textCadastro: {},
    textEsqueceuSenha: {
        alignSelf: "flex-end",
        marginTop: 20,
    },
});