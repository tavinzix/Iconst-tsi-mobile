import api from "@/services/api";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const UserContext = createContext({});

export const UserProvider = ({ children }: any) => {
    const { user } = useContext<any>(AuthContext);
    const [userInfo, setUserInfo] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);

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

    async function buscarUsuario() {
        if (!user) return;

        setLoadingUser(true);

        try {
            const response = await api.get(`/usuario/info/usuario/${user.id}`);
            setUserInfo(response.data);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        } finally {
            setLoadingUser(false);
        }
    }

    async function editarUsuario(id: number, formData: any) {
        try {
            const { data } = await api.patch(`/usuario/update/cadastro/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            await buscarUsuario();

            return {
                sucesso: true,
                imgUser: data.imgUser
            };
        } catch (err: any) {
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || err.message,
            };
        }
    }

    /* async function removerFoto(id) {
         try {
             await axiosClient.patch(`/usuario/update/removerfoto/${id}`);
  
             await buscarUsuario();
  
             return { sucesso: true };
         } catch (err) {
             return {
                 sucesso: false,
                 mensagem: err.response?.data?.message || err.message,
             };
         }
     }
  
     async function removerConta() {
         try {
             await axiosClient.patch('/usuario/delete/conta');
  
             return { sucesso: true };
         } catch (err) {
             return {
                 sucesso: false,
                 mensagem: err.response?.data?.message || err.message,
             };
         }
     }*/

    useEffect(() => {
        buscarUsuario();
    }, [user]);

    return (
        <UserContext.Provider
            value={{
                userInfo,
                loadingUser,
                criarUsuario,
                editarUsuario,
                // removerFoto,
                // removerConta,
                buscarUsuario,
                setUserInfo,
            }}>
            {children}
        </UserContext.Provider>
    );
};