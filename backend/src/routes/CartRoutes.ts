import { Router } from 'express';
import CartController from '../controllers/CartController';

// middlewares
import verifyToken from '../middlewares/verify-token';

const routes = Router();

routes.get('/', CartController.lists);
routes.get('/:id', CartController.listById);
routes.get('/user/:id', CartController.listByUserId);
routes.post('/', verifyToken, CartController.createCard);
routes.delete('/:id', verifyToken, CartController.deleteCard);

export default routes;
