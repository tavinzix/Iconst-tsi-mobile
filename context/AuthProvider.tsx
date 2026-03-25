import api from "@/services/api";
import React, { createContext, useContext, useState } from "react";
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);
    const [imagemUsuario, setImagemUsuario] = useState(null);


    async function armazenaCredencialnaCache(dados: any) {
        try {
            await SecureStore.setItem("credencial", JSON.stringify(dados));
        } catch (err) {
            console.log(err)
        }
    }

    async function recuperaCredencialnaCache(): Promise<null | string> {
        try {
            const credencial = await SecureStore.getItem("credencial");
            return credencial ? JSON.parse(credencial) : null;
        } catch (e) {
            console.error("AuthProvider, recuperaCredencialdaCache: " + e);
            return null;
        }
    }


    const login = async (dados: any) => {
        try {
            const { data } = await api.post("/login", dados);
            setUser(data.user);
            setImagemUsuario(data.user.imgUser);

            await SecureStore.setItemAsync("token", data.token.value);
            armazenaCredencialnaCache(dados)
            return {
                sucesso: true,
                user: data.user,
                token: data.token.value
            };
        } catch (err: any) {
            console.log(err)
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || "Erro ao fazer login"
            };
        }
    };

    const logout = async () => {
        await api.post("/logout")
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("credencial");
        setUser(null);
        return { sucesso: true }
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                user,
                imagemUsuario,
                setImagemUsuario,
                recuperaCredencialnaCache
            }}>
            {children}
        </AuthContext.Provider>
    );
};