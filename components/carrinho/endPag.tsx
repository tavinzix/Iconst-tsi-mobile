import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useCheckout } from '@/context/CheckoutProvider'
import { useEndereco } from '@/context/EnderecoProvider'
import { useFormaPagamento } from '@/context/FormaPagamentoProvider'
import { Text } from 'react-native-paper'
import { useFocusEffect } from 'expo-router'
import tema from '@/utils/tema'

export function EndPag({ onNext, onBack }: any) {
    const { enderecoSelecionado, setEnderecoSelecionado, pagamentoSelecionado, setPagamentoSelecionado, calcularTotal, calcularFrete } = useCheckout()
    const { endereco, buscarEndereco } = useEndereco()
    const { formaPagamento, buscarFormaPagamento } = useFormaPagamento()

    const [loading, setLoading] = useState(false)

    const subtotal = calcularTotal()
    const frete = calcularFrete()
    const total = subtotal + frete

    function avancarEtapa() {
        if (!enderecoSelecionado) {
            Alert.alert('Atenção', 'Selecione um endereço de entrega.')
            return
        }
        if (!pagamentoSelecionado) {
            Alert.alert('Atenção', 'Selecione uma forma de pagamento.')
            return
        }
        onNext()
    }

    const carregarDados = async () => {
        setLoading(true)
        await buscarEndereco();
        await buscarFormaPagamento();
        setLoading(false)
    }

    useFocusEffect(
        React.useCallback(() => {
            carregarDados()
        }, [])
    )

    const enderecos = endereco?.endereco || []
    const formasPagamento = formaPagamento?.fp || []

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={tema.colors.primary} />
                <Text style={styles.loadingTexto}>Carregando informações...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={styles.secaoCard}>
                    <Text style={styles.secaoTitulo}>Endereço de Entrega</Text>

                    {enderecos.length === 0 ? (
                        <View style={{ padding: 16, alignItems: 'center' }}>
                            <Text style={{ fontSize: 13, color: '#999' }}>Nenhum endereço cadastrado</Text>
                        </View>
                    ) : (
                        enderecos.map((end) => (
                            <TouchableOpacity key={end.id} onPress={() => setEnderecoSelecionado(end.id)} activeOpacity={0.8}
                                style={[styles.cardOpcao, enderecoSelecionado === end.id && styles.cardOpcaoSelecionado]}>

                                <View style={[styles.radio, enderecoSelecionado === end.id && styles.radioSelecionado]}>
                                    {enderecoSelecionado === end.id && <View style={styles.radioponto} />}
                                </View>
                                <View style={styles.dadosExterior}>
                                    <Text style={styles.dadosTitulo}>{end.tipo}</Text>
                                    <Text style={styles.dadosSubtitulo}>{end.rua}</Text>
                                    <Text style={styles.dadosSubtitulo}>{end.cidade}/{end.estado} {end.cep}</Text>
                                    {end.complemento && (
                                        <Text style={styles.dadosSubtitulo}>Complemento: {end.complemento}</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))
                    )}

                    <TouchableOpacity onPress={() => { }}>
                        <Text style={styles.cadastrarNovo}>+ Adicionar novo endereço</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.secaoCard}>
                    <Text style={styles.secaoTitulo}>Forma de Pagamento</Text>

                    {formasPagamento.length > 0 && (
                        <>
                            <Text style={styles.secaoLabel}>Cartões Cadastrados</Text>
                            {formasPagamento.map((card: any) => (
                                <TouchableOpacity key={card.id} onPress={() => setPagamentoSelecionado(card.id)} activeOpacity={0.8}
                                    style={[styles.cardOpcao, pagamentoSelecionado === card.id && styles.cardOpcaoSelecionado]} >

                                    <View style={[styles.radio, pagamentoSelecionado === card.id && styles.radioSelecionado]}>
                                        {pagamentoSelecionado === card.id && <View style={styles.radioponto} />}
                                    </View>
                                    <View style={styles.dadosExterior}>
                                        <Text style={styles.dadosTitulo}>{card.nomeCartao}</Text>
                                        <Text style={styles.dadosSubtitulo}>{card.nomeTitular}</Text>
                                        <Text style={styles.dadosSubtitulo}>•••• •••• •••• {card.numeroCartao?.slice(-4)}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}

                    <Text style={styles.secaoLabel}>Outras Formas de Pagamento</Text>

                    {/* pix */}
                    <TouchableOpacity onPress={() => setPagamentoSelecionado('pix')} activeOpacity={0.8}
                        style={[styles.cardOpcao, pagamentoSelecionado === 'pix' && styles.cardOpcaoSelecionado]}>

                        <View style={[styles.radio, pagamentoSelecionado === 'pix' && styles.radioSelecionado]}>
                            {pagamentoSelecionado === 'pix' && <View style={styles.radioponto} />}
                        </View>
                        <View style={styles.dadosExterior}>
                            <Text style={styles.dadosTitulo}>PIX</Text>
                            <Text style={styles.dadosSubtitulo}>Aprovação imediata</Text>
                        </View>
                    </TouchableOpacity>

                    {/* boleto */}
                    <TouchableOpacity style={[styles.cardOpcao, pagamentoSelecionado === 'boleto' && styles.cardOpcaoSelecionado]}
                        onPress={() => setPagamentoSelecionado('boleto')} activeOpacity={0.8}>

                        <View style={[styles.radio, pagamentoSelecionado === 'boleto' && styles.radioSelecionado]}>
                            {pagamentoSelecionado === 'boleto' && <View style={styles.radioponto} />}
                        </View>
                        <View style={styles.dadosExterior}>
                            <Text style={styles.dadosTitulo}>Boleto</Text>
                            <Text style={styles.dadosSubtitulo}>Aprovação em até 3 dias úteis</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }}>
                        <Text style={styles.cadastrarNovo}>+ Adicionar novo cartão</Text>
                    </TouchableOpacity>
                </View>

                {/*resumo pedido*/}
                <View style={styles.secaoCard}>
                    <Text style={styles.secaoTitulo}>Resumo do Pedido</Text>
                    <View style={styles.resumoLinha}>
                        <Text style={styles.resumoLabel}>Itens:</Text>
                        <Text style={styles.resumoValor}>R$ {subtotal.toFixed(2).replace('.', ',')}</Text>
                    </View>
                    <View style={styles.resumoLinha}>
                        <Text style={styles.resumoLabel}>Frete:</Text>
                        <Text style={styles.resumoValor}>R$ {frete.toFixed(2).replace('.', ',')}</Text>
                    </View>
                    <View style={[styles.resumoLinha, styles.resumoTotalLinha]}>
                        <Text style={styles.resumoTotalLabel}>Total:</Text>
                        <Text style={styles.resumoTotal}>R$ {total.toFixed(2).replace('.', ',')}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.botoes}>
                <TouchableOpacity style={styles.botaoVoltar} onPress={onBack} activeOpacity={0.8}>
                    <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoAvancar} onPress={avancarEtapa} activeOpacity={0.8}>
                    <Text style={styles.botaoAvancarTexto}>Revisar Pedido →</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scroll: {
        padding: 15,
        gap: 12,
        paddingBottom: 100
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingTexto: {
        marginTop: 12,
        fontSize: 14,
        color: '#666'
    },
    secaoCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 16,
        gap: 10,
    },
    secaoTitulo: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 2
    },
    secaoLabel: {
        fontSize: 13,
        color: '#888',
        fontWeight: '600',
        marginTop: 4
    },
    cardOpcao: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        gap: 12,
    },
    cardOpcaoSelecionado: {
        borderColor: tema.colors.primary,
        backgroundColor: '#FFF8F4'
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
        flexShrink: 0,
    },
    radioSelecionado: {
        borderColor: tema.colors.primary
    },
    radioponto: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: tema.colors.primary,
    },
    dadosExterior: {
        flex: 1,
        gap: 2
    },
    dadosTitulo: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1a1a1a'
    },
    dadosSubtitulo: {
        fontSize: 15,
        color: '#888'
    },

    cadastrarNovo: {
        fontSize: 15,
        color: tema.colors.primary,
        fontWeight: '600'
    },

    resumoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    resumoLabel: {
        fontSize: 15,
        color: '#555'
    },
    resumoValor: {
        fontSize: 15,
        color: '#555'
    },
    resumoTotalLinha: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
        marginTop: 4
    },
    resumoTotalLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a'
    },
    resumoTotal: {
        fontSize: 15,
        fontWeight: '700',
        color: tema.colors.primary
    },

    botoes: {
        flexDirection: 'row',
        gap: 10,
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    botaoVoltar: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
    },
    botaoVoltarTexto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555'
    },
    botaoAvancar: {
        flex: 2,
        backgroundColor: tema.colors.primary,
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
    },
    botaoAvancarTexto: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff'
    },
})