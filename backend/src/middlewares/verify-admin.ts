import getToken from '../helpers/get-token';
import decodedToken from '../helpers/token-decoded';
import { User } from '../models';
import { Request, Response, NextFunction } from 'express';

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getToken(req);
    const { id } = decodedToken(token);
    const user = await User.findById(id);

    if (!user) {
      throw new Error(`Usuário não encontrado`);
    }

    if (user.role !== 'admin') {
      throw new Error(`Operação não permitida!`);
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};

export default verifyAdmin;
