import api from "@/services/api";
import React, { createContext } from "react";

export const UserContext = createContext({});

export const UserProvider = ({ children }: any) => {

    const criarUsuario = async (formData: any) => {
        try {
            const response = await api.post("/usuario/create", formData);
            return {
                sucesso: true,
                mensagem: response.data?.message
            };

        } catch (err: any) {
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || "Erro ao fazer cadastro"
            };
        }
    };


    return (
        <UserContext.Provider
            value={{
                criarUsuario
            }}>
            {children}
        </UserContext.Provider>
    );
};