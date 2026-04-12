import { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button, Dialog, TextInput, useTheme, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { UserContext } from "@/context/UserProvider";
import tema from "@/utils/tema";

export default function VerificarEmail() {
    const { email = "", cpf = "" } = useLocalSearchParams();
    const { verificarCodigoEmail, enviarCodigoVerificacao } = useContext<any>(UserContext);
    const theme = useTheme();

    const [codigo, setCodigo] = useState("");
    const [loading, setLoading] = useState(false);
    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [mensagemDialog, setMensagemDialog] = useState("");
    const [temporizador, setTemporizador] = useState(0);
    const [podeReenviar, setPodeReenviar] = useState(true);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (temporizador > 0) {
            interval = setInterval(() => {
                setTemporizador((t) => t - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [temporizador]);

    async function verificarCodigo() {
        if (codigo.length !== 6) {
            setMensagemDialog("Digite um código válido com 6 dígitos");
            setDialogVisivel(true);
            return;
        }

        setLoading(true);
        const cpfLimpo = String(cpf).replace(/\D/g, '');
        const response = await verificarCodigoEmail(cpfLimpo, codigo);

        if (response.sucesso) {
            setMensagemDialog("Email verificado com sucesso!");
            setDialogVisivel(true);
            setLoading(false);
            setTimeout(() => {
                router.replace("/entrar");
            }, 1500);
        } else {
            setMensagemDialog(response.mensagem || "Erro ao verificar o código");
            setDialogVisivel(true);
            setLoading(false);
        }
    }

    async function reenviarCodigo() {
        setLoading(true);
        setPodeReenviar(false);
        const cpfLimpo = String(cpf).replace(/\D/g, '');
        const response = await enviarCodigoVerificacao(email as string, cpfLimpo);

        if (response.sucesso) {
            setMensagemDialog("Código reenviado para seu email!");
            setDialogVisivel(true);
            setTemporizador(30);
        } else {
            setMensagemDialog(response.mensagem || "Erro ao reenviar o código");
            setDialogVisivel(true);
            setPodeReenviar(true);
        }
        setLoading(false);
    }

    return (
        <>
            <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }}>
                <Text variant="headlineMedium" style={styles.titulo}>
                    Verifique seu Email
                </Text>

                <Text variant="bodyMedium" style={styles.subtitulo}>
                    Enviamos um código para{"\n"}
                    <Text style={{ fontWeight: "bold" }}>{email}</Text>
                </Text>

                <Text variant="bodySmall" style={{ ...styles.subtitulo, marginTop: 16 }}>
                    Digite o código para ativar sua conta
                </Text>

                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.textinput}
                                label="Código de Verificação"
                                placeholder="000000"
                                mode="outlined"
                                keyboardType="number-pad"
                                maxLength={6}
                                onChangeText={(text) => {
                                    const numeros = text.replace(/\D/g, "").slice(0, 6);
                                    setCodigo(numeros);
                                }}
                                value={codigo}
                            />

                            <Text variant="bodySmall" style={{ ...styles.textoAjuda, marginTop: 8 }}>
                                Digite os 6 dígitos que você recebeu por email
                            </Text>

                            <View style={{ marginTop: 32, width: "100%" }}>
                                <Button mode="contained"
                                    onPress={verificarCodigo}
                                    loading={loading}
                                    disabled={loading || codigo.length !== 6}
                                    style={styles.botao}
                                    contentStyle={{ paddingVertical: 8 }}
                                    buttonColor={tema.colors.primary}
                                >
                                    Verificar Email
                                </Button>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                {temporizador > 0 ? (
                                    <Text variant="bodySmall" style={{ textAlign: "center" }}>
                                        Reenviar código em{" "}
                                        <Text style={{ fontWeight: "bold" }}>{temporizador}s</Text>
                                    </Text>
                                ) : (
                                    <Button mode="text" onPress={reenviarCodigo} disabled={loading || !podeReenviar} labelStyle={{ color: tema.colors.primary }}>
                                        Não recebeu o código? Reenviar
                                    </Button>
                                )}
                            </View>

                            <View style={{ marginTop: 24 }}>
                                <Button mode="outlined" onPress={() => router.back()} disabled={loading}>
                                    Voltar
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <Dialog visible={dialogVisivel} onDismiss={() => setDialogVisivel(false)}>
                    <Dialog.Title>Notificação</Dialog.Title>
                    <Dialog.Content>
                        <Text>{mensagemDialog}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogVisivel(false)}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    titulo: {
        marginTop: 24,
        marginBottom: 8,
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitulo: {
        textAlign: "center",
        marginBottom: 16,
        opacity: 0.7,
    },
    formContainer: {
        width: "100%",
        marginTop: 24,
        paddingHorizontal: 8,
    },
    textinput: {
        marginVertical: 8,
    },
    textoAjuda: {
        opacity: 0.6,
        textAlign: "center",
    },
    botao: {
        borderRadius: 8,
    },
});
