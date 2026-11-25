const formulario = document.getElementById("formTarefa");
const listaTarefas = document.getElementById("listaTarefas");

async function enviarRequisicao(url, opcoes) {
    const resposta = await fetch(url, opcoes);
    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível concluir a operação.");
    }

    return dados;
}

function criarParagrafo(rotulo, valor, valorPadrao = "") {
    const paragrafo = document.createElement("p");

    if (rotulo) {
        const etiqueta = document.createElement("strong");
        etiqueta.textContent = rotulo;
        paragrafo.append(etiqueta, document.createTextNode(" "));
    }

    paragrafo.append(document.createTextNode(valor || valorPadrao));
    return paragrafo;
}

function criarBotao(texto, acao) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = texto;
    botao.addEventListener("click", acao);
    return botao;
}

function criarTarefa(tarefa) {
    const cartao = document.createElement("div");
    cartao.className = "tarefa";

    if (tarefa.concluida) {
        cartao.classList.add("concluida");
    }

    const titulo = document.createElement("h3");
    titulo.textContent = tarefa.titulo;
    cartao.append(titulo);
    cartao.append(criarParagrafo("Matéria:", tarefa.materia, "Não informada"));
    cartao.append(criarParagrafo("", tarefa.descricao, "Sem descrição"));
    cartao.append(criarParagrafo("Entrega:", tarefa.data_entrega, "Não definida"));

    if (!tarefa.concluida) {
        cartao.append(criarBotao("Concluir", () => concluirTarefa(tarefa.id)));
    }

    cartao.append(criarBotao("Excluir", () => excluirTarefa(tarefa.id)));
    return cartao;
}

async function carregarTarefas() {
    try {
        const tarefas = await enviarRequisicao("/api/tarefas");
        listaTarefas.replaceChildren(...tarefas.map(criarTarefa));
    } catch (erro) {
        const mensagem = document.createElement("p");
        mensagem.textContent = `Não foi possível carregar as tarefas: ${erro.message}`;
        listaTarefas.replaceChildren(mensagem);
    }
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const tarefa = {
        titulo: document.getElementById("titulo").value.trim(),
        materia: document.getElementById("materia").value,
        descricao: document.getElementById("descricao").value,
        data_entrega: document.getElementById("dataEntrega").value
    };

    try {
        await enviarRequisicao("/api/tarefas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tarefa)
        });

        formulario.reset();
        await carregarTarefas();
    } catch (erro) {
        alert(`Não foi possível salvar a tarefa: ${erro.message}`);
    }
});

async function excluirTarefa(id) {
    try {
        await enviarRequisicao(`/api/tarefas/${id}`, { method: "DELETE" });
        await carregarTarefas();
    } catch (erro) {
        alert(`Não foi possível excluir a tarefa: ${erro.message}`);
    }
}

async function concluirTarefa(id) {
    try {
        await enviarRequisicao(`/api/tarefas/${id}`, { method: "PUT" });
        await carregarTarefas();
    } catch (erro) {
        alert(`Não foi possível concluir a tarefa: ${erro.message}`);
    }
}

carregarTarefas();
