import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, } from 'react-native'
import { router } from 'expo-router'
import { useCheckout } from '@/context/CheckoutProvider'
import { useEndereco } from '@/context/EnderecoProvider'
import { useFormaPagamento } from '@/context/FormaPagamentoProvider'
import { useCarrinho } from '@/context/CarrinhoProvider'
import tema from '@/utils/tema'

export function Revisao({ onBack }: any) {
    const { itensSelecionados, enderecoSelecionado, pagamentoSelecionado, calcularTotal, calcularFrete, finalizarPedido } = useCheckout()
    const { listaCarrinho } = useCarrinho()
    const { endereco } = useEndereco()
    const { formaPagamento } = useFormaPagamento()

    const [loading, setLoading] = useState(false)

    const itensSelecionadosCompletos = listaCarrinho.filter((item) => itensSelecionados.includes(item.id))
    const enderecoSelecionadoCompleto = endereco?.endereco?.find((e: any) => e.id === enderecoSelecionado)
    const subtotal = calcularTotal()
    const frete = calcularFrete()
    const total = subtotal + frete

    function getFormaPagamentoLabel(): { nome: string, numero?: string } {
        if (!pagamentoSelecionado) return { nome: '—' }
        if (pagamentoSelecionado === 'pix') return { nome: 'PIX' }
        if (pagamentoSelecionado === 'boleto') return { nome: 'Boleto Bancário' }

        const fp = formaPagamento?.fp?.find((f: any) => f.id === pagamentoSelecionado)
        return {
            nome: fp?.nomeCartao || 'Cartão',
            numero: `•••• •••• •••• ${fp?.numeroCartao?.slice(-4)}`,
        }
    }

    const pagamento = getFormaPagamentoLabel()

    async function handleConfirmar() {
        setLoading(true)
        try {
            const result = await finalizarPedido()

            if (!result.sucesso) {
                Alert.alert('Erro', result.mensagem || 'Não foi possível confirmar o pedido.')
                return
            }

            Alert.alert('Pedido confirmado!', 'Seu pedido foi realizado com sucesso. Acompanhe na aba Pedidos.', [
                {
                    text: 'Ver meus pedidos',
                    onPress: () => router.replace('/(tabs)/pedidos'),
                },
            ])
        } catch (err: any) {
            Alert.alert('Erro', err.message || 'Não foi possível confirmar o pedido. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={styles.secaoCard}>
                    <Text style={styles.secaoTitulo}>Itens do Pedido</Text>
                    {itensSelecionadosCompletos.map((item) => {
                        const imageUrl = item.produto.imagens[0]?.imagemUrl
                        const itemTotal = Number(item.precoUnitario) * item.quantidade

                        return (
                            <View key={item.id} style={styles.itemlinha}>
                                <View style={styles.itemImagemmExterior}>
                                    <Image source={{ uri: imageUrl }} style={styles.itemImagem} />
                                </View>
                                <View style={styles.dadosProduto}>
                                    <Text style={styles.dadosNome} numberOfLines={2}>{item.produto.nome}</Text>
                                    <Text style={styles.dadosVendedor}>{item.produto.vendedor?.nome}</Text>
                                    <Text style={styles.dadosQuantidade}>Qtd: {item.quantidade}</Text>
                                </View>
                                <Text style={styles.itemTotal}>R$ {itemTotal.toFixed(2).replace('.', ',')}</Text>
                            </View>
                        )
                    })}
                </View>

                <View style={styles.secaoCard}>
                    <Text style={styles.secaoTitulo}>Endereço de Entrega</Text>

                    <View>
                        <Text style={styles.enderecoTipo}>{enderecoSelecionadoCompleto?.tipo}</Text>
                        <Text style={styles.enderecoTexto}>{enderecoSelecionadoCompleto?.rua}</Text>
                        <Text style={styles.enderecoTexto}>
                            {enderecoSelecionadoCompleto?.cidade}/{enderecoSelecionadoCompleto?.estado}{'   | '}  {enderecoSelecionadoCompleto?.cep}
                        </Text>
                        {enderecoSelecionadoCompleto?.complemento && (
                            <Text style={styles.enderecoTexto}>{enderecoSelecionadoCompleto.complemento}</Text>
                        )}
                    </View>

                </View>

                <View style={styles.secaoCard}>
                    <Text style={styles.secaoTitulo}>Forma de Pagamento</Text>
                    <View>
                        <Text style={styles.pagamentoTexto}>{pagamento.nome}</Text>
                        <Text style={styles.pagamentoTexto}>{pagamento.numero}</Text>
                    </View>
                </View>

                <View style={styles.secaoCard}>
                    <Text style={styles.secaoTitulo}>Resumo da Compra</Text>
                    <View style={styles.resumoLinha}>
                        <Text style={styles.resumoLabel}>
                            Subtotal ({itensSelecionados.length}{' '}
                            {itensSelecionados.length === 1 ? 'item' : 'itens'}):
                        </Text>
                        <Text style={styles.resumoValor}>R$ {subtotal.toFixed(2).replace('.', ',')}</Text>
                    </View>
                    <View style={styles.resumoLinha}>
                        <Text style={styles.resumoLabel}>Frete:</Text>
                        <Text style={styles.resumoValor}>R$ {frete.toFixed(2).replace('.', ',')}</Text>
                    </View>
                    <View style={[styles.resumoLinha, styles.totalLinha]}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValor}>R$ {total.toFixed(2).replace('.', ',')}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.botoes}>
                <TouchableOpacity style={styles.confirmarBotao} onPress={handleConfirmar} disabled={loading} activeOpacity={0.8}>
                    {loading ? (
                        <ActivityIndicator color={tema.colors.white} />
                    ) : (
                        <Text style={styles.confirmarBotaoTexto}>Confirmar Pedido</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.voltarBotao} onPress={onBack} activeOpacity={0.8} disabled={loading}>
                    <Text style={styles.voltarBotaoTexto}>← Voltar e Editar</Text>
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
        padding: 16,
        gap: 12,
        paddingBottom: 100
    },
    secaoCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 16,
        gap: 6,
    },
    secaoTitulo: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a'
    },
    itemlinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
    },
    itemImagemmExterior: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    itemImagem: {
        width: 50,
        height: 50,
        borderRadius: 8
    },
    dadosProduto: {
        flex: 1,
        gap: 2
    },
    dadosNome: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1a1a1a',
        lineHeight: 17
    },
    dadosVendedor: {
        fontSize: 11,
        color: '#aaa'
    },
    dadosQuantidade: {
        fontSize: 11,
        color: '#888'
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '700',
        color: tema.colors.primary,
        flexShrink: 0
    },
    enderecoTipo: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a'
    },
    enderecoTexto: {
        fontSize: 13,
        color: '#555'
    },
    pagamentoTexto: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500'
    },
    resumoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    resumoLabel: {
        fontSize: 13,
        color: '#555'
    },
    resumoValor: {
        fontSize: 13,
        color: '#555'
    },
    totalLinha: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
        marginTop: 4
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a'
    },
    totalValor: {
        fontSize: 18,
        fontWeight: '800',
        color: tema.colors.primary
    },

    botoes: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        gap: 8,
    },
    confirmarBotao: {
        backgroundColor: tema.colors.primary,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    confirmarBotaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700'
    },
    voltarBotao: {
        borderWidth: 1.5,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    voltarBotaoTexto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555'
    },
})