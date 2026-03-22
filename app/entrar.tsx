import { AuthContext } from "@/context/AuthProvider"
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, ScrollView, StyleSheet, useColorScheme, View, } from "react-native";
import { Button, Dialog, Divider, Text, TextInput, useTheme, } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatarCPF } from '@/utils/formatar';
import tema from "@/utils/tema"

const requiredMessage = "Campo obrigatório";
const schema = yup.object().shape({
    cpf: yup.string().required("Campo obrigatório").length(11, "CPF inválido"),
    senha: yup.string().required(requiredMessage),
});

export default function Entrar() {
    const [cpfFormatado, setCpfFormatado] = useState("");

    const theme = useTheme();
    const colorScheme = useColorScheme();
    const { login } = useContext<any>(AuthContext);
    const [exibirSenha, setExibirSenha] = useState(true);
    const [logando, setLogando] = useState(false);
    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [mensagemDialog, setMensagemDialog] = useState("");
    const { control, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            cpf: "",
            senha: "",
        },
        mode: "onSubmit",
        resolver: yupResolver(schema)
    });

    async function entrar(data: any) {
        setLogando(true);
        const response = await login(data);
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
            <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }} >
                <ScrollView>
                    <Image style={styles.image}
                        source={colorScheme === "dark" ? require("../assets/images/logoBranco.png") : require("../assets/images/logo.png")} />
                    <Controller
                        name="cpf"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.textinput}
                                label="CPF"
                                placeholder="000.000.000-00"
                                mode="outlined"
                                keyboardType="numeric"
                                value={cpfFormatado || value}
                                onChangeText={(text) => {
                                    const { formatado, numeros } = formatarCPF(text);
                                    setCpfFormatado(formatado);
                                    onChange(numeros);
                                }}
                                maxLength={14}
                            />
                        )}
                    />
                    {errors.cpf && (
                        <Text style={{ ...styles.textError, color: theme.colors.error }}>
                            {errors.cpf?.message?.toString()}
                        </Text>
                    )}

                    <Controller
                        name="senha"
                        control={control}
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
                                        icon={exibirSenha ? "eye" : "eye-off"}
                                        color={
                                            exibirSenha
                                                ? theme.colors.onBackground
                                                : theme.colors.primary
                                        }
                                        onPress={() => setExibirSenha((previus) => !previus)}
                                    />
                                }
                            />
                        )}
                    />
                    {errors.senha && (
                        <Text style={{ ...styles.textError, color: theme.colors.error }}>
                            {errors.senha?.message?.toString()}
                        </Text>
                    )}

                    <Text variant="labelMedium" onPress={() => router.push("/(tabs)/home")} style={{ ...styles.textEsqueceuSenha }}>
                        Esqueceu sua senha?
                    </Text>

                    <Button style={styles.button} mode="contained" onPress={handleSubmit(entrar)} loading={logando} disabled={logando} >
                        {!logando ? "Entrar" : "Entrando"}
                    </Button>

                    <Divider />

                    <View style={styles.divCadastro}>
                        <Text variant="labelMedium">Não tem uma conta? </Text>
                        <Text variant="labelMedium" onPress={() => router.push("/cadastrarUsuario")}
                         style={{ ...styles.textCadastro }} >
                            Cadastre-se.
                        </Text>
                    </View>
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
        marginTop: 20,
        marginBottom: 30,
        backgroundColor: tema.colors.primary,
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
    textCadastro: {
        fontSize:15,
        fontFamily: tema.fonts.primary,
        color: tema.colors.primary_dark
    },
    textEsqueceuSenha: {
        alignSelf: "flex-end",
        marginTop: 20,
        fontSize:15,
        fontFamily: tema.fonts.primary,
        color: tema.colors.primary_dark
    },
});