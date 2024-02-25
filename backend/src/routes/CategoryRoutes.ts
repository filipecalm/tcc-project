import { Router } from 'express';
import CategoryController from '../controllers/CategoryController';

// middlewares
import verifyToken from '../middlewares/verify-token';
import verifyAdmin from '../middlewares/verify-admin';

const routes = Router();

routes.post('/', verifyToken, verifyAdmin, CategoryController.createCategory);
routes.get('/', CategoryController.listCategories);
routes.get('/:id', verifyToken, verifyAdmin, CategoryController.getOne);
routes.put('/:id', verifyToken, verifyAdmin, CategoryController.updateCategory);
routes.delete('/:id', verifyToken, verifyAdmin, CategoryController.deleteCategory);

export default routes;
