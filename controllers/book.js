import { where } from 'sequelize';
import db from '../models/index.js';

const Book = db.books;

const bookControllers = {
    getAllBooks: async (req, res) => {
        const books = await Book.findAll();
        try {
            res.status(200).render('books', { books });
        } catch (err) {
            res.status(500).send({
                message: 'Error while retrieving books'
            });
        }
    },
    getBookById: async (req, res) => {
        const { id } = req.params;
        try {
            const book = await Book.findOne(where({ id }));
            if (book) {
                res.status(200).render(book);
            } else {
                res.status(404).render('404', {
                    title: 'error',
                    message: `Book with id=${id} not found`
                });
            }
        } catch (err) {
            res.status(500).json({
                message: `Error retrieving book with id ${id}`,
                error: err.message
            });
        }
    },
    getCreateForm: async (req, res) => {
        res.status(200).render('create-book');
    },
    createBook: async (req, res) => {
        const { title, author, price, img } = req.body;
        const userId = req.cookies.userId;
        const book = {
            title: title,
            author: author,
            price: price,
            img: img,
            user_id: userId
        };
        try {
            const newBook = await Book.create(book);
            res.status(302).redirect('/api/books');
        } catch (err) {
            res.status(500).json({
                message: 'some error occurred while creating'
            });
        }
    },
    updateBook: async (req, res) => {
        const { id } = req.params;
        const { title, author, price } = req.body;
        try {
            const updateBook = await Book.update(
                { title, author, price, img },
                { where: { id: id } }
            );

            res.status(200).json({ message: 'Book updated successfully!' });
        } catch (err) {
            res.status(500).json({
                message: 'Server error while updating book'
            });
        }
    },
    removeBook: async (req, res) => {
        const { id } = req.params;
        try {
            const deleteBook = await Book.destroy({ where: { id } });

            res.status(200).json({ message: 'Book deleted successfully!' });
        } catch (err) {
            res.status(500).json({
                message: `Error deleting book with id=${id}`
            });
        }
    },
    getBookByUser: async (req, res) => {
        const { id } = req.params;
        try {
            const books = await Book.findAll({ where: { user_id: id } });
            if (books.length > 0) {
                res.status(200).json({
                    message: 'Books found successfully!',
                    data: books
                });
            } else {
                res.status(404).json({
                    message: `No books found for user with id=${id}`
                });
            }
        } catch (err) {
            res.status(500).json({
                message: `Error retrieving books for user with id=${id}`,
                error: err.message
            });
        }
    }
};

export default bookControllers;
