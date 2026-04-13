import api from "@/services/api";
import React, { createContext, useContext, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { converterData } from '../utils/formatar'

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);
    const [imagemUsuario, setImagemUsuario] = useState(null);

    const [recuperarSenhaEtapa, setRecuperarSenhaEtapa] = useState(1);
    const [recuperarSenhaCpf, setRecuperarSenhaCpf] = useState('');
    const [recuperarSenhaDataNascimento, setRecuperarSenhaDataNascimento] = useState('');
    const [recuperarSenhaCodigo, setRecuperarSenhaCodigo] = useState('');
    const [recuperarSenhaUserId, setRecuperarSenhaUserId] = useState<number | null>(null);
    const [recuperarSenhaLoading, setRecuperarSenhaLoading] = useState(false);

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

    const solicitarCodigoRecuperacao = async () => {
        setRecuperarSenhaLoading(true);

        try {
            const response = await api.post('/recuperarsenha/', { cpf: recuperarSenhaCpf, dt_nasc: converterData(recuperarSenhaDataNascimento) });

            setRecuperarSenhaEtapa(2);

            return {
                sucesso: true,
                mensagem: response.data.message || 'Código enviado para seu email!'
            };
        } catch (error: any) {
            const mensagem = error.response?.data?.message || 'Erro ao solicitar código';
            console.error('Erro ao solicitar código:', error);
            return {
                sucesso: false,
                mensagem
            };
        } finally {
            setRecuperarSenhaLoading(false);
        }
    };

    const verificarCodigoRecuperacao = async () => {
        setRecuperarSenhaLoading(true);

        try {
            const response = await api.post('/verificarcodigo/', { cpf: recuperarSenhaCpf, codigo: recuperarSenhaCodigo });
            const usuario = response.data.userId || response.data.usuario?.id;

            if (usuario) setRecuperarSenhaUserId(usuario);

            setRecuperarSenhaEtapa(3);

            return {
                sucesso: true,
                mensagem: 'Código verificado com sucesso!'
            };
        } catch (error: any) {
            const mensagem = error.response?.data?.message || 'Código inválido ou expirado';
            console.error('Erro ao verificar código:', error);
            return {
                sucesso: false,
                mensagem
            };
        } finally {
            setRecuperarSenhaLoading(false);
        }
    };

    const alterarSenhaRecuperacao = async (novaSenha: string) => {
        setRecuperarSenhaLoading(true);

        if (!recuperarSenhaUserId) {
            setRecuperarSenhaLoading(false);
            return { sucesso: false, mensagem: 'Erro ao identificar usuário' };
        }

        try {
            const response = await api.patch(`/alterarsenha/${recuperarSenhaUserId}`, { senha: novaSenha });

            limparRecuperacaoSenha();

            return {
                sucesso: true,
                mensagem: response.data.message || 'Senha alterada com sucesso!'
            };
        } catch (error: any) {
            const mensagem = error.response?.data?.message || 'Erro ao alterar senha';
            console.error('Erro ao alterar senha:', error);
            return {
                sucesso: false,
                mensagem
            };
        } finally {
            setRecuperarSenhaLoading(false);
        }
    };

    const voltarEtapaRecuperacao = () => {
        if (recuperarSenhaEtapa > 1) {
            setRecuperarSenhaEtapa(recuperarSenhaEtapa - 1);
        }
    };

    const limparRecuperacaoSenha = () => {
        setRecuperarSenhaEtapa(1);
        setRecuperarSenhaCpf('');
        setRecuperarSenhaDataNascimento('');
        setRecuperarSenhaCodigo('');
        setRecuperarSenhaUserId(null);
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                user,
                imagemUsuario,
                setImagemUsuario,
                recuperaCredencialnaCache,
                
                recuperarSenhaEtapa,
                recuperarSenhaCpf,
                recuperarSenhaDataNascimento,
                recuperarSenhaCodigo,
                recuperarSenhaLoading,
                setRecuperarSenhaCpf,
                setRecuperarSenhaDataNascimento,
                setRecuperarSenhaCodigo,
                solicitarCodigoRecuperacao,
                verificarCodigoRecuperacao,
                alterarSenhaRecuperacao,
                voltarEtapaRecuperacao,
                limparRecuperacaoSenha
            }}>
            {children}
        </AuthContext.Provider>
    );
};