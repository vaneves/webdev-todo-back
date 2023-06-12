const express = require('express')
const db = require('./db')
const cors = require('cors')

const app = express()
const roteador = express.Router()

app.use(cors())
app.use(express.json())
app.use(roteador)

roteador.get('/ola', (req, res) => {
  res.json({
    ola: 'mundo'
  })
})

roteador.get('/tarefas', (req, res) => {
  const tarefas = db.all('SELECT * FROM tarefas ORDER BY feito DESC', (erro, tarefas) => {
    if (erro) {
      console.error(erro)
      res.status(500).json({ mensagem: 'Ocorreu um erro interno' });
    } else {
      res.json(tarefas)
    }
  })
})

roteador.get('/tarefas/:id', (req, res) => {
  const { id } = req.params;
  const tarefa = db.get('SELECT * FROM tarefas WHERE id = ?', [id], (erro, tarefa) => {
    if (erro) {
      console.error(erro)
      res.status(500).json({ mensagem: 'Ocorreu um erro interno' })
    } else if (tarefa) {
      res.json(tarefa)
    } else {
      res.status(404).json({ mensagem: 'Tarefa não encontrada' })
    }
  });
})

roteador.post('/tarefas', (req, res) => {
  const { nome } = req.body;
  db.run('INSERT INTO tarefas (nome, feito) VALUES (?, ?)', [nome, 0], (erro) => {
    if (erro) {
      console.error(erro)
      res.status(500).json({ mensagem: 'Ocorreu um erro interno' })
    } else {
      res.status(201).json({ id: this.lastID })
    }
  })
})

roteador.put('/tarefas/:id', (req, res) => {
  const { id } = req.params;
  const { nome, feito } = req.body;
  db.run('UPDATE tarefas SET nome = ?, feito = ? WHERE id = ?', [nome, feito, id], (erro) => {
    if (erro) {
      console.error(erro)
      res.status(500).json({ mensagem: 'Ocorreu um erro interno' })
    } else {
      res.sendStatus(204)
    }
  })
})

roteador.delete('/tarefas/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tarefas WHERE id = ?', [id], (erro) => {
    if (erro) {
      console.error(erro)
      res.status(500).json({ mensagem: 'Ocorreu um erro interno' })
    } else {
      res.sendStatus(204);
    }
  });
});

app.listen(3002, () => {
  console.log('Servidor iniciado na porta 3002')
})