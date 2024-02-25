import { Router } from 'express';
import ProductController from '../controllers/ProductController';

// middlewares
import verifyToken from '../middlewares/verify-token';
import verifyAdmin from '../middlewares/verify-admin';
import { imageUpload } from '../helpers/image-upload';
import AuthProductValidation from '../validations/Product/create';

const routes = Router();

routes.get('/category/:categoryId', ProductController.listProductsByCategory);

routes.post(
  '/',
  verifyToken,
  verifyAdmin,
  imageUpload.single('images'),
  AuthProductValidation,
  ProductController.createProduct
);

routes.get('/', ProductController.listProducts);
routes.get('/:id', ProductController.listProduct);

routes.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  imageUpload.single('images'),
  ProductController.updateProduct
);

routes.delete('/:id', verifyToken, verifyAdmin, ProductController.deleteProduct);

export default routes;
