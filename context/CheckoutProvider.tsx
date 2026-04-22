import { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { CarrinhoContext } from './CarrinhoProvider'
import { EnderecoContext } from './EnderecoProvider'
import { FormaPagamentoContext } from './FormaPagamentoProvider'
import api from '@/services/api'

export const CheckoutContext = createContext<any>(null)

export function CheckoutProvider({ children }: { children: ReactNode }) {
    const { listaCarrinho } = useContext(CarrinhoContext)!
    const { endereco } = useContext(EnderecoContext)!
    const { formaPagamento } = useContext(FormaPagamentoContext)!

    const [etapaAtual, setEtapaAtual] = useState(1)
    const [itensSelecionados, setItensSelecionados] = useState<number[]>([])
    const [enderecoSelecionado, setEnderecoSelecionado] = useState<number | null>(null)
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const getItensSelecionadosCompletos = () => {
        return listaCarrinho.filter((item: any) => itensSelecionados.includes(item.id))
    }

    const getEnderecoCompleto = () => {
        if (!enderecoSelecionado || !endereco?.endereco) return null
        return endereco.endereco.find((end: any) => end.id === enderecoSelecionado)
    }

    const getPagamentoCompleto = () => {
        if (!pagamentoSelecionado || !formaPagamento?.fp) return null

        if (pagamentoSelecionado === 'pix') {
            return { id: 'pix', tipo: 'PIX', descricao: 'Aprova imediatamente' }
        }
        if (pagamentoSelecionado === 'boleto') {
            return { id: 'boleto', tipo: 'Boleto', descricao: 'Aprova em até 3 dias úteis' }
        }

        return formaPagamento.fp.find((fp: any) => fp.id === pagamentoSelecionado)
    }

    const calcularTotal = () => {
        const itens = getItensSelecionadosCompletos()
        return itens.reduce((total: number, item: any) => {
            return total + Number(item.precoUnitario) * item.quantidade
        }, 0)
    }

    const calcularFrete = () => {
        // TODO Implementar lógica de frete aqui
        return 15.0 // Valor fixo por enquanto
    }

    const calcularTotalComFrete = () => {
        return calcularTotal() + calcularFrete()
    }

    // Validações por etapa
    const validarEtapa1 = () => {
        if (itensSelecionados.length === 0) {
            return false
        }
        return true
    }

    const validarEtapa2 = () => {
        if (!enderecoSelecionado) {
            return false
        }
        if (!pagamentoSelecionado) {
            return false
        }
        return true
    }

    // Avançar de etapa
    const avancarEtapa = () => {
        if (etapaAtual === 1 && !validarEtapa1()) {
            return false
        }
        if (etapaAtual === 2 && !validarEtapa2()) {
            return false
        }

        if (etapaAtual < 3) {
            setEtapaAtual(etapaAtual + 1)
            return true
        }
        return false
    }

    // Voltar de etapa
    const voltarEtapa = () => {
        if (etapaAtual > 1) {
            setEtapaAtual(etapaAtual - 1)
            return true
        }
        return false
    }

    // Finalizar pedido
    const finalizarPedido = async () => {
        if (!validarEtapa2()) {
            return { sucesso: false, mensagem: 'Informações incompletas' }
        }

        setLoading(true)
        try {
            // Mapeia IDs de itens do carrinho para IDs de produtos
            const itensSelecionadosCompletos = getItensSelecionadosCompletos()
            const produtoIds = itensSelecionadosCompletos.map((item: any) => item.produto.id)

            const payload = {
                produtoIds: produtoIds,
                enderecoId: enderecoSelecionado,
                formaPagamentoId: pagamentoSelecionado === 'pix' || pagamentoSelecionado === 'boleto' ? pagamentoSelecionado : pagamentoSelecionado
            }

            const { data } = await api.post('/pedido/create/finalizarCompleto', payload)

            // Limpa o checkout
            setItensSelecionados([])
            setEnderecoSelecionado(null)
            setPagamentoSelecionado(null)
            setEtapaAtual(1)

            return { sucesso: true, pedidoId: data.pedidoId, valorTotal: data.valorTotal }
        } catch (err: any) {
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || err.message,
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <CheckoutContext.Provider
            value={{
                etapaAtual,
                setEtapaAtual,
                itensSelecionados,
                setItensSelecionados,
                enderecoSelecionado,
                setEnderecoSelecionado,
                pagamentoSelecionado,
                setPagamentoSelecionado,
                loading,
                getItensSelecionadosCompletos,
                getEnderecoCompleto,
                getPagamentoCompleto,
                calcularTotal,
                calcularFrete,
                calcularTotalComFrete,
                avancarEtapa,
                voltarEtapa,
                finalizarPedido,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    )
}

export const useCheckout = () => {
    const context = useContext(CheckoutContext)
    if (!context) {
        throw new Error('useCheckout deve ser usado dentro de CheckoutProvider')
    }
    return context
}
