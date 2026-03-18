import { StatusBar } from "expo-status-bar";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CadastrarUsuario() {
    const theme = useTheme();
    const { control, handleSubmit, } = useForm<any>({
        defaultValues: {
            nome: "",
            email: "",
            cpf: "",
            dtNasc: "",
            telefone: "",
            senha: "",
            confirmSenha: "",
        },
        mode: "onSubmit"
    });

    return (
        <>

            <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">

                    <ScrollView
                        contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
                        keyboardShouldPersistTaps="handled"
                    >

                        <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.textinput}
                                label="Nome completo"
                                placeholder="Seu nome completo"
                                mode="outlined"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                            name="nome"
                        />


                        <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.textinput}
                                label="Email"
                                placeholder="seu@email.com"
                                mode="outlined"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                            name="email"
                        />


                        <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.textinput}
                                label="CPF"
                                placeholder="000.000.000.00"
                                mode="outlined"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                            name="cpf"
                        />


                        <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.textinput}
                                label="Data de nascimento"
                                placeholder="00/00/0000"
                                mode="outlined"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                            name="dtNasc"
                        />


                        <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.textinput}
                                label="Telefone"
                                placeholder="(00) 00000-0000"
                                mode="outlined"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                            name="telefone"
                        />

                        <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.textinput}
                                label="Senha"
                                placeholder="Mínimo 8 caracteres"
                                mode="outlined"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                            name="senha"
                        />

                        <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.textinput}
                                label="Confirmar senha"
                                placeholder="Digite novamente sua senha"
                                mode="outlined"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                            name="confirmSenha"
                        />



                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    textinput: {
        width: 350,
        height: 50,
        marginTop: 20,
        backgroundColor: "transparent",
    },
});