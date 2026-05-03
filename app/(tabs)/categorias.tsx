import React, { useContext, useEffect } from 'react'
import { StyleSheet, ScrollView, View, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router'
import { Text, useTheme } from 'react-native-paper'
import { DadosContext } from '@/context/DadosProvider'
import tema from '@/utils/tema'

export default function CategoriasScreen() {
    const router = useRouter()
    const { listaCategorias, buscaCategoriaAtiva, loading } = useContext<any>(DadosContext)
    const theme = useTheme();

    useEffect(() => {
        buscaCategoriaAtiva()
    }, [])

    const acessarCategoria = (categoria: any) => {
        router.push({
            pathname: '/produtosPorCategoria',
            params: { slug: categoria.url, nome: categoria.nome }
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitulo}>Categorias</Text>
            </View>

            {loading ? (
                <View style={styles.carregarContainer}>
                    <ActivityIndicator size="large" color={tema.colors.primary} />
                    <Text style={styles.carregarTexto}>Carregando categorias...</Text>
                </View>
            ) : (
                    <ScrollView style={{ ...styles.scroll, backgroundColor: theme.colors.surface }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.conteudo}>
                    {listaCategorias.map((categoria: any) => (
                        <TouchableOpacity key={categoria.id} style={styles.categoriaCard} onPress={() => acessarCategoria(categoria)} activeOpacity={0.8}>
                            <Image source={{ uri: categoria.imagem }} style={styles.categoriaImagem} />
                            <View style={styles.categoriaInfo}>
                                <Text style={styles.categoriaNome}>{categoria.nome}</Text>
                                <Text style={styles.categoriaFlecha}>{'\u2192'}</Text>
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
    },
    header: {
        backgroundColor: tema.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerTitulo: {
        color: tema.colors.white,
        fontSize: 22,
        fontWeight: '700',
    },
    scroll: {
        flex: 1,
    },
    conteudo: {
        padding: 16,
        gap: 12,
    },
    carregarContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carregarTexto: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    categoriaCard: {
        flexDirection: 'row',
        backgroundColor: tema.colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        alignItems: 'center',
    },
    categoriaImagem: {
        width: 100,
        height: 100,
        backgroundColor: '#f8f8f8',
    },
    categoriaInfo: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoriaNome: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    categoriaFlecha: {
        fontSize: 25,
        color: tema.colors.primary,
        fontWeight: '700',
    },
})