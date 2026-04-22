import { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import api from '@/services/api'
import { AuthContext } from './AuthProvider'

interface FormaPagamento {
    id: number
    tipo: string
    nomeCartao: string
    nomeTitular: string
    numeroCartao: string
}

interface FormaPagamentoContextType {
    formaPagamento: { fp: FormaPagamento[] } | null
    buscarFormaPagamento: () => Promise<any>
    cadastrarFormaPagamento: (formData: any) => Promise<{ sucesso: boolean; mensagem?: string }>
    removeFormaPagamento: (id: number, formData: any) => Promise<{ sucesso: boolean; mensagem?: string }>
    editaFormaPagamento: (id: number, formData: any) => Promise<any>
}

export const FormaPagamentoContext = createContext<FormaPagamentoContextType | null>(null)

export function FormaPagamentoProvider({ children }: { children: ReactNode }) {
    const { user } = useContext<any>(AuthContext);

    const [formaPagamento, setFormaPagamento] = useState<{ fp: FormaPagamento[] } | null>(null)

    async function buscarFormaPagamento() {
        if (!user) return
        try {
            const response = await api.get(`/usuario/info/formaPagamento/${user.id}`)
            setFormaPagamento(response.data)
            return response.data
        } catch (error) {
            console.error('Erro ao buscar formas de pagamento:', error)
        }
    }

    async function cadastrarFormaPagamento(formData: any) {
        try {
            await api.post(`/usuario/create/formaPagamento`, formData)
            await buscarFormaPagamento()
            return { sucesso: true }
        } catch (err: any) {
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || err.message,
            }
        }
    }

    async function removeFormaPagamento(id: number, formData: any) {
        try {
            await api.patch(`/usuario/delete/formaPagamento/${id}`, formData)
            await buscarFormaPagamento()
            return { sucesso: true }
        } catch (err: any) {
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || err.message,
            }
        }
    }

    async function editaFormaPagamento(id: number, formData: any) {
        try {
            const data = await api.patch(`/usuario/update/formaPagamento/${id}`, formData)
            await buscarFormaPagamento()
            return data
        } catch (err: any) {
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || err.message,
            }
        }
    }

    useEffect(() => {
        if (user?.id) {
            buscarFormaPagamento()
        }
    }, [])

    return (
        <FormaPagamentoContext.Provider
            value={{
                formaPagamento,
                buscarFormaPagamento,
                cadastrarFormaPagamento,
                removeFormaPagamento,
                editaFormaPagamento,
            }}
        >
            {children}
        </FormaPagamentoContext.Provider>
    )
}

export const useFormaPagamento = () => {
    const context = useContext(FormaPagamentoContext)
    if (!context) {
        throw new Error('useFormaPagamento deve ser usado dentro de FormaPagamentoProvider')
    }
    return context
}
