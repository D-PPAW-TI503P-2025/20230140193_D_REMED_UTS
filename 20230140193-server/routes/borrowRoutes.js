const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const authMiddleware = require('../middleware/authMiddleware');

// User route for borrowing
router.post('/', authMiddleware('user'), borrowController.borrowBook);
router.get('/my', authMiddleware('user'), borrowController.getUserBorrowLogs);

// Admin route to see logs
router.get('/', authMiddleware('admin'), borrowController.getAllBorrowLogs);

module.exports = router;
