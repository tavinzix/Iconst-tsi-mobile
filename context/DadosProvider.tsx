import api from "@/services/api";
import React, { createContext, useState } from "react";

export const DadosContext = createContext({});

export const DadosProvider = ({ children }: any) => {
    const [listaBanner, setListaBanner] = useState([]);

    async function buscaBannerAtivo() {
        try {
            const { data } = await api.get("/administrador/info/bannerAtivo");
            setListaBanner(data.banner || []);
        } catch (err) {
            console.error("Erro ao buscar banners:", err);
        }
    }

    return (
        <DadosContext.Provider
            value={{
                listaBanner,
                buscaBannerAtivo,

            }}>
            {children}
        </DadosContext.Provider>
    );
};