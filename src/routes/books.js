import express from 'express';
import { getDb } from '../db/connect.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await getDb()
      .collection('books')
      .find({})
      .toArray();

    return res.status(200).json(books);
  } catch (error) {
    console.error('Failed to retrieve books:', error.message);

    return res.status(500).json({
      message: 'Failed to retrieve books'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await getDb()
      .collection('books')
      .findOne({ id: req.params.id });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('Failed to retrieve book:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

export default router;