import api from "@/services/api";
import React, { createContext, useState } from "react";

export const DadosContext = createContext({});

export const DadosProvider = ({ children }: any) => {
    const [listaBanner, setListaBanner] = useState([]);
    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaProdutos, setListaProdutos] = useState([]);

    async function buscaBannerAtivo() {
        try {
            const { data } = await api.get("/administrador/info/bannerAtivo");
            setListaBanner(data.banner || []);
        } catch (err) {
            console.error("Erro ao buscar banners:", err);
        }
    }

    async function buscaCategoriaAtiva() {
        try {
            const { data } = await api.get("/administrador/info/categoriaAtiva");
            setListaCategorias(data.categoria || []);
        } catch (err) {
            console.error("Erro ao buscar categorias:", err);
        }
    }

    async function buscaProdutos() {
        try {
            const { data } = await api.get("/vendedor/info/produtoAtivo");
            setListaProdutos(data || []);
            return data;
        } catch (err) {
            console.error("Erro ao buscar produtos:", err);
        }
    }

    return (
        <DadosContext.Provider
            value={{
                listaBanner,
                buscaBannerAtivo,
                listaCategorias,
                buscaCategoriaAtiva,
                listaProdutos,
                buscaProdutos

            }}>
            {children}
        </DadosContext.Provider>
    );
};