import express, { ErrorRequestHandler, Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

app.use(
  cors({ origin: `http://${process.env.HOST}:${process.env.CLIENT_PORT}` })
);

// Increase upload limit to 50mb
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Importando a conexão com o banco de dados
import conn from './src/database/db';
import handleError from './src/helpers/handleError';

// Public Images
app.use(express.static('public'));

// routes
import ProductRoutes from './src/routes/ProductRoutes';
import UserRoutes from './src/routes/UserRoutes';
import CategoryRoutes from './src/routes/CategoryRoutes';
import CartRoutes from './src/routes/CartRoutes';

app.use(express.json());

app.use('/product', ProductRoutes);
app.use('/user', UserRoutes);
app.use('/category', CategoryRoutes);
app.use('/cart', CartRoutes);

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  handleError(err, req, res, next);
});

const serverPort: number | string = process.env.SERVER_PORT || 3000;
app.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`);
});
