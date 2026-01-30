const { Book } = require('../models');


exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBook = async (req, res) => {
    try {
        const { title, author, initialStock } = req.body;
        // Set stock same as initialStock for new books
        const book = await Book.create({ title, author, initialStock, stock: initialStock });
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { title, author, initialStock, stock } = req.body;
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // Validate stock cannot be negative
        if (stock < 0) return res.status(400).json({ message: 'Stock cannot be negative' });

        await book.update({ title, author, initialStock, stock });
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        await book.destroy();
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
