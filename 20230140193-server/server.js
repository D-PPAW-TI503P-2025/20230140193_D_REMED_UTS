const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const authRoutes = require('./routes/authRoutes');
const seedAdmin = require('./seeders/adminSeeder');
const seedBooks = require('./seeders/bookSeeder');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Auth routes (register)
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Library System API with Geolocation' });
});

// Database Sync & Start Server
sequelize.sync({ force: false })
  .then(async () => {
    console.log('Database synced successfully.');
    await seedAdmin(); // Run seeder after sync
    await seedBooks();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
