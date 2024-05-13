// Importar as dependências
const express = require('express');
const mongoose = require('mongoose');

// Configurar o aplicativo Express
const app = express();
app.use(express.json());

// Conectar ao banco de dados MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mean', { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS:999999});
const db = mongoose.connection;

// Definir o esquema do livro
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    year: Number
});

// Criar o modelo do livro
const Book = mongoose.model('Book', bookSchema);

// Rotas da API

// Rota para criar um novo livro
app.post('/books', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).send(book);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Rota para listar todos os livros
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.send(books);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Rota para obter um livro por ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send({ message: 'Livro não encontrado' });
        }
        res.send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Rota para atualizar um livro por ID
app.patch('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) {
            return res.status(404).send({ message: 'Livro não encontrado' });
        }
        res.send(book);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Rota para excluir um livro por ID
app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).send({ message: 'Livro não encontrado' });
        }
        res.send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Iniciar o servidor
const port = 3001;

app.listen(port,() => {
    console.log(`Servidor rodando na porta ${port}`);
});
