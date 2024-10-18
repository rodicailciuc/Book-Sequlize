import express from 'express';

import bookControllers from '../controllers/book.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

const {
    getAllBooks,
    getBookById,
    getCreateForm,
    createBook,
    updateBook,
    removeBook,
    getBookByUser
} = bookControllers;

// routes
router.get('/books', getAllBooks);
router.get('/book/:id', getBookById);
router.get('/add-book', getCreateForm);
router.post('/add-book', createBook);
router.put('/update-book/:id', updateBook);
router.delete('/delete/:id', removeBook);
router.get('/book-user/:id', getBookByUser);

export default router;
