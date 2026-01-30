const { Book, BorrowLog, User } = require('../models');
const sequelize = require('../config/database');

exports.borrowBook = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { bookId, latitude, longitude } = req.body;
        const userId = req.headers['x-user-id'];
        const userRole = req.headers['x-user-role'];

        if (userRole === 'admin') {
            return res.status(403).json({ message: 'Admin tidak diperbolehkan meminjam buku' });
        }

        const book = await Book.findByPk(bookId);
        if (!book) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.stock <= 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Book out of stock' });
        }

        // Kurangi stok
        await book.update({ stock: book.stock - 1 }, { transaction });

        // Catat peminjaman
        const log = await BorrowLog.create({
            userId,
            bookId,
            latitude,
            longitude,
            borrowDate: new Date()
        }, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Book borrowed successfully', log });
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({ message: error.message });
    }
};

exports.getAllBorrowLogs = async (req, res) => {
    try {
        const logs = await BorrowLog.findAll({
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Book, attributes: ['id', 'title', 'author'] }
            ],
            order: [['borrowDate', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserBorrowLogs = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        console.log('Fetching logs for userId:', userId);
        const logs = await BorrowLog.findAll({
            where: { userId },
            include: [
                { model: Book, attributes: ['id', 'title', 'author'] }
            ],
            order: [['borrowDate', 'DESC']]
        });
        console.log(`Found ${logs.length} logs for userId: ${userId}`);
        res.json(logs);
    } catch (error) {
        console.error('Error in getUserBorrowLogs:', error);
        res.status(500).json({ message: error.message });
    }
};

