import { useContext, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, TextInput, useTheme, Text } from 'react-native-paper';
import { AuthContext } from '@/context/AuthProvider';
import { validarSenha } from '@/utils/validarSenha';
import BarraForcaSenha from '@/components/BarraForcaSenha';
import RequisitosSenha from '@/components/RequisitosSenha';
import tema from '@/utils/tema';
import { router } from 'expo-router';

export default function AlterarSenha() {
    const theme = useTheme();
    const { alterarSenhaRecuperacao, voltarEtapaRecuperacao, recuperarSenhaLoading, limparRecuperacaoSenha } = useContext<any>(AuthContext);

    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [mensagemDialog, setMensagemDialog] = useState('');
    const [tipoDialog, setTipoDialog] = useState<'sucesso' | 'erro'>('erro');

    const validacao = validarSenha(novaSenha);

    const handleSubmit = async () => {
        if (!validacao.valida) {
            setMensagemDialog('A senha não atende aos requisitos mínimos de segurança');
            setTipoDialog('erro');
            setDialogVisivel(true);
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setMensagemDialog('As senhas não coincidem');
            setTipoDialog('erro');
            setDialogVisivel(true);
            return;
        }

        const resultado = await alterarSenhaRecuperacao(novaSenha);

        if (resultado.sucesso) {
            setMensagemDialog(resultado.mensagem || 'Senha alterada com sucesso!\n\nVocê será redirecionado para o login.');
            setTipoDialog('sucesso');
            setDialogVisivel(true);

            setTimeout(() => {
                limparRecuperacaoSenha();
                router.replace('/entrar');
            }, 2000);
        } else {
            setMensagemDialog(resultado.mensagem || 'Erro ao alterar senha');
            setTipoDialog('erro');
            setDialogVisivel(true);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            
             <View style={styles.container}>
                    <Text style={{ ...styles.titulo, color: theme.colors.primary }}>
                        Criar Nova Senha
                    </Text>
                    <Text style={{ ...styles.descricao, color: theme.colors.onSurfaceVariant }}>
                        Escolha uma senha forte para proteger sua conta
                    </Text>

                    <TextInput
                        label="Nova Senha"
                        style={styles.input}
                        placeholder="Digite sua nova senha"
                        mode="outlined"
                        secureTextEntry={!mostrarSenha}
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        disabled={recuperarSenhaLoading}
                        right={
                            <TextInput.Icon
                                icon={mostrarSenha ? 'eye' : 'eye-off'}
                                onPress={() => setMostrarSenha(!mostrarSenha)}
                            />
                        }
                    />

                    <BarraForcaSenha
                        senha={novaSenha}
                        forca={validacao.forca as 'fraca' | 'media' | 'forte'}
                    />

                    <TextInput
                        label="Confirmar nova senha"
                        style={styles.input}
                        placeholder="Digite novamente sua senha"
                        mode="outlined"
                        secureTextEntry={!mostrarConfirmar}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        disabled={recuperarSenhaLoading}
                        right={
                            <TextInput.Icon
                                icon={mostrarConfirmar ? 'eye' : 'eye-off'}
                                onPress={() => setMostrarConfirmar(!mostrarConfirmar)}
                            />
                        }
                    />

                    {confirmarSenha && (
                        <Text
                            style={{
                                marginBottom: 8,
                                fontSize: 13,
                                color: novaSenha === confirmarSenha ? '#4CAF50' : theme.colors.error,
                                fontWeight: '600',
                            }}
                        >
                            {novaSenha === confirmarSenha ? 'Senhas coincidem' : 'Senhas não coincidem'}
                        </Text>
                    )}


                    <RequisitosSenha
                        requisitos={validacao.requisitos as any}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        loading={recuperarSenhaLoading}
                        disabled={recuperarSenhaLoading || !validacao.valida || novaSenha !== confirmarSenha}
                        style={styles.botao}
                        contentStyle={{ paddingVertical: 8 }}
                        buttonColor={tema.colors.primary}
                    >
                        {recuperarSenhaLoading ? 'Alterando senha...' : 'Confirmar Nova Senha'}
                    </Button>

                    <Button mode="outlined" onPress={voltarEtapaRecuperacao} disabled={recuperarSenhaLoading} style={styles.botaoVoltar}>
                        Voltar
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
        fontSize: 20
    },
    descricao: {
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        marginVertical: 8,
        backgroundColor: 'transparent',
    },
    botao: {
        marginVertical: 12,
    },
    botaoVoltar: {
        marginVertical: 8,
    },
});