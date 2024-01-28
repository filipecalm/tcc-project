import { Router } from 'express';
import UserController from '../controllers/UserController';

// middlewares
import verifyToken from '../middlewares/verify-token';
import verifyAdmin from '../middlewares/verify-admin';
import AuthUserValidation from '../validations/User/create';
import AuthLoginValidation from '../validations/auth/login';

const routes = Router();

routes.get('/', verifyToken, verifyAdmin, UserController.getAll);
routes.get('/:id', verifyToken, verifyAdmin, UserController.getOne);
routes.post('/', AuthUserValidation, UserController.register);
routes.patch('/:id', verifyToken, UserController.updatedUser);
routes.post(
  '/registerAdmin',
  verifyToken,
  verifyAdmin,
  AuthUserValidation,
  UserController.registerAdmin
);
routes.delete('/:id', verifyToken, UserController.deleteUser);
routes.get('/check', UserController.checkUser);
routes.post('/login', AuthLoginValidation, UserController.login);

export default routes;
