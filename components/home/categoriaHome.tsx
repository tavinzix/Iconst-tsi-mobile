import { DadosContext } from '@/context/DadosProvider';
import { router } from 'expo-router';
import React, { useContext, useEffect, } from 'react'
import { View, ScrollView, TouchableOpacity, StyleSheet, Image, } from 'react-native'
import { Text } from "react-native-paper";

export function CategoriasHome() {
    const { listaCategorias, buscaCategoriaAtiva } = useContext<any>(DadosContext);

    useEffect(() => {
        buscaCategoriaAtiva();
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Categorias</Text>
                <TouchableOpacity onPress={() => router.navigate("../(tabs)/categorias")}>
                    <Text style={styles.verTodas}>Ver todas {'\u2192'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {listaCategorias.map((cat: any) => (
                    <TouchableOpacity key={cat.id} style={styles.item} activeOpacity={0.7} onPress={() => alert(`carregar itens da categoria ${cat.nome}`)}>
                        <View>
                            <Image source={{ uri: cat.imagem }} style={styles.circulo} />
                        </View>
                        <Text style={styles.nome} numberOfLines={2}> {cat.nome}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    titulo: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    verTodas: {
        fontSize: 16,
        color: '#FF6B00',
        fontWeight: '800',
    },
    scroll: {
        paddingHorizontal: 16,
        gap: 12,
    },
    item: {
        alignItems: 'center',
        width: 75,
        gap: 5,
    },
    circulo: {
        width: 75,
        height: 75,
        borderRadius: 30,
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#e8e8e8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nome: {
        fontSize: 11,
        color: '#555',
        textAlign: 'center',
        lineHeight: 14,
    },
})