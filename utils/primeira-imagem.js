const getPrimeiraImagem = (produto) => {
    if (!produto || !produto.imagens || produto.imagens.length === 0) { return '/src/assets/semImagem.jpg'; }

    const imagemPrincipal = produto.imagens.find(img => img.ordem === 1);

    return (
        imagemPrincipal?.imagemUrl || produto.imagens[0]?.imagemUrl || '/src/assets/semImagem.jpg'
    );
};

export { getPrimeiraImagem };
