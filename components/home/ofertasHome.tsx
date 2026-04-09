import tema from '@/utils/tema';
import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, } from 'react-native'

const ofertasMock = [
    {
        id: 1,
        nome: "Kit Ferramentas Profissional",
        imagem: "https://images.tcdn.com.br/img/img_prod/665026/kit_de_ferramentas_stanley_92_pecas_stmt74393_840_1_20201118113927.jpg",
        url: "kit-ferramentas",
        precoOriginal: 350.00,
        precoOferta: 220.00,
        desconto: 37,
        badge: "MEGA OFERTA"
    },
    {
        id: 2,
        nome: "Martelo de Unha Profissional",
        imagem: "https://images.tcdn.com.br/img/img_prod/665026/martelo_estwing_com_unha_curva_e_cabo_de_madeira_mrw20c_3527_1_9ac8d06d50a725c1c51ec6fe2b45f8c1.jpg",
        url: "martelo",
        precoOriginal: 45.90,
        precoOferta: 30.00,
        desconto: 35,
        badge: "OFERTA"
    },
    {
        id: 3,
        nome: "Furadeira de Impacto 800W",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_663469-MLB54028653959_022023-F.webp",
        url: "furadeira",
        precoOriginal: 299.90,
        precoOferta: 189.90,
        desconto: 37,
        badge: "DESTAQUE"
    },
    {
        id: 4,
        nome: "Jogo de Chaves Combinadas",
        imagem: "https://images.tcdn.com.br/img/img_prod/747310/jogo_de_chaves_combinadas_8_a_19mm_tramontina_44952108_7342_1_f0c56cc4097e9c7b59fd91cb88f9aeab.jpg",
        url: "chaves",
        precoOriginal: 120.00,
        precoOferta: 79.90,
        desconto: 33,
        badge: "TOP"
    },
    {
        id: 5,
        nome: "Parafusadeira Elétrica",
        imagem: "https://cdn.leroymerlin.com.br/products/parafusadeira_e_furadeira_de_impacto_a_bateria_12v_dewalt_dcd710c2_89553601_0001_600x600.jpg",
        url: "parafusadeira",
        precoOriginal: 450.00,
        precoOferta: 299.90,
        desconto: 33,
        badge: "QUEIMA"
    },
    {
        id: 6,
        nome: "Esquadro Profissional 30cm",
        imagem: "https://images.tcdn.com.br/img/img_prod/1096838/esquadro_de_aco_12_polegadas_30cm_1275_1_93f82c7e9871d03faa63cce65d1e5c48.jpg",
        url: "esquadro",
        precoOriginal: 65.00,
        precoOferta: 42.90,
        desconto: 34,
        badge: "OFERTA"
    }
];
console.log("LISTA DE OFERTAS" + ofertasMock)
export function OfertasHome() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitulo}>Ofertas Relâmpago</Text>
                </View>
                <TouchableOpacity
                    onPress={() => alert('abrir todas as ofertas')}
                >
                    <Text style={styles.verTodas}>Ver todas →</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {ofertasMock.map((produto) => (
                    <TouchableOpacity key={produto.id} style={styles.card} activeOpacity={0.8}
                        onPress={() => alert(`carregar pagina com o item ${produto.nome}`)}
                    >
                     
                        <View style={styles.imagemContainer}>
                            <Image source={{ uri: produto.imagem }} style={styles.imagem} />

                            {produto.desconto && (
                                <View style={styles.desconto}>
                                    <Text style={styles.descontoTexto}>-{produto.desconto}%</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.informacoes}>
                            <Text style={styles.nome} numberOfLines={2}>{produto.nome}</Text>

                            {produto.precoOriginal && (
                                <Text style={styles.precoOriginal}> De: R$ {produto.precoOriginal.toFixed(2).replace('.', ',')} </Text>
                            )}

                            <Text style={styles.precoOferta}> R$ {produto.precoOferta.toFixed(2).replace('.', ',')} </Text>

                            {produto.desconto && (
                                <Text style={styles.economize}>
                                    Economize R$ {parseFloat(produto.precoOriginal.toFixed(2).replace('.', ',')) - parseFloat(produto.precoOferta.toFixed(2).replace('.', ',')) }
                                </Text>
                            )}

                            <TouchableOpacity style={styles.botao}
                            // onPress={() => onPress(product)}
                            >
                                <Text style={styles.botaoTexto}>Ver Oferta</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    headerTitulo: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    verTodas: {
        fontSize: 16,
        color: tema.colors.primary,
        fontWeight: '600',
        marginTop: 2,
    },
    scroll: {
        paddingHorizontal: 16,
        gap: 10,
    },
    card: {
        width: 148,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        overflow: 'hidden',
    },
    imagemContainer: {
        height: 104,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    imagem: {
        width: 100,
        height: 100
    },
    desconto: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#e53935',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
    },
    descontoTexto: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '700',
    },
    informacoes: {
        padding: 10,
    },
    nome: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
        lineHeight: 16,
        marginBottom: 4,
        minHeight: 32,
    },
    precoOriginal: {
        fontSize: 11,
        color: '#aaa',
        textDecorationLine: 'line-through',
        marginBottom: 2,
    },
    precoOferta: {
        fontSize: 15,
        color: tema.colors.primary,
        fontWeight: '700',
        marginBottom: 2,
    },
    economize: {
        fontSize: 11,
        color: '#2e7d32',
        fontWeight: '500',
        marginBottom: 8,
    },
    botao: {
        backgroundColor: tema.colors.primary,
        borderRadius: 7,
        paddingVertical: 7,
        alignItems: 'center',
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
})