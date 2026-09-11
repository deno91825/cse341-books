import express from 'express';
import booksRouter from './src/routes/books.js';

const app = express();

app.use(express.json());

app.use('/books', booksRouter);

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Server is running'
  });
});

export default app;