// Função para carregar os produtos na página de produtos
function carregarProdutos(categoria = 'todos') {
    const produtosContainer = document.querySelector('.produtos-container');
    
    if (!produtosContainer) return; // Sai se não estiver na página de produtos
    
    // Limpa o container
    produtosContainer.innerHTML = '';
    
    // Filtra os produtos pela categoria selecionada
    const produtosFiltrados = categoria === 'todos' 
        ? produtos 
        : produtos.filter(produto => produto.categoria === categoria);
    
    // Adiciona cada produto ao container
    produtosFiltrados.forEach(produto => {
        const produtoElement = document.createElement('div');
        produtoElement.className = 'produto';
        produtoElement.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
            <button class="adicionar-carrinho" data-id="${produto.id}">Adicionar ao Carrinho</button>
        `;
        produtosContainer.appendChild(produtoElement);
    });
    
    // Adiciona eventos aos botões de adicionar ao carrinho
    document.querySelectorAll('.adicionar-carrinho').forEach(button => {
        button.addEventListener('click', adicionarAoCarrinho);
    });
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(event) {
    const produtoId = parseInt(event.target.getAttribute('data-id'));
    const produto = produtos.find(p => p.id === produtoId);
    
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verifica se o produto já está no carrinho
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1,
            imagem: produto.imagem
        });
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Atualiza o contador do carrinho
    atualizarContadorCarrinho();
    
    // Mostra mensagem de sucesso
    alert(`${produto.nome} foi adicionado ao carrinho!`);
}

// Função para atualizar o contador de itens no carrinho
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    const contadorCarrinho = document.getElementById('contador-carrinho');
    if (contadorCarrinho) {
        contadorCarrinho.textContent = totalItens;
        contadorCarrinho.style.display = totalItens > 0 ? 'inline-block' : 'none';
    }
}

// Função para lidar com o envio do formulário de contato
function configurarFormularioContato() {
    const formContato = document.querySelector('.contato-form');
    
    if (!formContato) return; // Sai se não estiver na página de contato
    
    formContato.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coleta os dados do formulário
        const formData = new FormData(formContato);
        const dados = Object.fromEntries(formData.entries());
        
        // Aqui você normalmente enviaria os dados para um servidor
        console.log('Dados do formulário:', dados);
        
        // Mostra mensagem de sucesso
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        
        // Limpa o formulário
        formContato.reset();
    });
}

// Função para configurar os botões de categoria
function configurarBotoesCategoria() {
    const botoesCategoria = document.querySelectorAll('.categoria-btn');
    
    botoesCategoria.forEach(botao => {
        botao.addEventListener('click', function() {
            // Remove a classe 'active' de todos os botões
            botoesCategoria.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona a classe 'active' apenas ao botão clicado
            this.classList.add('active');
            
            // Carrega os produtos da categoria selecionada
            const categoria = this.getAttribute('data-categoria');
            carregarProdutos(categoria);
        });
    });
}

// Função para configurar os botões de agendamento de serviços
function configurarBotoesAgendamento() {
    const botoesAgendar = document.querySelectorAll('.agendar-btn');
    
    botoesAgendar.forEach(botao => {
        botao.addEventListener('click', function() {
            const servico = this.closest('.servico').querySelector('h3').textContent;
            alert(`Você está agendando o serviço: ${servico}\nEm uma aplicação real, isso abriria um formulário de agendamento.`);
        });
    });
}

// Função para inicializar o carrossel de destaques (página inicial)
function inicializarCarrossel() {
    const destaques = document.querySelectorAll('.destaque-item');
    let indiceAtual = 0;
    
    if (destaques.length === 0) return; // Sai se não houver destaques
    
    function mostrarDestaque(indice) {
        destaques.forEach((destaque, i) => {
            destaque.style.display = i === indice ? 'block' : 'none';
        });
    }
    
    // Mostra o primeiro destaque
    mostrarDestaque(indiceAtual);
    
    // Configura a troca automática a cada 5 segundos
    setInterval(() => {
        indiceAtual = (indiceAtual + 1) % destaques.length;
        mostrarDestaque(indiceAtual);
    }, 5000);
}

// Função principal que é executada quando o DOM está carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verifica em qual página estamos e executa as funções correspondentes
    const path = window.location.pathname.split('/').pop();
    
    // Atualiza o contador do carrinho em todas as páginas
    atualizarContadorCarrinho();
    
    // Configurações específicas para cada página
    if (path === 'produtos.html' || path === '') {
        carregarProdutos();
        configurarBotoesCategoria();
    }
    
    if (path === 'servicos.html' || path === '') {
        configurarBotoesAgendamento();
    }
    
    if (path === 'contato.html') {
        configurarFormularioContato();
    }
    
    if (path === 'index.html' || path === '') {
        inicializarCarrossel();
    }
    
    // Adiciona o ícone do carrinho no header
    const nav = document.querySelector('nav ul');
    if (nav) {
        const carrinhoItem = document.createElement('li');
        carrinhoItem.innerHTML = `
            <a href="#" id="carrinho-link">
                Carrinho
                <span id="contador-carrinho" style="display: none;"></span>
            </a>
        `;
        nav.appendChild(carrinhoItem);
        
        // Configura o clique no carrinho
        document.getElementById('carrinho-link').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Em uma aplicação real, isso abriria um modal ou página do carrinho com os itens selecionados.');
        });
        
        // Atualiza o contador novamente para garantir que o elemento existe
        atualizarContadorCarrinho();
    }
});

// Dados dos produtos (simulando um banco de dados)
const produtos = [
    {
        id: 1,
        nome: "Ração Premium para Cães",
        preco: 89.90,
        categoria: "racao",
        imagem: "https://via.placeholder.com/150",
        descricao: "Ração super premium para cães adultos de todas as raças."
    },
    {
        id: 2,
        nome: "Brinquedo Osso de Borracha",
        preco: 24.90,
        categoria: "brinquedo",
        imagem: "https://via.placeholder.com/150",
        descricao: "Brinquedo resistente para cães de todos os portes."
    },
    {
        id: 3,
        nome: "Coleira Antipulgas",
        preco: 39.90,
        categoria: "acessorio",
        imagem: "https://via.placeholder.com/150",
        descricao: "Coleira que protege seu cão contra pulgas e carrapatos."
    },
    {
        id: 4,
        nome: "Ração para Gatos Castrados",
        preco: 79.90,
        categoria: "racao",
        imagem: "https://via.placeholder.com/150",
        descricao: "Ração especial para gatos castrados."
    },
    {
        id: 5,
        nome: "Arranhador para Gatos",
        preco: 129.90,
        categoria: "brinquedo",
        imagem: "https://via.placeholder.com/150",
        descricao: "Arranhador com plataformas e brinquedos pendurados."
    },
    {
        id: 6,
        nome: "Guia Retrátil",
        preco: 59.90,
        categoria: "acessorio",
        imagem: "https://via.placeholder.com/150",
        descricao: "Guia retrátil de 5 metros para passeios com segurança."
    }
];