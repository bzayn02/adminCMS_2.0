import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
import morgan from 'morgan';
import cors from 'cors';
import { mongoConnect } from './src/config/mongoConfig.js';
mongoConnect();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const __dirname = path.resolve();
// converting public folder to static serving folder
app.use(express.static(path.join(__dirname + '/public')));

// APIS
import { auth } from './src/middlewares/authMiddleware.js';
import adminRouter from './src/routers/adminRouter.js';
app.use('/api/v1/admin', adminRouter);
import categoryRouter from './src/routers/categoryRouter.js';
app.use('/api/v1/category', auth, categoryRouter);
import paymentRouter from './src/routers/paymentOptionRouter.js';
app.use('/api/v1/payment-options', auth, paymentRouter);
import productRouter from './src/routers/productRouter.js';
app.use('/api/v1/products', auth, productRouter);

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is live.',
  });
});

app.use((error, req, res, next) => {
  console.log(error);
  const code = error.statusCode || 500;
  res.status(code).json({
    status: 'error',
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server is running at http://localhost:${PORT}`);
});
