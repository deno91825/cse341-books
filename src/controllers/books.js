import {
  getAllBooks as getAllBooksFromDb,
  getBookById as getBookByIdFromDb,
  createBook as createBookFromDb,
  updateBook as updateBookFromDb,
  deleteBook as deleteBookFromDb,
  authorExists,
} from '../models/books.js';

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooksFromDb();

    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);

    return res.status(500).json({
      message: 'Unable to retrieve books.'
    });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await getBookByIdFromDb(id);

    if (!book) {
      return res.status(404).json({
        message: 'Book not found.'
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);

    return res.status(500).json({
      message: 'Unable to retrieve book.'
    });
  }
};

const createBookHandler = async (req, res) => {
  try {
    const {
      id,
      authorId,
      title,
      publicationDate
    } = req.body;

    if (!id || !authorId || !title || !publicationDate) {
      return res.status(400).json({
        message: 'Missing required book fields.'
      });
    }

    const existingBook = await getBookByIdFromDb(id);

    if (existingBook) {
      return res.status(400).json({
        message: 'Book id already exists.'
      });
    }

    const validAuthor = await authorExists(authorId);

    if (!validAuthor) {
      return res.status(400).json({
        message: 'Author does not exist.'
      });
    }

    const newBook = {
      id,
      authorId,
      title,
      publicationDate
    };

    const createdBook = await createBookFromDb(newBook);

    return res.status(201).json(createdBook);
  } catch (error) {
    console.error('POST /books failed:', error.message);

    return res.status(500).json({
      message: 'Unable to create book.'
    });
  }
};

const updateBookHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      authorId,
      title,
      publicationDate
    } = req.body;

    if (!authorId || !title || !publicationDate) {
      return res.status(400).json({
        message: 'Missing required book fields.'
      });
    }

    const existingBook = await getBookByIdFromDb(id);

    if (!existingBook) {
      return res.status(404).json({
        message: 'Book not found.'
      });
    }

    const validAuthor = await authorExists(authorId);

    if (!validAuthor) {
      return res.status(400).json({
        message: 'Author does not exist.'
      });
    }

    const updatedBook = await updateBookFromDb(id, {
      authorId,
      title,
      publicationDate
    });

    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error('PUT /books/:id failed:', error.message);

    return res.status(500).json({
      message: 'Unable to update book.'
    });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBook = await getBookByIdFromDb(id);

    if (!existingBook) {
      return res.status(404).json({
        message: 'Book not found.'
      });
    }

    await deleteBookFromDb(id);

    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error.message);

    return res.status(500).json({
      message: 'Unable to delete book.'
    });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
};