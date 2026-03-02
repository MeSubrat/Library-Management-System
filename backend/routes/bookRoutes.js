import express from 'express';
import { getBooks, getBookById, createBook, updateBook, deleteBook, borrowBook, returnBook } from '../controllers/bookController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getBooks).post(protect, admin, createBook);
router.route('/:id').get(getBookById).put(protect, admin, updateBook).delete(protect, admin, deleteBook);
router.route('/:id/borrow').post(protect, borrowBook);
router.route('/:id/return').post(protect, returnBook);

export default router;