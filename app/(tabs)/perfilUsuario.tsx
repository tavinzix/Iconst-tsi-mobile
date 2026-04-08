import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dialog, useTheme, Text } from "react-native-paper";
import { router } from "expo-router";
import { AuthContext } from "@/context/AuthProvider";
import { UserContext } from "@/context/UserProvider";
import { formatarCPF, formatarTelefone } from "@/utils/formatar";
import tema from "@/utils/tema";

export default function PerfilUsuario() {
    const { user, imagemUsuario, logout } = useContext<any>(AuthContext);
    const { userInfo, loadingUser, removerConta, buscarUsuario } = useContext<any>(UserContext);

    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [mensagemDialog, setMensagemDialog] = useState("");

    const theme = useTheme();

    useEffect(() => {
        if (!user) {
            router.navigate("/entrar");
        }
    }, [user]);

    useEffect(() => {
        buscarUsuario();
    }, []);

    if (loadingUser) {
        return (
            <SafeAreaView style={{ ...styles.safeArea, backgroundColor: theme.colors.background }} >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Carregando informações do usuário...</Text>
                </View>
            </SafeAreaView>
        )
    }

    async function handleLogout() {
        Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sair", style: "destructive",
                onPress: async () => {
                    const resultado = await logout();
                    if (resultado.sucesso) {
                        router.replace("/entrar");
                    }
                },
            },
        ]);
    }

    async function handleDeleteAccount() {
        Alert.alert("Desativar conta", "Tem certeza?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir", style: "destructive",
                onPress: async () => {
                    try {
                        const resposta = await removerConta(user.id);
                        if (resposta.sucesso) {
                            setMensagemDialog("Conta removida com sucesso!");
                            setDialogVisivel(true);
                            router.navigate("/entrar");
                        } else {
                            setMensagemDialog(resposta.mensagem || "Erro ao remover conta");
                            setDialogVisivel(true);
                        }
                    } catch (err: any) {
                        setMensagemDialog(err.message || "Erro ao remover conta");
                        setDialogVisivel(true);
                    }
                },
            },
        ]
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={{ ...styles.header, backgroundColor: theme.colors.primary }}>
                <Text style={styles.headerTitulo}>Meu perfil</Text>
            </View>

            <ScrollView style={{ ...styles.scroll, backgroundColor: theme.colors.surface }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollConteudo} >
                <View style={{ ...styles.dadosUsuario, backgroundColor: theme.colors.surface }}>
                    <Image style={styles.imagemUsuario} source={{ uri: userInfo?.imgUser || imagemUsuario }} />
                    <Text style={styles.usuarioNome}>{userInfo?.nomeCompleto}</Text>
                    <Text style={styles.usuarioEmail}>{userInfo?.email}</Text>

                    <TouchableOpacity style={styles.botaoEditar} onPress={() => router.navigate("/editarPerfilUsuario")}>
                        <Text style={styles.botaoEditarTexto}>Editar perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* minha conta */}
                <View style={{ ...styles.secao, backgroundColor: theme.colors.surface }} >
                    <Text style={styles.secaoLabel}>Meus dados</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoLinha}>
                            <View style={styles.infoPonto} />
                            <Text style={styles.infoLabel}>CPF</Text>
                            <Text style={styles.infoValor}>{formatarCPF(userInfo?.cpf).formatado}</Text>
                        </View>
                        <View style={styles.infoDivisoria} />
                        <View style={styles.infoLinha}>
                            <View style={styles.infoPonto} />
                            <Text style={styles.infoLabel}>Telefone</Text>
                            <Text style={styles.infoValor}>{formatarTelefone(userInfo?.telefone).formatado} </Text>
                        </View>
                    </View>
                </View>

                {/* pedidos*/}
                <View style={{...styles.secao, backgroundColor: theme.colors.surface }} >
                    <Text style={styles.secaoLabel}>Compras</Text>
                    <View style={styles.menuCard}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => router.navigate("/(tabs)/pedidos")}>
                            <View style={{ ...styles.menuIcone, backgroundColor: "#FFF0E6" }}>
                                <Text style={styles.menuIconeEmoji}>📦</Text>
                            </View>
                            <View style={styles.menuTextoContainer}>
                                <Text style={styles.menuItemTitulo}>Meus pedidos </Text>
                                <Text style={styles.menuItemSubtitulo}>Acompanhe suas compras</Text>
                            </View>
                            <Text style={styles.seta}>{'\u2192'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*entrega e pagamento*/}
                <View style={styles.secao}>
                    <Text style={styles.secaoLabel}>Entrega e pagamento</Text>
                    <View style={styles.menuCard}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => router.navigate("/(tabs)/pedidos")}>
                            <View style={{ ...styles.menuIcone, backgroundColor: "#E6F0FF" }}>
                                <Text style={styles.menuIconeEmoji}>📍</Text>
                            </View>
                            <View style={styles.menuTextoContainer}>
                                <Text style={styles.menuItemTitulo}>Endereços</Text>
                                <Text style={styles.menuItemSubtitulo}>Gerenciar endereços de entrega</Text>
                            </View>
                            <Text style={styles.seta}>{'\u2192'}</Text>
                        </TouchableOpacity>

                        <View style={styles.infoDivisoria} />

                        <TouchableOpacity style={styles.menuItem} onPress={() => router.navigate("/(tabs)/pedidos")}>
                            <View style={{ ...styles.menuIcone, backgroundColor: "#E6F5ED" }}>
                                <Text style={styles.menuIconeEmoji}>💳</Text>
                            </View>
                            <View style={styles.menuTextoContainer}>
                                <Text style={styles.menuItemTitulo}>Formas de pagamento</Text>
                                <Text style={styles.menuItemSubtitulo}>Cartões e métodos salvos</Text>
                            </View>
                            <Text style={styles.seta}>{'\u2192'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*conta*/}
                <View style={styles.secao}>
                    <Text style={styles.secaoLabel}>Conta</Text>
                    <View style={styles.menuCard}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                            <View style={{ ...styles.menuIcone, backgroundColor: "#FFF3E0" }}>
                                <Text style={styles.menuIconeEmoji}>🚪</Text>
                            </View>
                            <View style={styles.menuTextoContainer}>
                                <Text style={{ ...styles.menuItemTitulo, color: tema.colors.primary }}>Sair da conta</Text>
                            </View>
                            <Text style={styles.seta}>{'\u2192'}</Text>
                        </TouchableOpacity>

                        <View style={styles.infoDivisoria} />

                        <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
                            <View style={{ ...styles.menuIcone, backgroundColor: "#FFEBEB" }}>
                                <Text style={styles.menuIconeEmoji}>🗑</Text>
                            </View>
                            <View style={styles.menuTextoContainer}>
                                <Text style={{ ...styles.menuItemTitulo, color: "#e53935" }}>Desativar conta</Text>
                            </View>
                            <Text style={styles.seta}>{'\u2192'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Dialog visible={dialogVisivel} onDismiss={() => setDialogVisivel(false)}>
                <Dialog.Icon icon="alert-circle-outline" size={60} />
                <Dialog.Title style={styles.dialogText}>Erro</Dialog.Title>
                <Dialog.Content>
                    <Text style={styles.dialogText}>{mensagemDialog}</Text>
                </Dialog.Content>
            </Dialog>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tema.colors.primary,
    },

    loadingContainer: {
        flex: 1,
        backgroundColor: "#F5F5F0",
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        fontSize: 15,
        color: "#888",
    },

    header: {
        backgroundColor: tema.colors.primary,
        paddingHorizontal: 20,
        paddingBottom: 14,
        paddingTop: 6,
    },
    headerTitulo: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },

    scroll: {
        flex: 1,
        backgroundColor: "#F5F5F0",
    },
    scrollConteudo: {
        paddingBottom: 24,
    },

    dadosUsuario: {
        backgroundColor: "#fff",
        alignItems: "center",
        paddingVertical: 28,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        gap: 6
    },
    imagemUsuario: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 4,
    },
    usuarioNome: {
        fontSize: 18,
        fontWeight: "700",
    },
    usuarioEmail: {
        fontSize: 13,
        color: "#888",
    },

    botaoEditar: {
        marginTop: 8,
        backgroundColor: tema.colors.primary,
        paddingHorizontal: 22,
        paddingVertical: 9,
        borderRadius: 8,
    },

    botaoEditarTexto: {
        color: tema.colors.white,
        fontSize: 14,
        fontWeight: "600",
    },

    secao: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    secaoLabel: {
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        marginBottom: 8,
        paddingHorizontal: 2,
    },

    infoCard: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#eee",
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    infoLinha: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 10,
    },
    infoPonto: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: tema.colors.primary,
    },
    infoLabel: {
        fontSize: 12,
        width: 70,
    },
    infoValor: {
        fontSize: 13,
        fontWeight: "500",
        flex: 1,
    },
    infoDivisoria: {
        height: 1,
        backgroundColor: "#f5f5f5",
        marginLeft: 16,
    },

    menuCard: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#eee",
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 14,
    },


    menuIcone: {
        width: 38,
        height: 38,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    menuIconeEmoji: {
        fontSize: 18,
    },
    menuTextoContainer: {
        flex: 1,
        gap: 2,
    },
    menuItemTitulo: {
        fontSize: 14,
        fontWeight: "500",
    },
    menuItemSubtitulo: {
        fontSize: 12,
    },
    seta: {
        fontSize: 30,
        color: "#ccc",
    },

    dialogText: {
        textAlign: "center",
    },
});