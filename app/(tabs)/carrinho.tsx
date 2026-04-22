import React from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { IndicadorPassos } from '@/components/carrinho/indicadorPassos'
import { EscolherItens } from '@/components/carrinho/escolherItens'
import { EndPag } from '@/components/carrinho/endPag'
import { Revisao } from '@/components/carrinho/revisao'
import { useCheckout } from '@/context/CheckoutProvider'
import { useCarrinho } from '@/context/CarrinhoProvider'
import tema from '@/utils/tema'

export default function Carrinho() {
    const { etapaAtual, setEtapaAtual } = useCheckout()
    const { buscaCarrinho } = useCarrinho()

    // buscar carrinho sempre que entrar na tela
    useFocusEffect(
        React.useCallback(() => {
            buscaCarrinho()
        }, [])
    )

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitulo}>
                    {etapaAtual === 1 && 'Meu Carrinho'}
                    {etapaAtual === 2 && 'Entrega e Pagamento'}
                    {etapaAtual === 3 && 'Revisão do Pedido'}
                </Text>
            </View>

            <IndicadorPassos passoAtual={etapaAtual} />

            <View style={styles.content}>
                {etapaAtual === 1 && <EscolherItens onNext={() => setEtapaAtual(2)} />}
                {etapaAtual === 2 && (
                    <EndPag onNext={() => setEtapaAtual(3)} onBack={() => setEtapaAtual(1)} />
                )}
                {etapaAtual === 3 && <Revisao onBack={() => setEtapaAtual(2)} />}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tema.colors.primary,
    },
    header: {
        backgroundColor: tema.colors.primary,
        paddingHorizontal: 20,
        paddingBottom: 14,
        paddingTop: 6,
    },
    headerTitulo: {
        color: tema.colors.white,
        fontSize: 20,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        backgroundColor: '#F5F5F0',
    },
})