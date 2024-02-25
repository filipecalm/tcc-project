import { Router } from 'express';
import UserController from '../controllers/UserController';

// middlewares
import verifyToken from '../middlewares/verify-token';
import verifyAdmin from '../middlewares/verify-admin';
import AuthUserValidation from '../validations/User/create';
import AuthLoginValidation from '../validations/auth/login';

const routes = Router();

routes.get('/me/:id', verifyToken, UserController.getMe);
routes.get('/', verifyToken, verifyAdmin, UserController.getAll);
routes.get('/:id', verifyToken, UserController.getOne);
routes.post('/', UserController.register);
routes.put('/:id', verifyToken, UserController.updatedUser);
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
