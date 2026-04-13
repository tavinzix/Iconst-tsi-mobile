export const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);
    const formatado = numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return { formatado, numeros };
};

export const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);
    let formatado = numeros;

    if (numeros.length <= 10) {
        formatado = numeros
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        formatado = numeros
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    }

    return { formatado, numeros };
};

export const formatarData = (valor) => {
    if (!valor) return { formatado: '', numeros: '' };

    if (valor.includes('T')) {
        valor = valor.split('T')[0].split('-').reverse().join('');
    }

    const numeros = valor.replace(/\D/g, '').slice(0, 8);
    const formatado = numeros
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');

    return {
        formatado,
        numeros
    };
};

export const formatarDataPerfilVendedor = (data) => {
    if (!data) return 'N/A';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
};

export const formatarNumeroCartao = (valor) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 16);
    const formatado = numeros.replace(/(\d{4})/g, '$1 ').trim();

    return {
        formatado,
        numeros
    };
};

export const formatarValidade = (valor) => {
    let numeros = valor.replace(/\D/g, '').slice(0, 4);
    const formatado = numeros.length >= 2
        ? numeros.slice(0, 2) + '/' + numeros.slice(2)
        : numeros;

    return {
        formatado,
        numeros
    };
};

export const formatarCVV = (valor) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 3);

    return {
        formatado: numeros,
        numeros
    };
};

export const formatarCEP = (valor) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 8);

    const formatado = numeros.replace(
        /^(\d{5})(\d{0,3})$/,
        (_, p1, p2) => (p2 ? `${p1}-${p2}` : p1)
    );

    return {
        formatado,
        numeros
    };
};

export const formatarCNPJ = (valor) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 14);
    const formatado = numeros
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

    return {
        formatado,
        numeros
    };
};

export const formatarURL = (valor) => {
    if (!valor) return '';

    const semAcentos = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos

    const minuscula = semAcentos.toLowerCase(); // Converte para lowercase

    const comHifen = minuscula.replace(/\s+/g, '-'); // Substitui espaços por hífen

    const semEspeciais = comHifen.replace(/[^a-z0-9-]/g, ''); // Remove caracteres especiais, mantendo apenas letras, números e hífen

    const hifenesUnicos = semEspeciais.replace(/-+/g, '-'); // Remove múltiplos hífens

    const formatado = hifenesUnicos.replace(/^-+|-+$/g, '');// Remove hífens do início e fim

    return formatado;
};

export const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
};

export const converterData = (ddmmaaaa) => {
    if (!ddmmaaaa || ddmmaaaa.length !== 8) return '';
    const dd = ddmmaaaa.substring(0, 2);
    const mm = ddmmaaaa.substring(2, 4);
    const aaaa = ddmmaaaa.substring(4, 8);
    return `${aaaa}-${mm}-${dd}`;
};