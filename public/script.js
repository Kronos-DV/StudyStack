const formulario = document.getElementById("formTarefa");
const listaTarefas = document.getElementById("listaTarefas");

async function carregarTarefas() {
    const resposta = await fetch("/api/tarefas");
    const tarefas = await resposta.json();

    listaTarefas.innerHTML = "";

    tarefas.forEach(tarefa => {

        const div = document.createElement("div");

        div.className = "tarefa";

        if (tarefa.concluida) {
            div.classList.add("concluida");
        }

        div.innerHTML = `
            <h3>${tarefa.titulo}</h3>

            <p>
                <strong>Matéria:</strong>
                ${tarefa.materia || "Não informada"}
            </p>

            <p>
                ${tarefa.descricao || "Sem descrição"}
            </p>

            <p>
                <strong>Entrega:</strong>
                ${tarefa.data_entrega || "Não definida"}
            </p>

            ${
                !tarefa.concluida
                ? `<button onclick="concluirTarefa(${tarefa.id})">
                    Concluir
                   </button>`
                : ""
            }

            <button onclick="excluirTarefa(${tarefa.id})">
                Excluir
            </button>
        `;

        listaTarefas.appendChild(div);
    });
}

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const tarefa = {
        titulo: document.getElementById("titulo").value,
        materia: document.getElementById("materia").value,
        descricao: document.getElementById("descricao").value,
        data_entrega: document.getElementById("dataEntrega").value
    };

    await fetch("/api/tarefas", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(tarefa)
    });

    formulario.reset();

    carregarTarefas();
});

async function excluirTarefa(id) {

    await fetch(`/api/tarefas/${id}`, {
        method: "DELETE"
    });

    carregarTarefas();
}

async function concluirTarefa(id) {

    await fetch(`/api/tarefas/${id}`, {
        method: "PUT"
    });

    carregarTarefas();
}

carregarTarefas();
