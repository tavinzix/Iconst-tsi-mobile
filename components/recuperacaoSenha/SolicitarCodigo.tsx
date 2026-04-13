import { useContext, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, TextInput, useTheme, Text } from 'react-native-paper';
import { AuthContext } from '@/context/AuthProvider';
import { formatarCPF, formatarData } from '@/utils/formatar';
import tema from '@/utils/tema';

export default function SolicitarCodigo() {
    const theme = useTheme();
    const { recuperarSenhaCpf, recuperarSenhaDataNascimento, setRecuperarSenhaCpf, setRecuperarSenhaDataNascimento, solicitarCodigoRecuperacao, recuperarSenhaLoading } = useContext<any>(AuthContext);

    const [cpfFormatado, setCpfFormatado] = useState('');
    const [dataFormatada, setDataFormatada] = useState('');
    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [mensagemDialog, setMensagemDialog] = useState('');
    const [tipoDialog, setTipoDialog] = useState<'sucesso' | 'erro'>('erro');

    const handleCPFChange = (valor: string) => {
        const { formatado, numeros } = formatarCPF(valor);
        setCpfFormatado(formatado);
        setRecuperarSenhaCpf(numeros);
    };

    const handleDataChange = (valor: string) => {
        const { formatado, numeros } = formatarData(valor);
        setDataFormatada(formatado);
        setRecuperarSenhaDataNascimento(numeros);
    };

    const handleSubmit = async () => {

        if (recuperarSenhaCpf.length !== 11) {
            const msg = 'CPF deve conter 11 dígitos';
            setMensagemDialog(msg);
            setTipoDialog('erro');
            setDialogVisivel(true);
            return;
        }

        if (!recuperarSenhaDataNascimento) {
            setMensagemDialog('Informe sua data de nascimento');
            setTipoDialog('erro');
            setDialogVisivel(true);
            return;
        }

        const resultado = await solicitarCodigoRecuperacao();

        setMensagemDialog(resultado.mensagem);
        setTipoDialog(resultado.sucesso ? 'sucesso' : 'erro');
        if (!resultado.sucesso) {
            setDialogVisivel(true);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={{ ...styles.titulo, color: theme.colors.primary }}>
                        Identifique-se
                    </Text>
                    <Text variant="bodyMedium" style={{ ...styles.descricao, color: theme.colors.onSurfaceVariant }}>
                        Informe seu CPF e data de nascimento para receber o código de recuperação
                    </Text>

                    <TextInput
                        style={styles.input}
                        label="CPF"
                        placeholder="000.000.000-00"
                        mode="outlined"
                        keyboardType="numeric"
                        value={cpfFormatado}
                        onChangeText={handleCPFChange}
                        maxLength={14}
                        disabled={recuperarSenhaLoading}
                        left={<TextInput.Icon icon="card-account-details" />}
                    />

                    <TextInput
                        style={styles.input}
                        label="Data de Nascimento"
                        placeholder="DD/MM/AAAA"
                        mode="outlined"
                        keyboardType="numeric"
                        value={dataFormatada}
                        onChangeText={handleDataChange}
                        maxLength={10}
                        disabled={recuperarSenhaLoading}
                        left={<TextInput.Icon icon="calendar" />}
                    />

                    <View style={{ ...styles.infoBox, borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '10' }}>
                        <Text style={{ ...styles.infoTexto, color: theme.colors.primary }}>
                            Enviaremos um código de verificação de 6 dígitos para o email cadastrado. O código expira em 30 minutos.
                        </Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        loading={recuperarSenhaLoading}
                        disabled={recuperarSenhaLoading || !recuperarSenhaCpf || !recuperarSenhaDataNascimento}
                        style={styles.botao}
                        contentStyle={{ paddingVertical: 8 }}
                        buttonColor={tema.colors.primary}
                    >
                        {recuperarSenhaLoading ? 'Enviando código...' : 'Enviar Código'}
                    </Button>
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
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        fontSize:20
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
    infoBox: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginVertical: 16,
    },
    infoTexto: {
        fontSize: 13,
        lineHeight: 20,
    },
    botao: {
        marginTop: 8,
        marginBottom: 16,
    },
});
