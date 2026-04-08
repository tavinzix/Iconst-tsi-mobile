import React, { createContext, useContext, useState, ReactNode } from 'react'


// =============================================================
// DADOS MOCKADOS DO CARRINHO
// TODO: substituir por chamadas reais ao backend
//   GET  /carrinho          → itens do carrinho
//   GET  /enderecos         → endereços do usuário
//   GET  /formas-pagamento  → cartões e métodos do usuário
//   POST /pedidos           → confirmar pedido
// =============================================================

export interface CartItem {
    id: string
    produtoId: string
    nome: string
    vendedor: string
    precoUnitario: number
    quantidade: number
    selecionado: boolean
    // TODO: trocar emoji por imageUrl quando tiver assets
    emoji: string
    // imageUrl: string
}

export interface Endereco {
    id: string
    apelido: string
    rua: string
    bairro: string
    cidade: string
    estado: string
    cep: string
    complemento?: string
}

export interface Cartao {
    id: string
    bandeira: string
    titular: string
    finalDigitos: string
}

export type FormaPagamento =
    | { tipo: 'cartao'; cartaoId: string }
    | { tipo: 'pix' }
    | { tipo: 'boleto' }

// ---------------------------
// ITENS DO CARRINHO
// Endpoint sugerido: GET /carrinho
// ---------------------------
export const MOCK_CART_ITEMS: CartItem[] = [
    {
        id: 'ci-1',
        produtoId: 'p-101',
        nome: 'Membrana Impermeabilizante Líquida',
        vendedor: 'Ferragens Rio',
        precoUnitario: 120.0,
        quantidade: 1,
        selecionado: false,
        emoji: '🪣',
    },
    {
        id: 'ci-2',
        produtoId: 'p-102',
        nome: 'Martelo de Borracha',
        vendedor: 'Construtech Materiais',
        precoUnitario: 19.9,
        quantidade: 5,
        selecionado: true,
        emoji: '🔨',
    },
]

// ---------------------------
// ENDEREÇOS DO USUÁRIO
// Endpoint sugerido: GET /enderecos
// ---------------------------
export const MOCK_ENDERECOS: Endereco[] = [
    {
        id: 'end-1',
        apelido: 'Casa',
        rua: 'Rua A, 123 - Centro',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01001-000',
        complemento: 'Apto 1',
    },
    {
        id: 'end-2',
        apelido: 'Trabalho',
        rua: 'Av. Paulista, 1000',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100',
    },
]

// ---------------------------
// CARTÕES CADASTRADOS
// Endpoint sugerido: GET /formas-pagamento/cartoes
// ---------------------------
export const MOCK_CARTOES: Cartao[] = [
    { id: 'card-1', bandeira: 'Visa', titular: 'João Silva', finalDigitos: '1111' },
    { id: 'card-2', bandeira: 'Mastercard', titular: 'João Silva', finalDigitos: '5555' },
]

// ---------------------------
// FRETE MOCKADO
// Endpoint sugerido: POST /frete/calcular { enderecoId, itens }
// ---------------------------
export const MOCK_FRETE = 15.0


// =============================================================
// Contexto que compartilha o estado entre os 3 steps do carrinho
// =============================================================

interface CarrinhoContextData {
    // Step 1 — itens
    items: CartItem[]
    setItems: (items: CartItem[]) => void
    itensSelecionados: CartItem[]
    subtotal: number

    // Step 2 — entrega e pagamento
    enderecos: Endereco[]
    enderecoSelecionadoId: string | null
    setEnderecoSelecionadoId: (id: string) => void
    enderecoSelecionado: Endereco | null

    formaPagamento: FormaPagamento | null
    setFormaPagamento: (fp: FormaPagamento) => void

    frete: number

    // Totais
    total: number

    // Step atual (1 | 2 | 3)
    step: number
    setStep: (s: number) => void

    // Reset após confirmar
    resetCart: () => void
}

const CarrinhoContext = createContext<CarrinhoContextData>({} as CarrinhoContextData)

export function CarrinhoProvider({ children }: { children: ReactNode }) {
    // ----------------------------------------------------------------
    // TODO: Trocar os estados abaixo por chamadas reais ao backend.
    //
    // Exemplo com useEffect:
    //   useEffect(() => {
    //     api.get('/carrinho').then(r => setItems(r.data))
    //     api.get('/enderecos').then(r => setEnderecos(r.data))
    //   }, [])
    // ----------------------------------------------------------------
    const [items, setItems] = useState<CartItem[]>(MOCK_CART_ITEMS)
    const [enderecos] = useState<Endereco[]>(MOCK_ENDERECOS)
    const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState<string | null>(
        MOCK_ENDERECOS[0]?.id ?? null
    )
    const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | null>(null)
    const [step, setStep] = useState(1)

    const itensSelecionados = items.filter((i) => i.selecionado)
    const subtotal = itensSelecionados.reduce(
        (acc, i) => acc + i.precoUnitario * i.quantidade,
        0
    )
    const frete = itensSelecionados.length > 0 ? MOCK_FRETE : 0
    const total = subtotal + frete

    const enderecoSelecionado =
        enderecos.find((e) => e.id === enderecoSelecionadoId) ?? null

    function resetCart() {
        setItems(MOCK_CART_ITEMS.map((i) => ({ ...i, selecionado: false })))
        setEnderecoSelecionadoId(MOCK_ENDERECOS[0]?.id ?? null)
        setFormaPagamento(null)
        setStep(1)
    }

    return (
        <CarrinhoContext.Provider
            value={{
                items,
                setItems,
                itensSelecionados,
                subtotal,
                enderecos,
                enderecoSelecionadoId,
                setEnderecoSelecionadoId,
                enderecoSelecionado,
                formaPagamento,
                setFormaPagamento,
                frete,
                total,
                step,
                setStep,
                resetCart,
            }}
        >
            {children}
        </CarrinhoContext.Provider>
    )
}

export function useCart() {
    return useContext(CarrinhoContext)
}