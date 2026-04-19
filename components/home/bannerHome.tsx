import { DadosContext } from '@/context/DadosProvider';
import tema from '@/utils/tema';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, ScrollView, TouchableOpacity, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Image, Linking } from 'react-native'
import { Text } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function BannerHome() {
    const { listaBanner, buscaBannerAtivo } = useContext<any>(DadosContext);
    const scrollRef = useRef<ScrollView>(null);
    const [bannerAtual, setBannerAtual] = useState(0);
    const [scrollManual, setScrollManual] = useState(false);
    const [isScreenFocused, setIsScreenFocused] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            setIsScreenFocused(true);
            return () => {
                setIsScreenFocused(false);
            };
        }, [])
    );

    useEffect(() => {
        buscaBannerAtivo();
    }, [])

    console.log("LISTA DE BANNER" + listaBanner)

    useEffect(() => {
        if (listaBanner.length === 0 || scrollManual || !isScreenFocused) return;

        const interval = setInterval(() => {
            setBannerAtual((prev) => (prev + 1) % listaBanner.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [listaBanner, scrollManual, isScreenFocused]);

    useEffect(() => {
        if (listaBanner.length === 0) return;
        scrollRef.current?.scrollTo({
            x: bannerAtual * SCREEN_WIDTH,
            animated: true,
        });
    }, [bannerAtual, listaBanner.length]);

    const banner = listaBanner[bannerAtual];

    const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        setBannerAtual(index);
        setScrollManual(false);
    };

    if (!banner) {
        return (
            <View style={styles.container}>
                <View style={[styles.slide, { backgroundColor: '#f0f0f0' }]} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView ref={scrollRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} decelerationRate="fast" scrollEventThrottle={16} scrollEnabled={true}
                onMomentumScrollEnd={handleScrollEnd} onScrollBeginDrag={() => setScrollManual(true)}>
                {listaBanner.map((banner: any) => (
                    <View key={banner.id} style={[styles.slide, { backgroundColor: banner.corFundo }]}>
                        <Image source={{ uri: banner.imagem }} style={styles.backgroundImage} />

                        <LinearGradient
                            colors={[`${banner.corFundo}CC`, 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradient}
                        />

                        <View style={styles.conteudo}>
                            <Text style={[styles.titulo, { color: banner.corTexto }]}>{banner.titulo}</Text>
                            <Text style={[styles.subtitulo, { color: banner.corTexto }]}>{banner.subtitulo}</Text>

                            {/* TODO APLICAR REDIRECIONAMENTO PARA LINK */}
                            <TouchableOpacity style={[styles.botao, { backgroundColor: tema.colors.primary }]}
                                // onPress={() => router.push(banner.link)}
                                onPress={() => router.push('/(tabs)/perfilUsuario')}
                            >
                                <Text style={[styles.textoBotao, { color: '#fff' }]}> Explorar Agora {'\u2192'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.pontos}>
                {listaBanner.map((_: any, i: number) => (
                    <TouchableOpacity key={i} onPress={() => setBannerAtual(i)} style={[styles.ponto, i === bannerAtual && styles.pontoAtivo]} />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: 220,
        marginBottom: 16,
    },
    slide: {
        width: SCREEN_WIDTH,
        height: 220,
        position: 'relative',
        overflow: 'hidden',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    conteudo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 50,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    titulo: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
        lineHeight: 32,
    },
    subtitulo: {
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    botao: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    textoBotao: {
        fontSize: 14,
        fontWeight: '600',
    },
    pontos: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        zIndex: 10,
    },
    ponto: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    pontoAtivo: {
        width: 24,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
});