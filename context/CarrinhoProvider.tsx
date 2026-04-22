import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import api from '@/services/api'

interface CarrinhoItem {
    id: number
    quantidade: number
    precoUnitario: number
    precoUnitarioHistorico: number
    precoAlterado: boolean
    produto: {
        id: number
        nome: string
        slug: string
        descricao: string
        categoriaId: number
        marca: string
        atributos: any
        peso: string
        dimensoes: string
        vendedor: {
            id: number
            nome: string
            email: string
            telefone: string
            slug: string
            preco: number
            estoque: number
        }
        imagens: Array<{
            id: number
            imagemUrl: string
            ordem: number
        }>
    }
}

interface CarrinhoContextType {
    listaCarrinho: CarrinhoItem[]
    buscaCarrinho: () => Promise<void>
    atualizaQuantidade: (itemId: number, quantidade: number) => Promise<{ sucesso: boolean; mensagem?: string }>
    adicionarProduto: (formData: any) => Promise<{ sucesso: boolean; mensagem?: string }>
    removeItem: (itemId: number) => Promise<{ sucesso: boolean; mensagem?: string }>
    loading: boolean
}

export const CarrinhoContext = createContext<CarrinhoContextType | null>(null)

export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
    const [listaCarrinho, setListaCarrinho] = useState<CarrinhoItem[]>([])
    const [loading, setLoading] = useState(false)

    async function adicionarProduto(formData: any) {
        try {
            await api.post(`/carrinho/create/adicionarItem`, formData)
            await buscaCarrinho()
            return { sucesso: true }
        } catch (err: any) {
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || err.message,
            }
        }
    }

    async function buscaCarrinho() {
        setLoading(true)
        try {
            const { data } = await api.get('/carrinho/info/allItensCarrinho')
            setListaCarrinho(data.itensCarrinho || [])
        } catch (err) {
            console.error('Erro ao buscar carrinho:', err)
            setListaCarrinho([])
        } finally {
            setLoading(false)
        }
    }

    async function atualizaQuantidade(itemId: number, quantidade: number) {
        try {
            await api.patch(`/carrinho/update/editarQuantidade/${itemId}`, { quantidade })
            await buscaCarrinho()
            return { sucesso: true }
        } catch (err: any) {
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || err.message,
            }
        }
    }

    async function removeItem(itemId: number) {
        try {
            await api.delete(`/carrinho/delete/removerItem/${itemId}`)
            await buscaCarrinho()
            return { sucesso: true }
        } catch (err: any) {
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || err.message,
            }
        }
    }

    useEffect(() => {
        buscaCarrinho()
    }, [])

    return (
        <CarrinhoContext.Provider
            value={{
                buscaCarrinho,
                listaCarrinho,
                atualizaQuantidade,
                adicionarProduto,
                removeItem,
                loading,
            }}
        >
            {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinho = () => {
    const context = useContext(CarrinhoContext)
    if (!context) {
        throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider')
    }
    return context
}