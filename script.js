// ==============================
// SUPABASE
// ==============================
const SUPABASE_URL =
    "https://ajsrevngbmmlterpjexe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_JrTY11kgjdpEbDm9BJuyXw_YdIqqwFE";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

// ==============================
// WHATSAPP TECHNEXA
// ==============================

const numeroWhatsApp =
    "5591984328738";


// ==============================
// SERVIÇOS
// ==============================

let servicos = [];

let categoriaAtual =
    "todos";


// ==============================
// ELEMENTOS
// ==============================

const listaProdutos =
    document.getElementById(
        "listaProdutos"
    );

const campoBusca =
    document.getElementById(
        "campoBusca"
    );

const botoesCategorias =
    document.querySelectorAll(
        ".categoria"
    );

const quantidadeProdutos =
    document.getElementById(
        "quantidadeProdutos"
    );

const semResultados =
    document.getElementById(
        "semResultados"
    );


// ==============================
// FORMATAR PREÇO
// ==============================

function formatarPreco(valor) {

    if (
        valor === null
        ||
        valor === undefined
        ||
        valor === ""
    ) {

        return "Consulte o valor";

    }

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ==============================
// NOME DA CATEGORIA
// ==============================

function nomeCategoria(categoria) {

    const categorias = {

        telas:
            "Troca de Tela",

        baterias:
            "Bateria",

        manutencao:
            "Manutenção",

        software:
            "Software",

        outros:
            "Outros"

    };

    return (
        categorias[categoria]
        ||
        categoria
        ||
        "Serviço"
    );

}


// ==============================
// VERIFICAR DISPONIBILIDADE
// ==============================

function servicoDisponivel(servico) {

    const status =
        (
            servico.status
            ||
            "disponivel"
        ).toLowerCase();

    return ![
        "indisponivel",
        "esgotado",
        "inativo"
    ].includes(status);

}


// ==============================
// CARREGAR SERVIÇOS
// ==============================
// ==============================
// PRODUTOS À VENDA
// ==============================

let produtosVenda = [];

let categoriaProdutoAtual =
    "todos";

const listaProdutosVenda =
    document.getElementById(
        "listaProdutosVenda"
    );

const campoBuscaProdutos =
    document.getElementById(
        "campoBuscaProdutos"
    );

const botoesCategoriasProdutos =
    document.querySelectorAll(
        ".categoria-produto"
    );

const quantidadeProdutosVenda =
    document.getElementById(
        "quantidadeProdutosVenda"
    );

const semResultadosProdutos =
    document.getElementById(
        "semResultadosProdutos"
    );


// ==============================
// NOME CATEGORIA PRODUTO
// ==============================

function nomeCategoriaProduto(
    categoria
) {

    const categorias = {

        carregadores:
            "Carregadores",

        cabos:
            "Cabos",

        fones:
            "Fones",

        peliculas:
            "Películas",

        capinhas:
            "Capinhas",

        acessorios:
            "Acessórios",

        outros:
            "Outros"

    };

    return (
        categorias[categoria]
        ||
        categoria
        ||
        "Produto"
    );

}


// ==============================
// CARREGAR PRODUTOS
// ==============================

async function carregarProdutosVenda() {

    quantidadeProdutosVenda.textContent =
        "Carregando...";

    const {
        data,
        error
    } = await supabaseClient
        .from("produtos")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );

    if (error) {

        console.error(
            "Erro ao carregar produtos:",
            error
        );

        quantidadeProdutosVenda.textContent =
            "Erro ao carregar";

        return;

    }

    produtosVenda =
        data || [];

    filtrarProdutosVenda();

}


// ==============================
// MOSTRAR PRODUTOS
// ==============================

function mostrarProdutosVenda(
    lista
) {

    listaProdutosVenda.innerHTML =
        "";

    quantidadeProdutosVenda.textContent =
        lista.length === 1
            ? "1 produto"
            : `${lista.length} produtos`;

    if (lista.length === 0) {

        semResultadosProdutos.style.display =
            "block";

        return;

    }

    semResultadosProdutos.style.display =
        "none";

    lista.forEach(
        produto => {

            const card =
                document.createElement(
                    "article"
                );

            card.classList.add(
                "produto-card"
            );

            const imagem =
                produto.imagem_url
                || "";

            const disponivel =
                produto.status ===
                "disponivel";

            card.innerHTML = `
                <div class="produto-imagem">

                    <img
                        src="${imagem}"
                        alt="${produto.nome}"
                        loading="lazy"
                    >

                    <span class="etiqueta">
                        ${
                            disponivel
                                ? "DISPONÍVEL"
                                : "ESGOTADO"
                        }
                    </span>

                </div>

                <div class="produto-info">

                    <span class="produto-categoria">
                        ${nomeCategoriaProduto(
                            produto.categoria
                        )}
                    </span>
<h3>
    ${produto.nome}
</h3>

<p class="produto-preco">
    ${formatarPreco(
        produto.preco
    )}
</p>

${
    produto.descricao
        ? `
            <p class="produto-descricao">
                ${produto.descricao}
            </p>
        `
        : ""
}
</p>
                    ${
                        disponivel
                            ? `
                                <button
                                    class="botao-whatsapp"
                                    onclick="comprarProdutoVenda(${produto.id})"
                                >
                                    Comprar pelo WhatsApp
                                </button>
                            `
                            : `
                                <button
                                    class="botao-whatsapp"
                                    disabled
                                    style="
                                        opacity: 0.45;
                                        cursor: not-allowed;
                                    "
                                >
                                    Produto esgotado
                                </button>
                            `
                    }

                </div>
            `;

            listaProdutosVenda
                .appendChild(
                    card
                );

        }
    );

}


// ==============================
// FILTRAR PRODUTOS
// ==============================

function filtrarProdutosVenda() {

    const pesquisa =
        campoBuscaProdutos.value
            .toLowerCase()
            .trim();

    const filtrados =
        produtosVenda.filter(
            produto => {

                const nome =
                    (
                        produto.nome
                        ||
                        ""
                    ).toLowerCase();

                const combinaBusca =
                    nome.includes(
                        pesquisa
                    );

                const combinaCategoria =
                    categoriaProdutoAtual ===
                    "todos"
                    ||
                    produto.categoria ===
                    categoriaProdutoAtual;

                return (
                    combinaBusca
                    &&
                    combinaCategoria
                );

            }
        );

    mostrarProdutosVenda(
        filtrados
    );

}


// BUSCA

campoBuscaProdutos.addEventListener(
    "input",
    filtrarProdutosVenda
);


// CATEGORIAS

botoesCategoriasProdutos.forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                botoesCategoriasProdutos
                    .forEach(
                        btn => {

                            btn.classList
                                .remove(
                                    "ativa"
                                );

                        }
                    );

                botao.classList.add(
                    "ativa"
                );

                categoriaProdutoAtual =
                    botao.dataset
                        .categoria;

                filtrarProdutosVenda();

            }
        );

    }
);


// ==============================
// COMPRAR PRODUTO
// ==============================

function comprarProdutoVenda(id) {

    const produto =
        produtosVenda.find(
            produto =>
                produto.id === id
        );

    if (!produto) {
        return;
    }

    const mensagem =
        `Olá, TECHNEXA! ` +
        `Tenho interesse no produto ` +
        `"${produto.nome}", no valor de ` +
        `${formatarPreco(produto.preco)}. ` +
        `Gostaria de saber mais.`;

    const link =
        `https://wa.me/${numeroWhatsApp}` +
        `?text=${encodeURIComponent(
            mensagem
        )}`;

    window.open(
        link,
        "_blank"
    );

}


// ==============================
// ZOOM DOS PRODUTOS
// ==============================

listaProdutosVenda.addEventListener(
    "click",
    event => {

        const imagemClicada =
            event.target.closest(
                ".produto-imagem img"
            );

        if (!imagemClicada) {
            return;
        }

        imagemAmpliada.src =
            imagemClicada.src;

        imagemAmpliada.alt =
            imagemClicada.alt;

        imagemAmpliada.classList
            .remove("zoom");

        modalImagem.classList
            .add("ativo");

        document.body.style.overflow =
            "hidden";

    }
);
async function carregarServicos() {

    quantidadeProdutos.textContent =
        "Carregando...";

    const {
        data,
        error
    } = await supabaseClient
        .from("servicos")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );

    if (error) {

        console.error(
            "Erro ao carregar serviços:",
            error
        );

        quantidadeProdutos.textContent =
            "Erro ao carregar";

        listaProdutos.innerHTML = `
            <p style="
                grid-column: 1 / -1;
                text-align: center;
                color: #71869a;
                padding: 30px;
            ">
                Não foi possível carregar
                os serviços da TECHNEXA.
            </p>
        `;

        return;

    }

    servicos =
        data || [];

    filtrarServicos();

}


// ==============================
// MOSTRAR SERVIÇOS
// ==============================

function mostrarServicos(lista) {

    listaProdutos.innerHTML = "";

    quantidadeProdutos.textContent =
        lista.length === 1
            ? "1 serviço"
            : `${lista.length} serviços`;

    if (lista.length === 0) {

        semResultados.style.display =
            "block";

        return;

    }

    semResultados.style.display =
        "none";

    lista.forEach(servico => {

        const card =
            document.createElement(
                "article"
            );

        card.classList.add(
            "produto-card"
        );

        const imagem =
            servico.imagem_url
            || "";

        const disponivel =
            servicoDisponivel(
                servico
            );

        card.innerHTML = `
            <div class="produto-imagem">

                <img
                    src="${imagem}"
                    alt="${servico.nome}"
                    loading="lazy"
                >

                <span class="etiqueta">
                    ${
                        disponivel
                            ? "DISPONÍVEL"
                            : "INDISPONÍVEL"
                    }
                </span>

            </div>

            <div class="produto-info">

                <span class="produto-categoria">
                    ${nomeCategoria(
                        servico.categoria
                    )}
                </span>
<h3>
    ${servico.nome}
</h3>

<p class="produto-preco">
    ${formatarPreco(
        servico.preco
    )}
</p>

${
    servico.descricao
        ? `
            <p class="produto-descricao">
                ${servico.descricao}
            </p>
        `
        : ""
}
</p>
                ${
                    disponivel
                        ? `
                            <button
                                class="botao-whatsapp"
                                onclick="solicitarServico(${servico.id})"
                            >
                                Solicitar orçamento
                            </button>
                        `
                        : `
                            <button
                                class="botao-whatsapp"
                                disabled
                                style="
                                    opacity: 0.45;
                                    cursor: not-allowed;
                                "
                            >
                                Serviço indisponível
                            </button>
                        `
                }

            </div>
        `;

        listaProdutos.appendChild(
            card
        );

    });

}


// ==============================
// FILTRAR SERVIÇOS
// ==============================

function filtrarServicos() {

    const pesquisa =
        campoBusca.value
            .toLowerCase()
            .trim();

    const filtrados =
        servicos.filter(
            servico => {

                const nome =
                    (
                        servico.nome
                        ||
                        ""
                    ).toLowerCase();

                const categoria =
                    (
                        nomeCategoria(
                            servico.categoria
                        )
                        ||
                        ""
                    ).toLowerCase();

                const combinaBusca =
                    nome.includes(
                        pesquisa
                    )
                    ||
                    categoria.includes(
                        pesquisa
                    );

                const combinaCategoria =
                    categoriaAtual ===
                    "todos"
                    ||
                    servico.categoria ===
                    categoriaAtual;

                return (
                    combinaBusca
                    &&
                    combinaCategoria
                );

            }
        );

    mostrarServicos(
        filtrados
    );

}


// ==============================
// BUSCA
// ==============================

campoBusca.addEventListener(
    "input",
    filtrarServicos
);


// ==============================
// CATEGORIAS
// ==============================

botoesCategorias.forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                botoesCategorias
                    .forEach(
                        btn => {

                            btn.classList
                                .remove(
                                    "ativa"
                                );

                        }
                    );

                botao.classList.add(
                    "ativa"
                );

                categoriaAtual =
                    botao.dataset
                        .categoria;

                filtrarServicos();

            }
        );

    }
);


// ==============================
// WHATSAPP
// ==============================

function solicitarServico(id) {

    const servico =
        servicos.find(
            item =>
                item.id === id
        );

    if (!servico) {
        return;
    }

    const valor =
        formatarPreco(
            servico.preco
        );

    const mensagem =
        `Olá, TECHNEXA! ` +
        `Tenho interesse no serviço ` +
        `"${servico.nome}". ` +
        (
            valor ===
            "Consulte o valor"
                ? ""
                : `Valor informado: ${valor}. `
        ) +
        `Gostaria de solicitar um orçamento.`;

    const link =
        `https://wa.me/${numeroWhatsApp}` +
        `?text=${encodeURIComponent(
            mensagem
        )}`;

    window.open(
        link,
        "_blank"
    );

}


// ==============================
// ATUALIZAÇÃO EM TEMPO REAL
// ==============================

supabaseClient
    .channel(
        "servicos-technexa"
    )
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "servicos"
        },
        () => {

            carregarServicos();

        }
    )
    .subscribe();


// ==============================
// AMPLIAR FOTO
// ==============================

const modalImagem =
    document.getElementById(
        "modalImagem"
    );

const imagemAmpliada =
    document.getElementById(
        "imagemAmpliada"
    );

const fecharModal =
    document.getElementById(
        "fecharModal"
    );


// ==============================
// ABRIR FOTO
// ==============================

listaProdutos.addEventListener(
    "click",
    event => {

        const imagemClicada =
            event.target.closest(
                ".produto-imagem img"
            );

        if (!imagemClicada) {
            return;
        }

        imagemAmpliada.src =
            imagemClicada.src;

        imagemAmpliada.alt =
            imagemClicada.alt;

        imagemAmpliada.classList
            .remove(
                "zoom"
            );

        modalImagem.classList
            .add(
                "ativo"
            );

        document.body.style.overflow =
            "hidden";

    }
);


// ==============================
// ZOOM
// ==============================

imagemAmpliada.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        imagemAmpliada.classList
            .toggle(
                "zoom"
            );

    }
);


// ==============================
// FECHAR FOTO
// ==============================

function fecharImagemAmpliada() {

    modalImagem.classList
        .remove(
            "ativo"
        );

    imagemAmpliada.classList
        .remove(
            "zoom"
        );

    imagemAmpliada.src = "";

    document.body.style.overflow =
        "";

}


// BOTÃO X

fecharModal.addEventListener(
    "click",
    fecharImagemAmpliada
);


// FUNDO ESCURO

modalImagem.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modalImagem
            ||
            event.target
                .classList
                .contains(
                    "modal-conteudo"
                )
        ) {

            fecharImagemAmpliada();

        }

    }
);


// TECLA ESC

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
            &&
            modalImagem.classList
                .contains(
                    "ativo"
                )
        ) {

            fecharImagemAmpliada();

        }

    }
);


// ==============================
// INICIAR SITE
// ==============================
carregarServicos();
carregarProdutosVenda();