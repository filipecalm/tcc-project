import express, { ErrorRequestHandler, Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './database/db';

dotenv.config();

const app: Express = express();

let corsOrigin: string;
if (process.env.NODE_ENV === 'dev') {
  corsOrigin = `http://${process.env.HOST}:${process.env.CLIENT_PORT}`;
} else if (process.env.NODE_ENV === 'prod') {
  corsOrigin = process.env.REACT_APP_CLIENT_URL || '*';
} else {
  throw new Error('O ambiente não está definido corretamente');
}

app.use(cors({
  origin: '*',
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS", 
  allowedHeaders: '*',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Ajuste a política de referência como uma configuração separada, pois não é parte do CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Referrer-Policy', 'no-referrer'); // Definir política de referência
  next();
});

// Increase upload limit to 50mb
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

import handleError from './helpers/handleError';

// Public Images
app.use(express.static('public'));

// routes
import ProductRoutes from './routes/ProductRoutes';
import UserRoutes from './routes/UserRoutes';
import CategoryRoutes from './routes/CategoryRoutes';
import CartRoutes from './routes/CartRoutes';

app.use('/product', ProductRoutes);
app.use('/user', UserRoutes);
app.use('/category', CategoryRoutes);
app.use('/cart', CartRoutes);

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  handleError(err, req, res, next);
});

// Definição da rota raiz
app.get('/', (req: Request, res: Response) => {
  res.json('Bem-vindo à minha API!');
});

connectToDatabase().then(() => {
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT}`);
  });
});