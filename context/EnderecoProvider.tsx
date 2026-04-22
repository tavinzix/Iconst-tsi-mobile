import { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import api from '@/services/api'
import { AuthContext } from './AuthProvider'

interface Endereco {
    id: number
    tipo: string
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
}

interface EnderecoContextType {
    endereco: { endereco: Endereco[] } | null
    buscarEndereco: () => Promise<any>
    cadastrarEndereco: (formData: any) => Promise<{ sucesso: boolean; mensagem?: string }>
    removeEndereco: (id: number, formData: any) => Promise<{ sucesso: boolean; mensagem?: string }>
    editaEndereco: (id: number, formData: any) => Promise<any>
}

export const EnderecoContext = createContext<EnderecoContextType | null>(null)

export function EnderecoProvider({ children }: { children: ReactNode }) {
    const { user } = useContext<any>(AuthContext);

    const [endereco, setEndereco] = useState<{ endereco: Endereco[] } | null>(null)

    async function buscarEndereco() {
        if (!user) return
        try {
            const response = await api.get(`/usuario/info/endereco/${user.id}`)
            setEndereco(response.data)
            return response.data
        } catch (error) {
            console.error('Erro ao buscar endereço:', error)
        }
    }

    async function cadastrarEndereco(formData: any) {
        try {
            await api.post(`/usuario/create/endereco`, formData)
            await buscarEndereco()
            return { sucesso: true }
        } catch (err: any) {
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || err.message,
            }
        }
    }

    async function removeEndereco(id: number, formData: any) {
        try {
            await api.patch(`/usuario/delete/endereco/${id}`, formData)
            await buscarEndereco()
            return { sucesso: true }
        } catch (err: any) {
            return {
                sucesso: false,
                mensagem: err.response?.data?.message || err.message,
            }
        }
    }

    async function editaEndereco(id: number, formData: any) {
        try {
            const data = await api.patch(`/usuario/update/endereco/${id}`, formData)
            await buscarEndereco()
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
            buscarEndereco()
        }
    }, [])

    return (
        <EnderecoContext.Provider
            value={{
                endereco,
                buscarEndereco,
                cadastrarEndereco,
                removeEndereco,
                editaEndereco,
            }}
        >
            {children}
        </EnderecoContext.Provider>
    )
}

export const useEndereco = () => {
    const context = useContext(EnderecoContext)
    if (!context) {
        throw new Error('useEndereco deve ser usado dentro de EnderecoProvider')
    }
    return context
}