import { AuthContext } from "@/context/AuthProvider";
import { useContext, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { Button, Dialog, TextInput, useTheme, Text } from "react-native-paper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "expo-router";
import { UserContext } from "@/context/UserProvider";
import { formatarCPF, formatarTelefone, formatarData } from '@/utils/formatar';

const requiredMessage = "Campo obrigatório";

const schema = yup.object().shape({
    nome: yup.string().required(requiredMessage),
    email: yup.string().required(requiredMessage).email("Email inválido"),
    telefone: yup.string().required(requiredMessage),
    // senha: yup.string().required(requiredMessage)
    //     .matches(
    //         /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
    //         "A senha deve conter ao menos uma letra maiúscula, uma letra minúscula, um númeral, um caractere especial e um total de 8 caracteres"
    //     ),
    // confirmSenha: yup.string().required(requiredMessage).oneOf([yup.ref("senha")], "As senhas não coincidem"),
}).required();


export default function EditarPerfilUsuario() {
    const { userInfo, loadingUser, editarUsuario } = useContext<any>(UserContext);
    const { user, imagemUsuario } = useContext<any>(AuthContext)
    const theme = useTheme();

    const [cpfFormatado, setCpfFormatado] = useState('');
    const [telefoneFormatado, setTelefoneFormatado] = useState('');
    const [dtNascFormatada, setDtNascFormatada] = useState('');

    const [loading, setLoading] = useState(false);
    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [mensagemDialog, setMensagemDialog] = useState("");

    const { control, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            nome: userInfo?.nomeCompleto || "",
            email: userInfo?.email || "",
            cpf: userInfo?.cpf ? formatarCPF(userInfo.cpf).formatado : "",
            dtNasc: userInfo?.dtNasc ? formatarData(userInfo.dtNasc).formatado : "",
            telefone: userInfo?.telefone ? formatarTelefone(userInfo.telefone).formatado : "",
            senha: "",
            confirmSenha: "",
        },
        mode: "onSubmit",
        resolver: yupResolver(schema)
    });


    async function editaPerfil(formData: any) {
        setLoading(true);

        const payload = {
            nome_completo: formData.nome,
            email: formData.email,
            telefone: formData.telefone.replace(/\D/g, ''),
            ...(formData.senha && { senha: formData.senha }),
        };

        try {
            const data = await editarUsuario(user.id, payload);
            console.log(data)
            if (data.sucesso) {
                setMensagemDialog(data.mensagem);
                setDialogVisivel(true);
                setLoading(false);
                router.replace("/perfilUsuario");
            } else {
                setMensagemDialog(data.mensagem);
                setDialogVisivel(true);
                setLoading(false);
            }
        } catch (error) {
            alert("Ocorreu um erro ao criar o usuário. Por favor, tente novamente.");
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }} >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <>
                        <View style={styles.formContainer}>
                            <Controller
                                name="nome"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.textinput}
                                        label="Nome completo"
                                        placeholder="Seu nome completo"
                                        left={<TextInput.Icon icon="account" />}
                                        mode="outlined"
                                        autoCapitalize="sentences"
                                        returnKeyType="next"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.nome && (
                                <Text style={{ ...styles.textError, color: theme.colors.error }}>
                                    {errors.nome?.message?.toString()}
                                </Text>
                            )}

                            <Controller
                                name="email"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.textinput}
                                        label="Email"
                                        placeholder="seu@email.com"
                                        left={<TextInput.Icon icon="email-outline" />}
                                        mode="outlined"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.email && (
                                <Text style={{ ...styles.textError, color: theme.colors.error }}>
                                    {errors.email?.message?.toString()}
                                </Text>
                            )}

                            <Controller
                                name="cpf"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Pressable
                                        onPress={() => {
                                            setMensagemDialog("CPF não pode ser editado");
                                            setDialogVisivel(true);
                                        }}
                                    >
                                        <View pointerEvents="none">
                                            <TextInput
                                                style={styles.textinput}
                                                label="CPF"
                                                placeholder="000.000.000.00"
                                                left={<TextInput.Icon icon="card-account-details" />}
                                                mode="outlined"
                                                keyboardType="numeric"
                                                autoCapitalize="none"
                                                returnKeyType="next"
                                                onBlur={onBlur}
                                                value={cpfFormatado || value}
                                                maxLength={14}
                                                editable={false}
                                            />
                                        </View>
                                    </Pressable>
                                )}
                            />

                            <Controller
                                name="dtNasc"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Pressable
                                        onPress={() => {
                                            setMensagemDialog("Data de nascimento não pode ser editada");
                                            setDialogVisivel(true);
                                        }}
                                    >
                                        <TextInput
                                            style={styles.textinput}
                                            label="Data de nascimento"
                                            placeholder="00/00/0000"
                                            left={<TextInput.Icon icon="calendar" />}
                                            mode="outlined"
                                            autoCapitalize="none"
                                            returnKeyType="next"
                                            keyboardType="numeric"
                                            onBlur={onBlur}
                                            value={dtNascFormatada || value}
                                            onChangeText={(text) => {
                                                const { formatado, numeros } = formatarData(text);
                                                setDtNascFormatada(formatado);
                                                onChange(numeros);
                                            }}
                                            maxLength={10}
                                            editable={false}
                                        />
                                    </Pressable>
                                )}
                            />

                            <Controller
                                name="telefone"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.textinput}
                                        label="Telefone"
                                        placeholder="(00) 00000-0000"
                                        left={<TextInput.Icon icon="phone" />}
                                        mode="outlined"
                                        keyboardType="numeric"
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        onBlur={onBlur}
                                        value={telefoneFormatado || value}
                                        onChangeText={(text) => {
                                            const { formatado, numeros } = formatarTelefone(text);
                                            setTelefoneFormatado(formatado);
                                            onChange(numeros);
                                        }}
                                        maxLength={15}
                                    />
                                )}
                            />
                            {errors.telefone && (
                                <Text style={{ ...styles.textError, color: theme.colors.error }}>
                                    {errors.telefone?.message?.toString()}
                                </Text>
                            )}

                            <Controller
                                name="senha"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.textinput}
                                        label="Senha"
                                        placeholder="Mínimo 8 caracteres"
                                        left={<TextInput.Icon icon="lock" />}
                                        mode="outlined"
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.senha && (
                                <Text style={{ ...styles.textError, color: theme.colors.error }}>
                                    {errors.senha?.message?.toString()}
                                </Text>
                            )}

                            <Controller
                                name="confirmSenha"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.textinput}
                                        label="Confirmar senha"
                                        placeholder="Digite novamente"
                                        left={<TextInput.Icon icon="lock" />}
                                        mode="outlined"
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.confirmSenha && (
                                <Text style={{ ...styles.textError, color: theme.colors.error }}>
                                    {errors.confirmSenha?.message?.toString()}
                                </Text>
                            )}

                            <Button style={{ ...styles.button, backgroundColor: theme.colors.primary }} mode="contained" onPress={handleSubmit(editaPerfil)} loading={loading} disabled={loading}>
                                {!loading ? "Editar" : "Salvando"}
                            </Button>
                        </View>
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
    textinput: {
        width: "100%",
        maxWidth: 400,
        height: 52,
        marginTop: 16,
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
    title: {
        marginTop: 20,
        marginBottom: 5,
        textAlign: "center",
        fontWeight: "600"
    },

    subtitle: {
        marginBottom: 10,
        textAlign: "center",
        opacity: 0.7
    }
})