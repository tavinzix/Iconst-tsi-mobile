import { AuthContext } from "@/context/AuthProvider";
import React, { useContext, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { Button, Dialog, TextInput, useTheme, Text } from "react-native-paper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router, useFocusEffect } from "expo-router";
import { UserContext } from "@/context/UserProvider";
import { formatarCPF, formatarTelefone, formatarData } from '@/utils/formatar';
import * as ImagePicker from 'expo-image-picker';
import tema from "@/utils/tema";

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
    const { userInfo, loadingUser, editarUsuario, removerFoto, buscarUsuario } = useContext<any>(UserContext);
    const { user, imagemUsuario, setImagemUsuario } = useContext<any>(AuthContext)
    const theme = useTheme();

    const [cpfFormatado, setCpfFormatado] = useState('');
    const [telefoneFormatado, setTelefoneFormatado] = useState('');
    const [dtNascFormatada, setDtNascFormatada] = useState('');
    const [imagemPreview, setImagemPreview] = useState<string | null>(null);
    const [imagemSelecionada, setImagemSelecionada] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [mensagemDialog, setMensagemDialog] = useState("");
    const [tipoDialog, setTipoDialog] = useState<"erro" | "sucesso">("erro");

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

    const selecionarImagem = async () => {
        Alert.alert("Inserir imagem", "Como deseja inserir sua foto?", [
            {
                text: "Galeria", style: "default",
                onPress: async () => {
                    await imagemGaleria()
                }
            },
            {
                text: "Camera", style: "default",
                onPress: async () => {
                    await imagemCamera()
                },
            },
        ]);
    };

    const imagemGaleria = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                setImagemPreview(asset.uri);
                setImagemSelecionada({
                    uri: asset.uri,
                    type: asset.type || 'image',
                    mimeType: asset.mimeType || 'image/jpeg',
                });
            }
        } catch (error) {
            alert("Erro ao selecionar imagem");
            console.error(error);
        }
    };

    const imagemCamera = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                setImagemPreview(asset.uri);
                setImagemSelecionada({
                    uri: asset.uri,
                    type: asset.type || 'image',
                    mimeType: asset.mimeType || 'image/jpeg',
                });
            }
        } catch (error) {
            alert("Erro ao selecionar imagem");
            console.error(error);
        }
    };

    const removerImagemUsuario = async () => {
        Alert.alert(
            "Remover imagem",
            "Tem certeza que deseja remover sua imagem de perfil?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover", style: "destructive",
                    onPress: async () => {
                        try {
                            const resultado = await removerFoto(user.id);
                            if (resultado.sucesso) {
                                await buscarUsuario();
                                setImagemPreview(null);
                                setImagemUsuario(null);
                                setImagemSelecionada(null);
                                setMensagemDialog("Imagem removida com sucesso!");
                                setTipoDialog("sucesso");
                                setDialogVisivel(true);
                            } else {
                                setMensagemDialog(resultado.mensagem || "Erro ao remover imagem");
                                setTipoDialog("erro");
                                setDialogVisivel(true);
                            }
                        } catch (error) {
                            setMensagemDialog("Erro ao remover imagem");
                            setTipoDialog("erro");
                            setDialogVisivel(true);
                        }
                    },
                },
            ]
        );
    };

    async function editaPerfil(formData: any) {
        setLoading(true);

        const payload = new FormData();
        payload.append('nome_completo', formData.nome);
        payload.append('email', formData.email);
        payload.append('telefone', formData.telefone.replace(/\D/g, ''));

        if (formData.senha) {
            payload.append('senha', formData.senha);
        }

        if (imagemSelecionada) {
            const uriParts = imagemSelecionada.uri.split('.');
            const fileType = imagemSelecionada.mimeType || `image/${uriParts[uriParts.length - 1]}`;

            payload.append('foto', {
                uri: imagemSelecionada.uri,
                type: fileType,
                name: `foto_${user.id}.jpg`,
            } as any);
        }

        try {
            const data = await editarUsuario(user.id, payload);
            if (data.sucesso) {
                const usuarioAtualizado = await buscarUsuario();
                const novaImagem = usuarioAtualizado?.imgUser || data.imgUser;

                if (novaImagem) {
                    setImagemUsuario(novaImagem)
                } else if (!imagemSelecionada) {
                    setImagemUsuario(null)
                }

                setMensagemDialog("Perfil atualizado com sucesso!");
                setTipoDialog("sucesso");
                setDialogVisivel(true);
                setLoading(false);
                setImagemSelecionada(null);
                setImagemPreview(null);
                setTimeout(() => {
                    router.replace("/perfilUsuario");
                }, 1500);
            } else {
                setMensagemDialog(data.mensagem || "Erro ao atualizar perfil");
                setTipoDialog("erro");
                setDialogVisivel(true);
                setLoading(false);
            }
        } catch (error) {
            setMensagemDialog("Erro ao atualizar perfil");
            setTipoDialog("erro");
            setDialogVisivel(true);
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            setImagemPreview(null);
            setImagemSelecionada(null);
        }, [])
    );

    return (
        <SafeAreaView style={{ ...styles.container }} edges={["top"]}>
            <View style={{ ...styles.header, backgroundColor: theme.colors.primary }}>
                <Text style={styles.headerTitulo}>Editar perfil</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView style={{ ...styles.scrollContent }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>

                    <View style={{ ...styles.imagemContainer, backgroundColor: theme.colors.surface }}>
                        <View style={styles.imagemWrapper}>
                            <Image style={styles.imagemUsuario} source={{ uri: imagemPreview || userInfo?.imgUser || imagemUsuario }} />
                            <View style={styles.botoesImagem}>
                                <TouchableOpacity style={{ ...styles.botaoImagemEditar, backgroundColor: theme.colors.primary }} onPress={selecionarImagem}>
                                    <Text style={styles.emojiBtn}>📷</Text>
                                </TouchableOpacity>

                                {(imagemPreview || (imagemUsuario && imagemUsuario !== "/src/assets/avatar.jpg")) && (
                                    <TouchableOpacity style={styles.botaoImagemRemover} onPress={removerImagemUsuario}>
                                        <Text style={styles.emojiBtn}>🗑️</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={{ ...styles.formContainer, backgroundColor: theme.colors.surface }}>
                        <Controller name="nome" control={control} render={({ field: { onChange, onBlur, value } }) => (
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

                        <Controller name="email" control={control} render={({ field: { onChange, onBlur, value } }) => (
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

                        <Controller name="cpf" control={control} render={({ field: { onChange, onBlur, value } }) => (<Pressable
                            onPress={() => {
                                setMensagemDialog("CPF não pode ser editado");
                                setTipoDialog("erro");
                                setDialogVisivel(true);
                            }}>
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

                        <Controller name="dtNasc" control={control} render={({ field: { onChange, onBlur, value } }) => (
                            <Pressable
                                onPress={() => {
                                    setMensagemDialog("Data de nascimento não pode ser editada");
                                    setTipoDialog("erro");
                                    setDialogVisivel(true);
                                }}>
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

                        <Controller name="telefone" control={control} render={({ field: { onChange, onBlur, value } }) => (
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

                        <Controller name="senha" control={control} render={({ field: { onChange, onBlur, value } }) => (
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
                                secureTextEntry
                            />
                        )}
                        />
                        {errors.senha && (
                            <Text style={{ ...styles.textError, color: theme.colors.error }}>
                                {errors.senha?.message?.toString()}
                            </Text>
                        )}

                        <Controller name="confirmSenha" control={control} render={({ field: { onChange, onBlur, value } }) => (
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
                                secureTextEntry
                            />
                        )}
                        />
                        {errors.confirmSenha && (
                            <Text style={{ ...styles.textError, color: theme.colors.error }}>
                                {errors.confirmSenha?.message?.toString()}
                            </Text>
                        )}

                        <Button mode="contained" onPress={handleSubmit(editaPerfil)} loading={loading} disabled={loading} style={{ ...styles.button, backgroundColor: theme.colors.primary }}>
                            {!loading ? "Salvar alterações" : "Salvando"}
                        </Button>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Dialog visible={dialogVisivel} onDismiss={() => setDialogVisivel(false)}>
                <Dialog.Icon
                    icon={tipoDialog === "sucesso" ? "check-circle" : "alert-circle-outline"}
                    size={60}
                    color={tipoDialog === "sucesso" ? theme.colors.primary : theme.colors.error}
                />
                <Dialog.Title style={styles.textDialog}>
                    {tipoDialog === "sucesso" ? "Sucesso" : "Erro"}
                </Dialog.Title>
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
        flex: 1,
        backgroundColor: tema.colors.primary,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 14,
        paddingTop: 6,
    },
    headerTitulo: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    scrollContent: {
        backgroundColor: "#F5F5F0",
    },
    imagemContainer: {
        backgroundColor: "#fff",
        alignItems: "center",
        paddingVertical: 28,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    imagemWrapper: {
        position: "relative",
        marginBottom: 12,
    },
    imagemUsuario: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    botoesImagem: {
        position: "absolute",
        bottom: -12,
        right: -12,
        flexDirection: "row",
        gap: 8,
    },
    botaoImagemEditar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#fff",
    },
    botaoImagemRemover: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#e53935",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#fff",
    },
    emojiBtn: {
        fontSize: 18,
    },
    formContainer: {
        width: "100%",
        paddingHorizontal: 16,
        paddingVertical: 20,
        gap: 6,
    },
    textinput: {
        width: "100%",
        height: 52,
        marginTop: 12,
    },
    textDialog: {
        textAlign: "center",
    },
    textError: {
        marginTop: 4,
        fontSize: 12,
        paddingHorizontal: 16,
    },
    button: {
        marginTop: 24,
        width: "100%",
        height: 50,
        justifyContent: "center",
        borderRadius: 10,
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