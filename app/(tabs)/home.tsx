import React, { useState, useCallback, useContext } from 'react'
import { View, ScrollView, TouchableOpacity, useColorScheme, StyleSheet, StatusBar, Alert, Image, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Button, Dialog, TextInput, useTheme, Text, Icon } from "react-native-paper";

import { AuthContext } from '@/context/AuthProvider';
import { Controller, useForm } from 'react-hook-form';
import tema from '@/utils/tema';







export default function HomeScreen() {
    const router = useRouter()
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const { user, imagemUsuario } = useContext<any>(AuthContext);

    const { control, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            pesquisa: "",
        },
        mode: "onSubmit",
        // resolver: yupResolver(schema)
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ ...styles.header, backgroundColor: theme.colors.primary }}>
                <View style={styles.headerItens}>
                    <Image style={styles.logo}
                        source={colorScheme === "dark" ? require("../../assets/images/logoBranco.png") : require("../../assets/images/logo.png")} />

                    <View style={styles.headerDireita}>
                        <Icon source="chat-processing-outline" size={40} />
                        <TouchableOpacity onPress={() => router.push('/(tabs)/perfilUsuario')}>
                            <Image style={styles.imagemUsuario} source={{ uri: user?.imgUser || imagemUsuario }} />
                        </TouchableOpacity>
                    </View>
                </View>

                <Controller
                    name="pesquisa"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextInput placeholder="O que você procura no ICONST?" mode="outlined" autoCapitalize="none" returnKeyType="next" onChangeText={onChange} value={value}
                            style={styles.barraPesquisa} placeholderTextColor="#666" textColor="#000" outlineColor="#ccc" activeOutlineColor={tema.colors.primary_dark}
                            theme={{
                                colors: {
                                    background: '#fff',
                                    text: '#000',
                                    placeholder: '#666',
                                    primary: '#000',
                                },
                            }}
                            right={
                                <TextInput.Icon
                                    icon="microphone"
                                    onPress={() => {
                                        alert('chamar transcrição de audio')
                                    }}
                                />
                            }
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF6B00',
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 8,
    },
    headerItens: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 4,
        justifyContent: 'space-between'
    },
    headerDireita: {
        alignItems: 'flex-end',
        gap: 15,
        flexDirection: 'row',
    },
    logo: {
        width: 150,
        height: 50,
        objectFit: "fill"
    },
    imagemUsuario: {
        width: 40,
        height: 40,
        borderRadius: 50
    },

    barraPesquisa: {
        backgroundColor: '#fff',
        height: 50,
    },
})