const { Book } = require('../models');

const seedBooks = async () => {
    try {
        const booksCount = await Book.count();
        if (booksCount === 0) {
            const sampleBooks = [
                { title: 'Laskar Pelangi', author: 'Andrea Hirata', initialStock: 10, stock: 10 },
                { title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', initialStock: 5, stock: 5 },
                { title: 'Filosofi Teras', author: 'Henry Manampiring', initialStock: 8, stock: 8 },
                { title: 'Home Deus', author: 'Yuval Noah Harari', initialStock: 12, stock: 12 },
                { title: 'The Psychology of Money', author: 'Morgan Housel', initialStock: 15, stock: 15 }
            ];

            await Book.bulkCreate(sampleBooks);
            console.log('Sample books seeded successfully.');
        } else {
            console.log('Books already exist, skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding books:', error);
    }
};

module.exports = seedBooks;
