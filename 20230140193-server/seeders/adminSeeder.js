const { User } = require('../models');

const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ where: { role: 'admin' } });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Default admin created (username: admin, password: admin123)');
        } else {
            console.log('Admin already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

module.exports = seedAdmin;
