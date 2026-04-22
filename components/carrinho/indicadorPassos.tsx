import tema from '@/utils/tema'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const ETAPAS: any[] = [
    { numero: 1, label: 'Carrinho', sublabel: 'Escolha dos itens' },
    { numero: 2, label: 'Entrega', sublabel: 'Endereço e pagamento' },
    { numero: 3, label: 'Revisão', sublabel: 'Confirme seu pedido' },
]

export function IndicadorPassos({ passoAtual }: any) {
    return (
        <View style={styles.container}>
            {ETAPAS.map((etapa, index) => {
                const estaFeito = etapa.numero < passoAtual
                const estaAtivo = etapa.numero === passoAtual

                return (
                    <React.Fragment key={etapa.numero}>
                        {/* Linha conectora */}
                        {index > 0 && (
                            <View style={[styles.linha, estaFeito || estaAtivo ? styles.linhaAtiva : styles.linhaInativa,]} />
                        )}

                        <View style={styles.passoItem}>
                            {/* Círculo */}
                            <View style={[styles.circulo, estaFeito && styles.circuloFeito, estaAtivo && styles.circuloAtivo, !estaFeito && !estaAtivo && styles.circuloInativo]}>
                                {estaFeito ? (
                                    <Text style={styles.check}>✓</Text>
                                ) : (
                                    <Text style={[styles.textoCirculo, estaAtivo && styles.textoCirculoAtivo,]}>
                                        {etapa.numero}
                                    </Text>
                                )}
                            </View>

                            {/* Labels */}
                            <Text style={[styles.label, estaAtivo && styles.labelAtivo, estaFeito && styles.labelFeito]}>
                                {etapa.label}
                            </Text>
                            <Text style={styles.sublabel}>{etapa.sublabel}</Text>
                        </View>
                    </React.Fragment>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    passoItem: {
        alignItems: 'center',
        width: 80,
    },
    circulo: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    circuloAtivo: {
        backgroundColor: tema.colors.primary,
    },
    circuloFeito: {
        backgroundColor: '#2e7d32',
    },
    circuloInativo: {
        backgroundColor: '#e0e0e0',
    },
    textoCirculo: {
        fontSize: 15,
        fontWeight: '700',
        color: '#999',
    },
    textoCirculoAtivo: {
        color: '#fff',
    },
    check: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#aaa',
        textAlign: 'center',
    },
    labelAtivo: {
        color: '#FF6B00',
    },
    labelFeito: {
        color: '#2e7d32',
    },
    sublabel: {
        fontSize: 14,
        color: '#bbb',
        textAlign: 'center',
        marginTop: 2,
    },
    linha: {
        flex: 1,
        height: 2,
        marginTop: 15,
        borderRadius: 1,
    },
    linhaAtiva: {
        backgroundColor: '#2e7d32',
    },
    linhaInativa: {
        backgroundColor: '#e0e0e0',
    },
})