import api from "@/services/api";
import React, { createContext, useContext } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {

    const login = async (dados: any) => {
        try {
            const { data } = await api.post("/login", dados);
            return {
                sucesso: true,
                user: data.user,
                token: data.token.value
            };

        } catch (err: any) {
            console.log("ERRO LOGIN:", err.response?.data);

            return {
                sucesso: false,
                mensagem: err.response?.data?.message || "Erro ao fazer login"
            };
        }
    };

    const logout = () => {
        // setUser(null);
        // setImagemUsuario(null)
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                logout
            }}>
            {children}
        </AuthContext.Provider>
    );
};