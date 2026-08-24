const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.static("public"));

// Banco de dados
const db = new Database("./tarefas.db");

console.log("Banco de dados conectado!");

// Criar tabela
db.exec(`
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT,
        materia TEXT,
        data_entrega TEXT,
        concluida INTEGER DEFAULT 0
    )
`);

console.log("Tabela tarefas pronta!");

// ================================
// LISTAR TAREFAS
// ================================
app.get("/api/tarefas", (req, res) => {
    try {
        const tarefas = db
            .prepare("SELECT * FROM tarefas ORDER BY id DESC")
            .all();

        res.json(tarefas);
    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

// ================================
// CRIAR TAREFA
// ================================
app.post("/api/tarefas", (req, res) => {
    const {
        titulo,
        descricao,
        materia,
        data_entrega
    } = req.body;

    if (!titulo) {
        return res.status(400).json({
            erro: "O título da tarefa é obrigatório."
        });
    }

    try {
        const comando = db.prepare(`
            INSERT INTO tarefas
            (titulo, descricao, materia, data_entrega)
            VALUES (?, ?, ?, ?)
        `);

        const resultado = comando.run(
            titulo,
            descricao || "",
            materia || "",
            data_entrega || ""
        );

        res.json({
            id: resultado.lastInsertRowid,
            mensagem: "Tarefa criada com sucesso!"
        });

    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

// ================================
// EXCLUIR TAREFA
// ================================
app.delete("/api/tarefas/:id", (req, res) => {
    const { id } = req.params;

    try {
        const comando = db.prepare(
            "DELETE FROM tarefas WHERE id = ?"
        );

        comando.run(id);

        res.json({
            mensagem: "Tarefa excluída!"
        });

    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

// ================================
// CONCLUIR TAREFA
// ================================
app.put("/api/tarefas/:id", (req, res) => {
    const { id } = req.params;

    try {
        const comando = db.prepare(`
            UPDATE tarefas
            SET concluida = 1
            WHERE id = ?
        `);

        comando.run(id);

        res.json({
            mensagem: "Tarefa concluída!"
        });

    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

// ================================
// INICIAR SERVIDOR
// ================================
app.listen(PORT, () => {
    console.log("");
    console.log("================================");
    console.log("     STUDYTASK INICIADO");
    console.log("================================");
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log("================================");
});
