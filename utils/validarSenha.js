export const REQUISITOS_SENHA = [
    {
        id: 'tamanho',
        label: 'Mínimo de 8 caracteres',
        teste: (senha) => senha.length >= 8,
    },
    {
        id: 'maiuscula',
        label: 'Uma letra maiúscula',
        teste: (senha) => /[A-Z]/.test(senha),
    },
    {
        id: 'minuscula',
        label: 'Uma letra minúscula',
        teste: (senha) => /[a-z]/.test(senha),
    },
    {
        id: 'numero',
        label: 'Um número',
        teste: (senha) => /\d/.test(senha),
    },
    {
        id: 'especial',
        label: 'Um caractere especial ($, *, &, @, #)',
        teste: (senha) => /[$*&@#]/.test(senha),
    },
];

export function validarSenha(senha) {
    const requisitos = {};
    const requisitosCumpridos = [];

    REQUISITOS_SENHA.forEach((req) => {
        const cumprido = req.teste(senha);
        requisitos[req.id] = cumprido;
        if (cumprido) {
            requisitosCumpridos.push(req);
        }
    });

    const totalRequisitos = requisitosCumpridos.length;
    let forca = 'fraca';

    if (totalRequisitos === 5) {
        forca = 'forte';
    } else if (totalRequisitos >= 3) {
        forca = 'media';
    }

    const valida = Object.values(requisitos).every(Boolean);

    return {
        valida,
        forca,
        requisitos,
        requisitosCumpridos,
        totalRequisitos,
    };
}
