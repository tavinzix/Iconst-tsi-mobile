import { useContext, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "@/context/AuthProvider";
import SolicitarCodigo from "@/components/recuperacaoSenha/SolicitarCodigo";
import VerificarCodigo from "@/components/recuperacaoSenha/VerificarCodigo";
import AlterarSenha from "@/components/recuperacaoSenha/AlterarSenha";
import { router } from "expo-router";

export default function RecuperarSenhaScreen() {
    const theme = useTheme();
    const { recuperarSenhaEtapa, limparRecuperacaoSenha } = useContext<any>(AuthContext);

    const etapas = [
        { numero: 1, titulo: 'Identificação', descricao: 'CPF e data de nascimento' },
        { numero: 2, titulo: 'Verificação', descricao: 'Código de segurança' },
        { numero: 3, titulo: 'Nova Senha', descricao: 'Redefinir senha' }
    ];

    const handleVoltarLogin = () => {
        limparRecuperacaoSenha();
        router.back();
    };

    useEffect(() => {
        limparRecuperacaoSenha();
    }, [])

    return (
        <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.titulo}>Recuperar Senha</Text>
                    <Text style={styles.subtitulo}>Siga os passos abaixo para redefinir sua senha</Text>
                </View>

                {/* Indicador de Etapas */}
                <View style={styles.etapasContainer}>
                    {etapas.map((etapa, index) => (
                        <View key={etapa.numero} style={styles.etapaWrapper}>
                            <View style={styles.etapaContent}>
                                <View style={[styles.circulo, {
                                    backgroundColor: recuperarSenhaEtapa === etapa.numero ? theme.colors.primary : recuperarSenhaEtapa > etapa.numero ? '#4CAF50' : theme.colors.outline
                                }]}>
                                    <Text style={[styles.circuloTexto, { color: recuperarSenhaEtapa >= etapa.numero ? '#FFF' : theme.colors.onSurface, }]}>
                                        {recuperarSenhaEtapa > etapa.numero ? '✓' : etapa.numero}
                                    </Text>
                                </View>
                                <View style={styles.etapaTexto}>
                                    <Text style={[styles.etapaTitulo, { color: recuperarSenhaEtapa === etapa.numero ? theme.colors.primary : theme.colors.onBackground, }]}>
                                        {etapa.titulo}
                                    </Text>
                                    <Text style={{ ...styles.etapaDescricao, color: theme.colors.onSurfaceVariant }}>
                                        {etapa.descricao}
                                    </Text>
                                </View>
                            </View>

                            {/* Linha conectora */}
                            {index < etapas.length - 1 && (
                                <View style={[styles.linha, { backgroundColor: recuperarSenhaEtapa > etapa.numero ? '#4CAF50' : theme.colors.outlineVariant, }]} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Formulário atual */}
                <View>
                    {recuperarSenhaEtapa === 1 && <SolicitarCodigo />}
                    {recuperarSenhaEtapa === 2 && <VerificarCodigo />}
                    {recuperarSenhaEtapa === 3 && <AlterarSenha />}
                </View>

                {/* Link para voltar */}
                <Text onPress={handleVoltarLogin} style={{ ...styles.voltarLink, color: theme.colors.primary, marginBottom: 20, }}>
                    ← Voltar para Login
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    titulo: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 24,
    },
    subtitulo: {
        textAlign: 'center',
        opacity: 0.7,
    },
    etapasContainer: {
        marginVertical: 20,
        paddingHorizontal: 8,
        textAlign: 'center',
    },
    etapaWrapper: {
        marginBottom: 16,
    },
    etapaContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    circulo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 50,
    },
    circuloTexto: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    etapaTexto: {
        flex: 1,
        justifyContent: 'center',
    },
    etapaTitulo: {
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 2,
    },
    etapaDescricao: {
        fontSize: 12,
    },
    linha: {
        marginLeft: 24,
        marginTop: 8,
        marginBottom: 8,
        height: 3,
        borderRadius: 2,
    },
    voltarLink: {
        textAlign: 'center',
        fontWeight: '600',
    },
});