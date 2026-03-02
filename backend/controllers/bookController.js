import Book from '../models/Book.js';

// @desc    Fetch all books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
    const { title, author, genre, year, description, coverImage } = req.body;

    const book = new Book({
        title,
        author,
        genre,
        year,
        description,
        coverImage: coverImage || `https://picsum.photos/seed/${title}/400/600`
    });

    try {
        const createdBook = await book.save();
        res.status(201).json(createdBook);
    } catch (error) {
        res.status(400).json({ message: 'Invalid book data' });
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
    const { title, author, genre, year, description, coverImage, isAvailable } = req.body;

    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            book.title = title || book.title;
            book.author = author || book.author;
            book.genre = genre || book.genre;
            book.year = year || book.year;
            book.description = description || book.description;
            book.coverImage = coverImage || book.coverImage;
            book.isAvailable = isAvailable !== undefined ? isAvailable : book.isAvailable;

            const updatedBook = await book.save();
            res.json(updatedBook);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid book data' });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            await book.deleteOne();
            res.json({ message: 'Book removed' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Borrow a book
// @route   POST /api/books/:id/borrow
// @access  Private
const borrowBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const user = await import('../models/User.js').then(m => m.default).then(User => User.findById(req.user._id));

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (!book.isAvailable) {
            return res.status(400).json({ message: 'Book is currently not available' });
        }

        // Update book status
        book.isAvailable = false;
        book.borrowedBy = user._id;
        await book.save();

        // Update user's borrowed books list
        user.borrowedBooks.push(book._id);
        await user.save();

        res.json({ message: 'Book borrowed successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Return a book
// @route   POST /api/books/:id/return
// @access  Private
const returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const user = await import('../models/User.js').then(m => m.default).then(User => User.findById(req.user._id));

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Convert ObjectIds to strings for accurate comparison
        if (book.isAvailable || String(book.borrowedBy) !== String(user._id)) {
            return res.status(400).json({ message: 'You cannot return this book' });
        }

        // Update book status
        book.isAvailable = true;
        book.borrowedBy = null;
        await book.save();

        // Remove book from user's borrowed list
        user.borrowedBooks = user.borrowedBooks.filter(
            (borrowedBookId) => String(borrowedBookId) !== String(book._id)
        );
        await user.save();

        res.json({ message: 'Book returned successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getBooks, getBookById, createBook, updateBook, deleteBook, borrowBook, returnBook };