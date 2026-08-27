// =========================================
// CONFIGURAÇÃO DO SUPABASE - TECHNEXA
// =========================================

const SUPABASE_URL =
    "https://ajsrevngbmmlterpjexe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_JrTY11kgjdpEbDm9BJuyXw_YdIqqwFE";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================================
// ELEMENTOS - LOGIN
// =========================================

const areaLogin =
    document.getElementById("areaLogin");

const areaPainel =
    document.getElementById("areaPainel");

const formLogin =
    document.getElementById("formLogin");

const emailLogin =
    document.getElementById("emailLogin");

const senhaLogin =
    document.getElementById("senhaLogin");

const botaoLogin =
    document.getElementById("botaoLogin");

const botaoSair =
    document.getElementById("botaoSair");

const mensagemLogin =
    document.getElementById("mensagemLogin");


// =========================================
// ELEMENTOS - SERVIÇOS
// =========================================

const formServico =
    document.getElementById("formServico");

const servicoId =
    document.getElementById("servicoId");

const nomeServico =
    document.getElementById("nomeServico");

const descricaoServico =
    document.getElementById("descricaoServico");

const precoServico =
    document.getElementById("precoServico");

const categoriaServico =
    document.getElementById("categoriaServico");

const imagemServico =
    document.getElementById("imagemServico");

const imagemAtual =
    document.getElementById("imagemAtual");

const statusServico =
    document.getElementById("statusServico");

const botaoSalvar =
    document.getElementById("botaoSalvar");

const botaoCancelar =
    document.getElementById("botaoCancelar");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const mensagemServico =
    document.getElementById("mensagemServico");

const listaAdminServicos =
    document.getElementById("listaAdminServicos");

const carregandoServicos =
    document.getElementById("carregandoServicos");

const areaPreview =
    document.getElementById("areaPreview");

const previewImagem =
    document.getElementById("previewImagem");


// =========================================
// RESUMO
// =========================================

const totalServicos =
    document.getElementById("totalServicos");

const totalDisponiveis =
    document.getElementById("totalDisponiveis");

const totalIndisponiveis =
    document.getElementById("totalIndisponiveis");


let servicos = [];


// =========================================
// MENSAGENS
// =========================================

function mostrarMensagemLogin(
    texto,
    sucesso = false
) {

    mensagemLogin.textContent =
        texto;

    mensagemLogin.style.color =
        sucesso
            ? "#70d997"
            : "#ff8787";

}


function mostrarMensagemServico(
    texto,
    sucesso = false
) {

    mensagemServico.textContent =
        texto;

    mensagemServico.style.color =
        sucesso
            ? "#70d997"
            : "#ff8787";

}


// =========================================
// VERIFICAR LOGIN
// =========================================

async function verificarLogin() {

    const {
        data: { session }
    } = await supabaseClient.auth
        .getSession();

    if (session) {

        mostrarPainel();

    } else {

        mostrarLogin();

    }

}


// =========================================
// MOSTRAR LOGIN
// =========================================

function mostrarLogin() {

    areaLogin.style.display =
        "flex";

    areaPainel.style.display =
        "none";

}


// =========================================
// MOSTRAR PAINEL
// =========================================
function mostrarPainel() {

    areaLogin.style.display =
        "none";

    areaPainel.style.display =
        "block";

    carregarServicos();

    carregarProdutosAdmin();

}

// =========================================
// LOGIN
// =========================================

formLogin.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        mostrarMensagemLogin("");

        botaoLogin.disabled =
            true;

        botaoLogin.textContent =
            "Entrando...";

        const email =
            emailLogin.value.trim();

        const senha =
            senhaLogin.value;

        const {
            error
        } = await supabaseClient.auth
            .signInWithPassword({

                email: email,
                password: senha

            });

        if (error) {

            console.error(error);

            mostrarMensagemLogin(
                "E-mail ou senha incorretos."
            );

            botaoLogin.disabled =
                false;

            botaoLogin.textContent =
                "Entrar";

            return;

        }

        mostrarMensagemLogin(
            "Login realizado com sucesso!",
            true
        );

        formLogin.reset();

        setTimeout(
            () => {

                mostrarPainel();

                botaoLogin.disabled =
                    false;

                botaoLogin.textContent =
                    "Entrar";

            },
            400
        );

    }
);


// =========================================
// SAIR
// =========================================

botaoSair.addEventListener(
    "click",
    async function() {

        await supabaseClient.auth
            .signOut();

        limparFormulario();

        mostrarLogin();

    }
);


// =========================================
// FORMATAR PREÇO
// =========================================

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

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// =========================================
// NOME DA CATEGORIA
// =========================================

function nomeCategoria(categoria) {

    const categorias = {

        telas:
            "Telas",

        baterias:
            "Baterias",

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


// =========================================
// CARREGAR SERVIÇOS
// =========================================

async function carregarServicos() {

    carregandoServicos.style.display =
        "block";

    listaAdminServicos.innerHTML =
        "";

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

    carregandoServicos.style.display =
        "none";

    if (error) {

        console.error(error);

        listaAdminServicos.innerHTML = `
            <p style="
                text-align:center;
                color:#ff8787;
                padding:25px 10px;
            ">
                Erro ao carregar os serviços.
            </p>
        `;

        return;

    }

    servicos =
        data || [];

    mostrarServicos();

    atualizarResumo();

}


// =========================================
// RESUMO
// =========================================

function atualizarResumo() {

    totalServicos.textContent =
        servicos.length;

    totalDisponiveis.textContent =
        servicos.filter(
            servico =>
                servico.status ===
                "disponivel"
        ).length;

    totalIndisponiveis.textContent =
        servicos.filter(
            servico =>
                servico.status ===
                "indisponivel"
        ).length;

}


// =========================================
// MOSTRAR SERVIÇOS
// =========================================

function mostrarServicos() {

    listaAdminServicos.innerHTML =
        "";

    if (servicos.length === 0) {

        listaAdminServicos.innerHTML = `
            <p style="
                color:#71869a;
                text-align:center;
                padding:30px 10px;
                font-size:13px;
            ">
                Nenhum serviço cadastrado ainda.
            </p>
        `;

        return;

    }

    servicos.forEach(
        servico => {

            const item =
                document.createElement(
                    "div"
                );

            item.classList.add(
                "admin-produto"
            );

            item.innerHTML = `

                <img
                    src="${servico.imagem_url || ""}"
                    alt="${servico.nome}"
                >

                <div class="admin-produto-info">

                    <h3>
                        ${servico.nome}
                    </h3>

                    <p>
                        ${formatarPreco(
                            servico.preco
                        )}
                    </p>

                    <span>
                        ${nomeCategoria(
                            servico.categoria
                        )}
                    </span>

                    <span
                        class="${
                            servico.status ===
                            "disponivel"
                                ? "status-disponivel"
                                : "status-esgotado"
                        }"
                    >
                        ${
                            servico.status ===
                            "disponivel"
                                ? "Disponível"
                                : "Indisponível"
                        }
                    </span>

                </div>

                <div class="admin-acoes">

                    <button
                        class="botao-editar"
                        onclick="editarServico(${servico.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="botao-excluir"
                        onclick="excluirServico(${servico.id})"
                    >
                        Excluir
                    </button>

                </div>

            `;

            listaAdminServicos
                .appendChild(
                    item
                );

        }
    );

}


// =========================================
// PREVIEW DA FOTO
// =========================================

imagemServico.addEventListener(
    "change",
    function() {

        const arquivo =
            imagemServico.files[0];

        if (!arquivo) {
            return;
        }

        const urlTemporaria =
            URL.createObjectURL(
                arquivo
            );

        previewImagem.src =
            urlTemporaria;

        areaPreview.style.display =
            "block";

    }
);


// =========================================
// ENVIAR FOTO
// =========================================

async function enviarFoto(arquivo) {

    if (!arquivo) {
        return null;
    }

    const extensao =
        arquivo.name
            .split(".")
            .pop()
            .toLowerCase();

    const nomeArquivo =
        `${Date.now()}-` +
        `${Math.random()
            .toString(36)
            .substring(2, 10)}` +
        `.${extensao}`;

    const caminho =
        `servicos/${nomeArquivo}`;

    const {
        data,
        error
    } = await supabaseClient
        .storage
        .from("servicos")
        .upload(
            caminho,
            arquivo,
            {
                cacheControl:
                    "3600",

                upsert:
                    false
            }
        );

    if (error) {

        console.error(
            "Erro no upload:",
            error
        );

        throw new Error(
            "Não foi possível enviar a foto."
        );

    }

    const {
        data: publicUrlData
    } = supabaseClient
        .storage
        .from("servicos")
        .getPublicUrl(
            data.path
        );

    return publicUrlData.publicUrl;

}


// =========================================
// APAGAR FOTO DO STORAGE
// =========================================

async function apagarFotoStorage(
    urlImagem
) {

    if (!urlImagem) {
        return;
    }

    try {

        const marcador =
            "/storage/v1/object/public/servicos/";

        const indice =
            urlImagem.indexOf(
                marcador
            );

        if (indice === -1) {

            console.warn(
                "Não foi possível identificar o caminho da foto."
            );

            return;

        }

        const caminho =
            decodeURIComponent(
                urlImagem.substring(
                    indice +
                    marcador.length
                )
            );

        const {
            error
        } = await supabaseClient
            .storage
            .from("servicos")
            .remove(
                [caminho]
            );

        if (error) {

            console.error(
                "Erro ao apagar foto:",
                error
            );

        }

    } catch (erro) {

        console.error(
            "Erro ao apagar foto:",
            erro
        );

    }

}


// =========================================
// SALVAR SERVIÇO
// =========================================

formServico.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        mostrarMensagemServico("");

        botaoSalvar.disabled =
            true;

        botaoSalvar.textContent =
            servicoId.value
                ? "Salvando alterações..."
                : "Cadastrando serviço...";

        let novaFotoEnviada =
            null;

        try {

            const arquivo =
                imagemServico.files[0];

            const fotoAntiga =
                imagemAtual.value;

            let urlImagem =
                fotoAntiga;

            // NOVO SERVIÇO PRECISA DE FOTO

            if (
                !servicoId.value
                &&
                !arquivo
            ) {

                mostrarMensagemServico(
                    "Escolha uma foto do serviço."
                );

                botaoSalvar.disabled =
                    false;

                botaoSalvar.textContent =
                    "Salvar serviço";

                return;

            }


            // ENVIA FOTO NOVA

            if (arquivo) {

                mostrarMensagemServico(
                    "Enviando foto..."
                );

                novaFotoEnviada =
                    await enviarFoto(
                        arquivo
                    );

                urlImagem =
                    novaFotoEnviada;

            }


            // PREÇO OPCIONAL

            let preco =
                null;

            if (
                precoServico.value
                    .trim() !== ""
            ) {

                preco =
                    Number(
                        precoServico.value
                    );

            }


            const dadosServico = {

                nome:
                    nomeServico.value
                        .trim(),

                descricao:
                    descricaoServico.value
                        .trim(),

                preco:
                    preco,

                categoria:
                    categoriaServico.value,

                status:
                    statusServico.value,

                imagem_url:
                    urlImagem

            };


            // =================================
            // EDITAR
            // =================================

            if (servicoId.value) {

                const {
                    error
                } = await supabaseClient
                    .from("servicos")
                    .update(
                        dadosServico
                    )
                    .eq(
                        "id",
                        Number(
                            servicoId.value
                        )
                    );

                if (error) {
                    throw error;
                }

                if (
                    arquivo
                    &&
                    fotoAntiga
                    &&
                    fotoAntiga !==
                    urlImagem
                ) {

                    await apagarFotoStorage(
                        fotoAntiga
                    );

                }

                mostrarMensagemServico(
                    "Serviço atualizado com sucesso!",
                    true
                );

            }


            // =================================
            // NOVO SERVIÇO
            // =================================

            else {

                const {
                    error
                } = await supabaseClient
                    .from("servicos")
                    .insert(
                        [
                            dadosServico
                        ]
                    );

                if (error) {
                    throw error;
                }

                mostrarMensagemServico(
                    "Serviço cadastrado com sucesso!",
                    true
                );

            }


            limparFormulario();

            await carregarServicos();


        } catch (erro) {

            console.error(
                erro
            );

            if (novaFotoEnviada) {

                await apagarFotoStorage(
                    novaFotoEnviada
                );

            }

            mostrarMensagemServico(
                erro.message
                ||
                "Não foi possível salvar o serviço."
            );

        }


        botaoSalvar.disabled =
            false;

        botaoSalvar.textContent =
            "Salvar serviço";

    }
);


// =========================================
// EDITAR SERVIÇO
// =========================================

function editarServico(id) {

    const servico =
        servicos.find(
            servico =>
                servico.id === id
        );

    if (!servico) {
        return;
    }

    servicoId.value =
        servico.id;

    nomeServico.value =
        servico.nome || "";

    descricaoServico.value =
        servico.descricao || "";

    precoServico.value =
        servico.preco ?? "";

    categoriaServico.value =
        servico.categoria || "";

    statusServico.value =
        servico.status || "disponivel";

    imagemAtual.value =
        servico.imagem_url || "";

    imagemServico.value =
        "";

    if (servico.imagem_url) {

        previewImagem.src =
            servico.imagem_url;

        areaPreview.style.display =
            "block";

    } else {

        previewImagem.src =
            "";

        areaPreview.style.display =
            "none";

    }

    tituloFormulario.textContent =
        "Editar serviço";

    botaoSalvar.textContent =
        "Salvar alterações";

    botaoCancelar.style.display =
        "block";

    mostrarMensagemServico("");

    window.scrollTo({

        top: 0,

        behavior:
            "smooth"

    });

}


// =========================================
// EXCLUIR SERVIÇO
// =========================================

async function excluirServico(id) {

    const servico =
        servicos.find(
            servico =>
                servico.id === id
        );

    if (!servico) {
        return;
    }

    const confirmar =
        confirm(
            `Deseja realmente excluir "${servico.nome}"?`
        );

    if (!confirmar) {
        return;
    }

    const {
        error
    } = await supabaseClient
        .from("servicos")
        .delete()
        .eq(
            "id",
            id
        );

    if (error) {

        console.error(
            error
        );

        alert(
            "Não foi possível excluir o serviço."
        );

        return;

    }

    if (servico.imagem_url) {

        await apagarFotoStorage(
            servico.imagem_url
        );

    }

    await carregarServicos();

}


// =========================================
// LIMPAR FORMULÁRIO
// =========================================

function limparFormulario() {

    formServico.reset();

    servicoId.value =
        "";

    imagemAtual.value =
        "";

    statusServico.value =
        "disponivel";

    previewImagem.src =
        "";

    areaPreview.style.display =
        "none";

    tituloFormulario.textContent =
        "Adicionar novo serviço";

    botaoCancelar.style.display =
        "none";

    botaoSalvar.textContent =
        "Salvar serviço";

}


// =========================================
// CANCELAR EDIÇÃO
// =========================================

botaoCancelar.addEventListener(
    "click",
    function() {

        limparFormulario();

        mostrarMensagemServico("");

    }
);


// =========================================
// ACOMPANHAR LOGIN
// =========================================

supabaseClient.auth
    .onAuthStateChange(
        (
            event,
            session
        ) => {

            if (
                event ===
                "SIGNED_OUT"
            ) {

                mostrarLogin();

            }

        }
    );


// =========================================
// INICIAR
// =========================================
// =========================================
// ELEMENTOS - PRODUTOS
// =========================================

const formProduto =
    document.getElementById("formProduto");

const produtoId =
    document.getElementById("produtoId");

const nomeProduto =
    document.getElementById("nomeProduto");

const descricaoProduto =
    document.getElementById("descricaoProduto");

const precoProduto =
    document.getElementById("precoProduto");

const categoriaProduto =
    document.getElementById("categoriaProduto");

const imagemProduto =
    document.getElementById("imagemProduto");

const imagemAtualProduto =
    document.getElementById("imagemAtualProduto");

const statusProduto =
    document.getElementById("statusProduto");

const botaoSalvarProduto =
    document.getElementById("botaoSalvarProduto");

const botaoCancelarProduto =
    document.getElementById("botaoCancelarProduto");

const tituloFormularioProduto =
    document.getElementById("tituloFormularioProduto");

const mensagemProduto =
    document.getElementById("mensagemProduto");

const carregandoProdutos =
    document.getElementById("carregandoProdutos");

const listaAdminProdutos =
    document.getElementById("listaAdminProdutos");

const areaPreviewProduto =
    document.getElementById("areaPreviewProduto");

const previewImagemProduto =
    document.getElementById("previewImagemProduto");

let produtos = [];


// =========================================
// MENSAGEM PRODUTO
// =========================================

function mostrarMensagemProduto(
    texto,
    sucesso = false
) {

    mensagemProduto.textContent =
        texto;

    mensagemProduto.style.color =
        sucesso
            ? "#70d997"
            : "#ff8787";

}


// =========================================
// NOME CATEGORIA PRODUTO
// =========================================

function nomeCategoriaProduto(categoria) {

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


// =========================================
// CARREGAR PRODUTOS
// =========================================

async function carregarProdutosAdmin() {

    carregandoProdutos.style.display =
        "block";

    listaAdminProdutos.innerHTML =
        "";

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

    carregandoProdutos.style.display =
        "none";

    if (error) {

        console.error(error);

        listaAdminProdutos.innerHTML = `
            <p style="
                text-align:center;
                color:#ff8787;
                padding:25px 10px;
            ">
                Erro ao carregar os produtos.
            </p>
        `;

        return;

    }

    produtos =
        data || [];

    mostrarProdutosAdmin();

}


// =========================================
// MOSTRAR PRODUTOS
// =========================================

function mostrarProdutosAdmin() {

    listaAdminProdutos.innerHTML =
        "";

    if (produtos.length === 0) {

        listaAdminProdutos.innerHTML = `
            <p style="
                color:#71869a;
                text-align:center;
                padding:30px 10px;
                font-size:13px;
            ">
                Nenhum produto cadastrado ainda.
            </p>
        `;

        return;

    }

    produtos.forEach(
        produto => {

            const item =
                document.createElement(
                    "div"
                );

            item.classList.add(
                "admin-produto"
            );

            item.innerHTML = `

                <img
                    src="${produto.imagem_url || ""}"
                    alt="${produto.nome}"
                >

                <div class="admin-produto-info">

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p>
                        ${formatarPreco(
                            produto.preco
                        )}
                    </p>

                    <span>
                        ${nomeCategoriaProduto(
                            produto.categoria
                        )}
                    </span>

                    <span
                        class="${
                            produto.status ===
                            "disponivel"
                                ? "status-disponivel"
                                : "status-esgotado"
                        }"
                    >
                        ${
                            produto.status ===
                            "disponivel"
                                ? "Disponível"
                                : "Esgotado"
                        }
                    </span>

                </div>

                <div class="admin-acoes">

                    <button
                        class="botao-editar"
                        onclick="editarProduto(${produto.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="botao-excluir"
                        onclick="excluirProduto(${produto.id})"
                    >
                        Excluir
                    </button>

                </div>

            `;

            listaAdminProdutos
                .appendChild(
                    item
                );

        }
    );

}


// =========================================
// PREVIEW PRODUTO
// =========================================

imagemProduto.addEventListener(
    "change",
    function() {

        const arquivo =
            imagemProduto.files[0];

        if (!arquivo) {
            return;
        }

        const urlTemporaria =
            URL.createObjectURL(
                arquivo
            );

        previewImagemProduto.src =
            urlTemporaria;

        areaPreviewProduto.style.display =
            "block";

    }
);


// =========================================
// ENVIAR FOTO PRODUTO
// =========================================

async function enviarFotoProduto(
    arquivo
) {

    if (!arquivo) {
        return null;
    }

    const extensao =
        arquivo.name
            .split(".")
            .pop()
            .toLowerCase();

    const nomeArquivo =
        `${Date.now()}-` +
        `${Math.random()
            .toString(36)
            .substring(2, 10)}` +
        `.${extensao}`;

    const caminho =
        `produtos/${nomeArquivo}`;

    const {
        data,
        error
    } = await supabaseClient
        .storage
        .from("produtos")
        .upload(
            caminho,
            arquivo,
            {
                cacheControl:
                    "3600",

                upsert:
                    false
            }
        );

    if (error) {

        console.error(
            "Erro no upload do produto:",
            error
        );

        throw new Error(
            "Não foi possível enviar a foto do produto."
        );

    }

    const {
        data: publicUrlData
    } = supabaseClient
        .storage
        .from("produtos")
        .getPublicUrl(
            data.path
        );

    return publicUrlData.publicUrl;

}


// =========================================
// APAGAR FOTO PRODUTO
// =========================================

async function apagarFotoProduto(
    urlImagem
) {

    if (!urlImagem) {
        return;
    }

    try {

        const marcador =
            "/storage/v1/object/public/produtos/";

        const indice =
            urlImagem.indexOf(
                marcador
            );

        if (indice === -1) {
            return;
        }

        const caminho =
            decodeURIComponent(
                urlImagem.substring(
                    indice +
                    marcador.length
                )
            );

        const {
            error
        } = await supabaseClient
            .storage
            .from("produtos")
            .remove(
                [caminho]
            );

        if (error) {

            console.error(
                "Erro ao apagar foto do produto:",
                error
            );

        }

    } catch (erro) {

        console.error(
            erro
        );

    }

}


// =========================================
// SALVAR PRODUTO
// =========================================

formProduto.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        mostrarMensagemProduto("");

        botaoSalvarProduto.disabled =
            true;

        botaoSalvarProduto.textContent =
            produtoId.value
                ? "Salvando alterações..."
                : "Cadastrando produto...";

        let novaFotoEnviada =
            null;

        try {

            const arquivo =
                imagemProduto.files[0];

            const fotoAntiga =
                imagemAtualProduto.value;

            let urlImagem =
                fotoAntiga;


            // NOVO PRODUTO PRECISA DE FOTO

            if (
                !produtoId.value
                &&
                !arquivo
            ) {

                mostrarMensagemProduto(
                    "Escolha uma foto do produto."
                );

                botaoSalvarProduto.disabled =
                    false;

                botaoSalvarProduto.textContent =
                    "Salvar produto";

                return;

            }


            // FOTO NOVA

            if (arquivo) {

                mostrarMensagemProduto(
                    "Enviando foto..."
                );

                novaFotoEnviada =
                    await enviarFotoProduto(
                        arquivo
                    );

                urlImagem =
                    novaFotoEnviada;

            }


            const dadosProduto = {

                nome:
                    nomeProduto.value
                        .trim(),

                descricao:
                    descricaoProduto.value
                        .trim(),

                preco:
                    Number(
                        precoProduto.value
                    ),

                categoria:
                    categoriaProduto.value,

                status:
                    statusProduto.value,

                imagem_url:
                    urlImagem

            };


            // EDITAR

            if (produtoId.value) {

                const {
                    error
                } = await supabaseClient
                    .from("produtos")
                    .update(
                        dadosProduto
                    )
                    .eq(
                        "id",
                        Number(
                            produtoId.value
                        )
                    );

                if (error) {
                    throw error;
                }

                if (
                    arquivo
                    &&
                    fotoAntiga
                    &&
                    fotoAntiga !==
                    urlImagem
                ) {

                    await apagarFotoProduto(
                        fotoAntiga
                    );

                }

                mostrarMensagemProduto(
                    "Produto atualizado com sucesso!",
                    true
                );

            }


            // NOVO

            else {

                const {
                    error
                } = await supabaseClient
                    .from("produtos")
                    .insert(
                        [
                            dadosProduto
                        ]
                    );

                if (error) {
                    throw error;
                }

                mostrarMensagemProduto(
                    "Produto cadastrado com sucesso!",
                    true
                );

            }

            limparFormularioProduto();

            await carregarProdutosAdmin();


        } catch (erro) {

            console.error(
                erro
            );

            if (novaFotoEnviada) {

                await apagarFotoProduto(
                    novaFotoEnviada
                );

            }

            mostrarMensagemProduto(
                erro.message
                ||
                "Não foi possível salvar o produto."
            );

        }

        botaoSalvarProduto.disabled =
            false;

        botaoSalvarProduto.textContent =
            "Salvar produto";

    }
);


// =========================================
// EDITAR PRODUTO
// =========================================

function editarProduto(id) {

    const produto =
        produtos.find(
            produto =>
                produto.id === id
        );

    if (!produto) {
        return;
    }

    produtoId.value =
        produto.id;

    nomeProduto.value =
        produto.nome || "";

    descricaoProduto.value =
        produto.descricao || "";

    precoProduto.value =
        produto.preco ?? "";

    categoriaProduto.value =
        produto.categoria || "";

    statusProduto.value =
        produto.status || "disponivel";

    imagemAtualProduto.value =
        produto.imagem_url || "";

    imagemProduto.value =
        "";

    if (produto.imagem_url) {

        previewImagemProduto.src =
            produto.imagem_url;

        areaPreviewProduto.style.display =
            "block";

    } else {

        previewImagemProduto.src =
            "";

        areaPreviewProduto.style.display =
            "none";

    }

    tituloFormularioProduto.textContent =
        "Editar produto";

    botaoSalvarProduto.textContent =
        "Salvar alterações";

    botaoCancelarProduto.style.display =
        "block";

    mostrarMensagemProduto("");

    window.scrollTo({

        top:
            document.body.scrollHeight,

        behavior:
            "smooth"

    });

}


// =========================================
// EXCLUIR PRODUTO
// =========================================

async function excluirProduto(id) {

    const produto =
        produtos.find(
            produto =>
                produto.id === id
        );

    if (!produto) {
        return;
    }

    const confirmar =
        confirm(
            `Deseja realmente excluir "${produto.nome}"?`
        );

    if (!confirmar) {
        return;
    }

    const {
        error
    } = await supabaseClient
        .from("produtos")
        .delete()
        .eq(
            "id",
            id
        );

    if (error) {

        console.error(
            error
        );

        alert(
            "Não foi possível excluir o produto."
        );

        return;

    }

    if (produto.imagem_url) {

        await apagarFotoProduto(
            produto.imagem_url
        );

    }

    await carregarProdutosAdmin();

}


// =========================================
// LIMPAR PRODUTO
// =========================================

function limparFormularioProduto() {

    formProduto.reset();

    produtoId.value =
        "";

    imagemAtualProduto.value =
        "";

    statusProduto.value =
        "disponivel";

    previewImagemProduto.src =
        "";

    areaPreviewProduto.style.display =
        "none";

    tituloFormularioProduto.textContent =
        "Adicionar novo produto";

    botaoCancelarProduto.style.display =
        "none";

    botaoSalvarProduto.textContent =
        "Salvar produto";

}


// =========================================
// CANCELAR PRODUTO
// =========================================

botaoCancelarProduto.addEventListener(
    "click",
    function() {

        limparFormularioProduto();

        mostrarMensagemProduto("");

    }
);
verificarLogin();