import React from 'react'
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native'
import { useCarrinho } from '@/context/CarrinhoProvider'
import { useCheckout } from '@/context/CheckoutProvider'
import { Text } from 'react-native-paper'
import tema from '@/utils/tema'

export function EscolherItens({ onNext }: any) {
    const { listaCarrinho, removeItem, atualizaQuantidade, loading } = useCarrinho()
    const { itensSelecionados, setItensSelecionados } = useCheckout()

    function selecionaItem(id: number) {
        setItensSelecionados((prev: number[]) => {
            const uniqueIds = new Set(prev)
            if (uniqueIds.has(id)) {
                uniqueIds.delete(id)
            } else {
                uniqueIds.add(id)
            }
            return Array.from(uniqueIds)
        })
    }

    function alterarQuantidade(itemId: number, delta: number) {
        const item = listaCarrinho.find((i) => i.id === itemId)
        if (!item) return

        const novaQuantidade = Math.max(1, item.quantidade + delta)
        atualizaQuantidade(itemId, novaQuantidade)
    }

    function removerItem(item: any) {
        Alert.alert('Remover item', `Remover "${item.produto.nome}" do carrinho?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Remover',
                style: 'destructive',
                onPress: async () => {
                    await removeItem(item.id)
                    if (itensSelecionados.includes(item.id)) {
                        setItensSelecionados(itensSelecionados.filter((id: number) => id !== item.id))
                    }
                },
            },
        ])
    }

    function avancarEtapa() {
        if (itensSelecionados.length === 0) {
            Alert.alert('Atenção', 'Selecione ao menos um item para continuar.')
            return
        }
        onNext()
    }

    const subtotal = itensSelecionados.reduce((total: any, itemId: number) => {
        const item = listaCarrinho.find((i) => i.id === itemId)
        if (item) {
            return total + Number(item.precoUnitario) * item.quantidade
        }
        return total
    }, 0)

    const itensSelecionadosCompletos = listaCarrinho.filter((item) => itensSelecionados.includes(item.id))

    if (loading) {
        return (
            <View style={styles.carregarContainer}>
                <ActivityIndicator size="large" color={tema.colors.primary} />
                <Text style={styles.carregarTexto}>Carregando carrinho...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.conteudoScroll}>
                {listaCarrinho.length === 0 ? (
                    <View style={styles.carrinhoVazio}>
                        <Text style={styles.carrinhoEmoji}>🛒</Text>
                        <Text style={styles.carrinhoTitulo}>Seu carrinho está vazio</Text>
                        <Text style={styles.carrinhoSubtitulo}>Adicione produtos para continuar</Text>
                    </View>
                ) : (
                    listaCarrinho.map((item) => {
                        const isSelected = itensSelecionados.includes(item.id)
                        const imageUrl = item.produto.imagens[0]?.imagemUrl

                        return (
                            <View key={item.id} style={styles.card}>
                                {/* Botão remover */}
                                <TouchableOpacity style={styles.botaoRemover} onPress={() => removerItem(item)}>
                                    <Text style={styles.botaoRemoverTexto}>X</Text>
                                </TouchableOpacity>

                                <View style={styles.cardConteudo}>
                                    {/* Checkbox de seleção */}
                                    <TouchableOpacity style={[styles.checkbox, isSelected && styles.checkboxMarcado]} onPress={() => selecionaItem(item.id)}>
                                        {isSelected && <Text style={styles.checkboxMarcadoTexto}>✓</Text>}
                                    </TouchableOpacity>

                                    {/* Imagem do produto */}
                                    <View style={styles.imagemExterior}>
                                        <Image source={{ uri: imageUrl }} style={styles.imagemProduto} />
                                    </View>

                                    {/* Informações do produto */}
                                    <View style={styles.produtoExterior}>
                                        <Text style={styles.produtoNome} numberOfLines={2}>{item.produto.nome}</Text>
                                        <Text style={styles.produtoVendedor}>
                                            Vendido por:
                                            <Text style={{ color: tema.colors.primary, fontWeight: '600' }}> {item.produto.vendedor?.nome}</Text>
                                        </Text>
                                        {item.precoAlterado && (
                                            <Text style={styles.alertaPreco}>Preço alterado desde adição</Text>
                                        )}
                                        <Text style={styles.produtoPreco}>
                                            Preço:{' '}
                                            <Text style={{ color: tema.colors.primary, fontWeight: '700', fontSize: 13 }}>
                                                R$ {Number(item.precoUnitario).toFixed(2).replace('.', ',')}
                                            </Text>
                                        </Text>
                                    </View>
                                </View>

                                {/* quantidade */}
                                <View style={styles.quantidadeExterior}>
                                    <Text style={{ fontSize: 13, color: '#555' }}>Quantidade:</Text>
                                    <View style={styles.botoesExterior}>
                                        <TouchableOpacity style={styles.quantidadeBotao} onPress={() => alterarQuantidade(item.id, -1)}>
                                            <Text style={styles.quantidadeBotaoTexto}>-</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.quantidadeValor}>{item.quantidade}</Text>

                                        <TouchableOpacity style={styles.quantidadeBotao} onPress={() => alterarQuantidade(item.id, +1)}>
                                            <Text style={styles.quantidadeBotaoTexto}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                )}
            </ScrollView>

            {/* Resumo*/}
            {listaCarrinho.length > 0 && (
                <View style={styles.resumoExterior}>
                    <View style={styles.resumoLinha}>
                        <Text style={styles.resumoLabel}>Itens selecionados: {itensSelecionados.length}</Text>
                        <View>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValor}>R$ {subtotal.toFixed(2).replace('.', ',')}</Text>
                        </View>
                    </View>

                    {itensSelecionadosCompletos.length > 0 && (
                        <View style={{ gap: 2 }}>
                            {itensSelecionadosCompletos.slice(0, 3).map((item) => (
                                <Text key={item.id} style={styles.resumoItem}>
                                    {'\u2022'} {item.produto.nome} (x{item.quantidade})
                                </Text>
                            ))}
                            {itensSelecionadosCompletos.length > 3 && (
                                <Text style={styles.resumoItem}>
                                    +{itensSelecionadosCompletos.length - 3} item(ns)
                                </Text>
                            )}
                        </View>
                    )}

                    <TouchableOpacity activeOpacity={0.8} onPress={avancarEtapa} disabled={itensSelecionados.length === 0}
                        style={[styles.botaoAvancar, itensSelecionados.length === 0 && styles.botaoAvancarDesabilitador]}>
                            
                        <Text style={styles.botaoAvancarTexto}>Continuar para Entrega →</Text>
                    </TouchableOpacity>
                    <Text style={styles.nextHint}>Frete e prazo serão calculados na próxima etapa</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    carregarContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    carregarTexto: {
        marginTop: 10,
        fontSize: 15,
        color: '#666'
    },
    conteudoScroll: {
        padding: 15,
        gap: 10,
        paddingBottom: 100
    },
    carrinhoVazio: {
        alignItems: 'center',
        paddingVertical: 60,
        gap: 8
    },
    carrinhoEmoji: {
        fontSize: 55
    },
    carrinhoTitulo: {
        fontSize: 17,
        fontWeight: '700',
        color: '#333'
    },
    carrinhoSubtitulo: {
        fontSize: 14,
        color: '#aaa'
    },
    card: {
        backgroundColor: tema.colors.white,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 15,
        gap: 10,
        position: 'relative',
    },
    cardConteudo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        paddingLeft: 10
    },
    botaoRemover: {
        position: 'absolute',
        top: 8,
        left: 8,
        width: 22,
        height: 22,
        borderRadius: 4,
        backgroundColor: tema.colors.danger,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    botaoRemoverTexto: {
        color: tema.colors.white,
        fontSize: 10, fontWeight: '700'
    },
    checkbox: {
        width: 25,
        height: 25,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 52,
        flexShrink: 0,
    },
    checkboxMarcado: {
        backgroundColor: tema.colors.primary,
        borderColor: tema.colors.primary
    },
    checkboxMarcadoTexto: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700'
    },
    imagemExterior: {
        width: 65,
        height: 65,
        borderRadius: 10,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 25
    },
    imagemProduto: {
        width: 65,
        height: 65,
        borderRadius: 10
    },
    produtoExterior: {
        flex: 1,
        gap: 3
    },
    produtoNome: {
        fontSize: 15,
        fontWeight: '700',
        color: tema.colors.primary,
        lineHeight: 20
    },
    produtoVendedor: {
        fontSize: 13,
        color: '#555'
    },
    produtoPreco: {
        fontSize: 13,
        color: '#555'
    },
    alertaPreco: {
        fontSize: 11,
        color: tema.colors.warning,
        fontWeight: '600'
    },
    quantidadeExterior: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
    },
    botoesExterior: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    quantidadeBotao: {
        width: 34,
        height: 34,
        backgroundColor: tema.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantidadeBotaoTexto: {
        color: tema.colors.white,
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 20
    },
    quantidadeValor: {
        width: 40,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    resumoExterior: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 16,
        gap: 8,
    },
    resumoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    resumoLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333'
    },
    totalLabel: {
        fontSize: 11,
        color: '#aaa',
        textAlign: 'right'
    },
    totalValor: {
        fontSize: 18,
        fontWeight: '700',
        color: tema.colors.primary,
        textAlign: 'right'
    },
    resumoItem: {
        fontSize: 12,
        color: '#888'
    },
    botaoAvancar: {
        backgroundColor: tema.colors.primary,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 4,
    },
    botaoAvancarDesabilitador: {
        backgroundColor: '#ffb580'
    },
    botaoAvancarTexto: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700'
    },
    nextHint: {
        fontSize: 11,
        color: '#aaa',
        textAlign: 'center'
    },
})