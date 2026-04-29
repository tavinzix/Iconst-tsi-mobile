import React, { useContext } from 'react'
import { View, TouchableOpacity, useColorScheme, StyleSheet, Image, } from 'react-native'
import { useRouter } from 'expo-router'
import { TextInput, useTheme, Icon } from "react-native-paper";
import { AuthContext } from '@/context/AuthProvider';
import { Controller, useForm } from 'react-hook-form';
import tema from '@/utils/tema';

export function CabecalhoHome() {
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
        <View style={{ ...styles.header, backgroundColor: theme.colors.primary }}>
            <View style={styles.headerItens}>
                <Image style={styles.logo}
                    source={colorScheme === "dark" ? require("../../assets/images/logoBranco.png") : require("../../assets/images/logo.png")} />

                <View style={styles.headerDireita}>
                    <Icon source="chat-processing-outline" size={40} />
                    <TouchableOpacity onPress={() => router.push('/(tabs)/perfilUsuario')}>
                        <Image style={styles.imagemUsuario} source={{ uri: imagemUsuario || user?.imgUser}} />
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
    )
}

const styles = StyleSheet.create({
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