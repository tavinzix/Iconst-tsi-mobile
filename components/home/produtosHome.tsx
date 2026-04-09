import { DadosContext } from '@/context/DadosProvider';
import React, { useContext, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, } from 'react-native'
import { getPrimeiraImagem } from "../../utils/primeira-imagem"
import { Icon } from 'react-native-paper';
import tema from '@/utils/tema';

export function ProdutosHome() {
    const { listaProdutos, buscaProdutos } = useContext<any>(DadosContext);

    useEffect(() => {
        buscaProdutos()
    }, [])

    console.log("LISTA DE PRODUTOS" + listaProdutos)

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitulo}>Produtos em Destaque</Text>
            </View>

            <View style={styles.grid}>
                {listaProdutos.map((produto: any) => (
                    <TouchableOpacity key={produto.id} style={styles.card} activeOpacity={0.8}
                        onPress={() => alert(`abrir pagina com o produto ${produto.nome}`)}
                    >
                        <View style={styles.imagemContainer}>
                            <Image source={{ uri: getPrimeiraImagem(produto) }} style={styles.imagem} />
                        </View>

                        <View style={styles.informacao}>
                            <Text style={styles.nome} numberOfLines={2}>{produto.nome}</Text>
                            <Text style={styles.preco}>R$ {produto.vendedorProduto.preco}</Text>
                            <TouchableOpacity
                                style={styles.botaoAdicionar}
                                onPress={() => alert(`adicionar produto ao carrinho ${produto.nome}`)}
                            >

                                <View>
                                    <Text style={styles.botaoAdicionarTexto}>
                                        <Icon source="cart-outline" size={20} color={tema.colors.primary} />
                                        Adicionar
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.verTodosProdutos}
                onPress={() => alert('abrir todos os produtos')}
            >
                <Text style={styles.verTodosProdutosTexto}>Ver Todos os Produtos {'\u2192'}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    header: {
        marginBottom: 12,
    },
    headerTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    card: {
        width: '48.5%',
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        overflow: 'hidden',
    },
    imagemContainer: {
        height: 130,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagem: {
        width: 180,
        height: 150
    },
    informacao: {
        padding: 10,
    },
    nome: {
        marginTop: 10,
        fontWeight: 600,
        fontSize: 15,
        color: '#333',
        lineHeight: 17,
        marginBottom: 6,
        minHeight: 34,
    },
    preco: {
        fontSize: 16,
        color: tema.colors.primary,
        fontWeight: '700',
        marginBottom: 8,
    },
    botaoAdicionar: {
        borderWidth: 1.5,
        borderColor: tema.colors.primary,
        borderRadius: 7,
        paddingVertical: 6,
        alignItems: 'center',
    },
    botaoAdicionarTexto: {
        color: tema.colors.primary,
        fontSize: 15,
        alignItems: 'center',
        fontWeight: '600',
    },
    verTodosProdutos: {
        marginTop: 16,
        backgroundColor: tema.colors.primary,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 10
    },
    verTodosProdutosTexto: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
})