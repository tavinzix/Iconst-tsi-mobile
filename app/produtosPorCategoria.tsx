import React, { useState, useEffect, useContext } from 'react'
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router'
import { useTheme, Text, Icon, ActivityIndicator } from 'react-native-paper'
import { getPrimeiraImagem } from '@/utils/primeira-imagem'
import tema from '@/utils/tema'
import { DadosContext } from '@/context/DadosProvider'

export default function ProdutosPorCategoriaScreen() {
    const { buscarProdutosCategoria } = useContext<any>(DadosContext);

    const router = useRouter()
    const theme = useTheme()
    const { slug, nome } = useLocalSearchParams()

    const [produtos, setProdutos] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [nomeCategoria, setNomeCategoria] = useState<string>(typeof nome === 'string' ? nome : nome?.[0] || 'Categoria')

    useFocusEffect(
        React.useCallback(() => {
            if (slug) {
                carregarProdutos()
            }
        }, [slug])
    )

    async function carregarProdutos() {
        const slugUrl = typeof slug === 'string' ? slug : slug?.[0]
        setLoading(true)

        try {
            const data = await buscarProdutosCategoria(slugUrl)
            setProdutos(data || [])

            if (data && data.length > 0 && data[0].categoria) {
                setNomeCategoria(data[0].categoria.nome)
            }
        } catch (err) {
            console.error('Erro ao buscar produtos:', err)
        } finally {
            setLoading(false)
        }
    }

    const produtoSelecionado = (produtoSlug: string) => {
        router.push({
            pathname: '/detalhesProduto',
            params: { slug: produtoSlug }
        })
    }

    if (loading) {
        return (
            <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Icon source="arrow-left" size={24} color={theme.colors.onBackground} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{nomeCategoria}</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} size="large" color={tema.colors.primary} />
                    <Text style={{ marginTop: 16 }}>Carregando produtos</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon source="arrow-left" size={24} color={theme.colors.onBackground} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{nomeCategoria}</Text>
            </View>

            {/*contador*/}
            <View style={styles.contador}>
                <Text style={styles.contadorTexto}>
                    {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'} encontrado{produtos.length !== 1 ? 's' : ''}
                </Text>
            </View>

            {produtos.length === 0 ? (
                <View style={styles.vazio}>
                    <Text style={styles.vazioTitulo}>Nenhum produto encontrado</Text>
                </View>
            ) : (
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>
                    {produtos.map((produto: any) => (
                        <TouchableOpacity key={produto.id} style={styles.card} activeOpacity={0.8} onPress={() => produtoSelecionado(produto.slug)}>
                            <View style={styles.imagemContainer}>
                                <View style={styles.imagemExterior}>
                                    <Image source={{ uri: getPrimeiraImagem(produto) }} style={styles.imagem} />
                                </View>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.nome} numberOfLines={2}>{produto.nome}</Text>
                                <View style={styles.preco}>
                                    <Text style={styles.precoValor}>
                                        R$ {Number(produto.vendedorProduto?.preco || 0).toFixed(2)}
                                    </Text>
                                </View>

                                <View style={styles.botao}>
                                    <Icon source="plus" size={18} color={tema.colors.primary} />
                                    <Text style={styles.botaoTexto}> Ver Detalhes </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tema.colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: tema.colors.primary,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: tema.colors.white,
        textAlign: 'center',
        marginHorizontal: 12,
    },
    contador: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f5f5f5',
    },
    contadorTexto: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    gridContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        overflow: 'hidden',
        marginBottom: 10,
        width: '48.5%',
    },
    imagemContainer: {
        position: 'relative',
        height: 140,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagemExterior: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagem: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    info: {
        padding: 10,
        gap: 8,
    },
    nome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        lineHeight: 18,
        minHeight: 36,
    },
    preco: {
        marginVertical: 4,
    },
    precoValor: {
        fontSize: 16,
        fontWeight: '700',
        color: tema.colors.primary,
    },
    botao: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: tema.colors.primary,
        borderRadius: 8,
        paddingVertical: 8,
        gap: 6,
    },
    botaoTexto: {
        color: tema.colors.primary,
        fontSize: 13,
        fontWeight: '600',
    },
    vazio: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        gap: 12,
    },
    vazioTitulo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
})