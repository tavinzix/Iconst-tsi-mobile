import { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, TextInput, useTheme, Text } from 'react-native-paper';
import { AuthContext } from '@/context/AuthProvider';
import tema from '@/utils/tema';
import { formatarTempo } from '@/utils/formatar';

export default function VerificarCodigo() {
    const theme = useTheme();
    const { recuperarSenhaCodigo, setRecuperarSenhaCodigo, verificarCodigoRecuperacao, solicitarCodigoRecuperacao, voltarEtapaRecuperacao, recuperarSenhaLoading } = useContext<any>(AuthContext);

    const [tempoRestante, setTempoRestante] = useState(1800); // 30 minutos
    const [podeReenviar, setPodeReenviar] = useState(false);
    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [mensagemDialog, setMensagemDialog] = useState('');
    const [tipoDialog, setTipoDialog] = useState<'sucesso' | 'erro'>('erro');

    useEffect(() => {
        const timer = setInterval(() => {
            setTempoRestante((prev) => {
                if (prev <= 1) {
                    setPodeReenviar(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleCodigoChange = (text: string) => {
        if (text.length <= 6) {
            setRecuperarSenhaCodigo(text.toUpperCase());
        }
    };

    const handleSubmit = async () => {
        if (recuperarSenhaCodigo.length !== 6) {
            setMensagemDialog('Digite o código completo com 6 caracteres');
            setTipoDialog('erro');
            setDialogVisivel(true);
            return;
        }

        const resultado = await verificarCodigoRecuperacao();

        setMensagemDialog(resultado.mensagem);
        setTipoDialog(resultado.sucesso ? 'sucesso' : 'erro');
        if (!resultado.sucesso) {
            setDialogVisivel(true);
        }
    };

    const handleReenviar = async () => {
        const resultado = await solicitarCodigoRecuperacao();

        if (resultado.sucesso) {
            setTempoRestante(1800);
            setPodeReenviar(false);
            setRecuperarSenhaCodigo('');
            setMensagemDialog(resultado.mensagem);
            setTipoDialog('sucesso');
            setDialogVisivel(true);
        } else {
            setMensagemDialog(resultado.mensagem);
            setTipoDialog('erro');
            setDialogVisivel(true);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text  style={{ ...styles.titulo, color: theme.colors.primary }}>
                        Verifique seu email
                    </Text>
                    <Text style={{ ...styles.descricao, color: theme.colors.onSurfaceVariant }}>
                        Digite o código de 6 dígitos enviado para seu email
                    </Text>

                    <TextInput style={styles.input} maxLength={6} value={recuperarSenhaCodigo} disabled={recuperarSenhaLoading} autoCapitalize="characters"
                        label="Código de verificação"
                        placeholder="000000"
                        mode="outlined"
                        onChangeText={handleCodigoChange}
                        left={<TextInput.Icon icon="lock" />}
                    />

                    <View style={{ marginVertical: 16 }}>
                        {tempoRestante > 0 ? (
                            <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                                Código expira em: <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                                    {formatarTempo(tempoRestante)}
                                </Text>
                            </Text>
                        ) : (
                            <Text style={{ textAlign: 'center', color: theme.colors.error, fontWeight: 'bold' }}>
                                Código expirado! Solicite um novo código.
                            </Text>
                        )}
                    </View>

                    <Button mode="contained" onPress={handleSubmit} style={styles.botao}
                        loading={recuperarSenhaLoading}
                        disabled={recuperarSenhaLoading || recuperarSenhaCodigo.length !== 6}
                        contentStyle={{ paddingVertical: 8 }}
                        buttonColor={tema.colors.primary}
                    >
                        {recuperarSenhaLoading ? 'Verificando...' : 'Verificar Código'}
                    </Button>

                    <View style={styles.botoesSecundarios}>
                        <Button mode="outlined" onPress={voltarEtapaRecuperacao} disabled={recuperarSenhaLoading} style={{ flex: 1, marginRight: 8 }}>
                            Voltar
                        </Button>
                        <Button mode="outlined" onPress={handleReenviar} disabled={recuperarSenhaLoading || !podeReenviar} style={{ flex: 1 }}>
                            Reenviar
                        </Button>
                    </View>

                    <View style={{ ...styles.infoBox, borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '10' }}>
                        <Text style={{ ...styles.infoTexto, color: theme.colors.primary }}>
                            Verifique sua caixa de spam se não receber o email em alguns minutos.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <Dialog visible={dialogVisivel} onDismiss={() => setDialogVisivel(false)}>
                <Dialog.Icon
                    icon={tipoDialog === 'sucesso' ? 'check-circle' : 'alert-circle-outline'}
                    size={50}
                />
                <Dialog.Title style={{ textAlign: 'center' }}>
                    {tipoDialog === 'sucesso' ? 'Sucesso' : 'Validação'}
                </Dialog.Title>
                <Dialog.Content>
                    <Text style={{ textAlign: 'center' }}>{mensagemDialog}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialogVisivel(false)}>OK</Button>
                </Dialog.Actions>
            </Dialog>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 400,
    },
    titulo: {
        fontSize:20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    descricao: {
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        marginVertical: 8,
        backgroundColor: 'transparent',
    },
    erroContainer: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginVertical: 12,
        backgroundColor: '#FFE5E5',
    },
    erroTexto: {
        fontSize: 14,
        textAlign: 'center',
    },
    botao: {
        marginVertical: 12,
    },
    botoesSecundarios: {
        flexDirection: 'row',
        gap: 8,
        marginVertical: 8,
    },
    infoBox: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
    },
    infoTexto: {
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
    },
});
