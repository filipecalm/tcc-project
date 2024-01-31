import express, { ErrorRequestHandler, Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './database/db';

dotenv.config();

const app: Express = express();

app.use(
  cors({ origin: `http://${process.env.HOST}:${process.env.CLIENT_PORT}` })
);

// Increase upload limit to 50mb
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Importando a conexão com o banco de dados
import conn from './database/db';
import handleError from './helpers/handleError';

// Public Images
app.use(express.static('public'));

// routes
import ProductRoutes from './routes/ProductRoutes';
import UserRoutes from './routes/UserRoutes';
import CategoryRoutes from './routes/CategoryRoutes';
import CartRoutes from './routes/CartRoutes';

app.use(express.json());

app.use('/product', ProductRoutes);
app.use('/user', UserRoutes);
app.use('/category', CategoryRoutes);
app.use('/cart', CartRoutes);

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  handleError(err, req, res, next);
});

connectToDatabase().then(() => {
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT}`);
  });
});