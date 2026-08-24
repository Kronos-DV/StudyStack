# StudyTask

Organizador web de tarefas estudantis desenvolvido com Node.js, Express e SQLite.

## Funcionalidades

- Criar tarefas com título, matéria, descrição e data de entrega.
- Listar tarefas cadastradas.
- Marcar tarefas como concluídas.
- Excluir tarefas.
- Interface responsiva para computador e celular.
- Persistência local dos dados em SQLite.

## Tecnologias

- HTML, CSS e JavaScript
- Node.js
- Express
- SQLite com `better-sqlite3`

## Como executar

Requisitos: Node.js instalado.

```bash
npm install
npm start
```

Depois, abra [http://localhost:3000](http://localhost:3000) no navegador.

Durante o desenvolvimento, também é possível reiniciar o servidor automaticamente:

```bash
npm run dev
```

## API

| Método | Endpoint | Finalidade |
| --- | --- | --- |
| `GET` | `/api/tarefas` | Listar tarefas |
| `POST` | `/api/tarefas` | Criar uma tarefa |
| `PUT` | `/api/tarefas/:id` | Marcar uma tarefa como concluída |
| `DELETE` | `/api/tarefas/:id` | Excluir uma tarefa |

## Estrutura

```text
StudyTask/
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── server.js
├── package.json
└── README.md
```

O arquivo local do banco de dados não é enviado ao GitHub.

