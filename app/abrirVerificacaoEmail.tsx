import { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button, Dialog, TextInput, useTheme, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { UserContext } from "@/context/UserProvider";
import { formatarCPF } from "@/utils/formatar";
import tema from "@/utils/tema";

export default function AbrirVerificacaoEmail() {
    const { enviarCodigoVerificacao } = useContext<any>(UserContext);
    const theme = useTheme();

    const [email, setEmail] = useState("");
    const [cpfFormatado, setCpfFormatado] = useState("");
    const [cpf, setCpf] = useState("");
    const [loading, setLoading] = useState(false);
    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [mensagemDialog, setMensagemDialog] = useState("");

    async function handleEnviarCodigo() {
        if (!email || !cpf) {
            setMensagemDialog("Email e CPF são obrigatórios");
            setDialogVisivel(true);
            return;
        }

        setLoading(true);
        const response = await enviarCodigoVerificacao(email, cpf);

        if (response.sucesso) {
            setMensagemDialog("Código enviado para seu email!");
            setDialogVisivel(true);

            setTimeout(() => {
                setDialogVisivel(false);
                router.replace({
                    pathname: "/verificarEmail",
                    params: {
                        email: email,
                        cpf: cpf
                    }
                });
            }, 1500);
        } else {
            setMensagemDialog(response.mensagem || "Erro ao enviar código");
            setDialogVisivel(true);
        }
        setLoading(false);
    }

    return (
        <>
            <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }}>
                <Text variant="headlineMedium" style={styles.titulo}>
                    Verificar Email
                </Text>

                <Text variant="bodyMedium" style={styles.subtitulo}>
                    Insira seus dados para receber o código de verificação
                </Text>

                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.input}
                                label="Email"
                                placeholder="seu@email.com"
                                mode="outlined"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                disabled={loading}
                                left={<TextInput.Icon icon="email-outline" />}
                            />

                            <TextInput
                                style={styles.input}
                                label="CPF"
                                placeholder="000.000.000-00"
                                mode="outlined"
                                keyboardType="numeric"
                                value={cpfFormatado}
                                onChangeText={(text) => {
                                    const { formatado, numeros } = formatarCPF(text);
                                    setCpfFormatado(formatado);
                                    setCpf(numeros);
                                }}
                                maxLength={14}
                                disabled={loading}
                                left={<TextInput.Icon icon="card-account-details" />}
                            />

                            <View style={{ marginTop: 32, width: "100%" }}>
                                <Button mode="contained" onPress={handleEnviarCodigo} style={styles.botao} contentStyle={{ paddingVertical: 8 }} buttonColor={tema.colors.primary}
                                    loading={loading} disabled={loading || !email || !cpf} >
                                    Enviar Código
                                </Button>
                            </View>

                            <View style={{ marginTop: 16 }}>
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
    input: {
        marginVertical: 8,
    },
    botao: {
        borderRadius: 8,
    },
});
