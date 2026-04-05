import React from 'react'
import { ScrollView, StyleSheet, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from "react-native-paper";
import { CabecalhoHome } from '@/components/home/cabecalho';

export default function HomeScreen() {
    const theme = useTheme();

    return (
        <SafeAreaView style={styles.container}>
            <CabecalhoHome/>

            <ScrollView style={{ ...styles.scroll, backgroundColor: theme.colors.background }} showsVerticalScrollIndicator={false}>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF6B00',
    },

    scroll: {
        flex: 1,
        marginBottom: -15
    },
})