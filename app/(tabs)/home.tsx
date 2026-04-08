import React from 'react'
import { ScrollView, StyleSheet, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from "react-native-paper";
import { CabecalhoHome } from '@/components/home/cabecalho';
import { BannerHome } from '@/components/home/bannerHome';
import { CategoriasHome } from '@/components/home/categoriaHome';
import { OfertasHome } from '@/components/home/ofertasHome';
import { ProdutosHome } from '@/components/home/produtosHome';
import tema from '@/utils/tema';

export default function HomeScreen() {
    const theme = useTheme();

    return (
        <SafeAreaView style={styles.container}>
            <CabecalhoHome />

            <ScrollView style={{ ...styles.scroll, backgroundColor: theme.colors.background }} showsVerticalScrollIndicator={false}>
                <BannerHome />
                <CategoriasHome />
                <OfertasHome />
                <ProdutosHome />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tema.colors.primary,
    },

    scroll: {
        flex: 1,
        marginBottom: -15
    },
})