import 'dotenv/config';
import jwt, { Secret } from 'jsonwebtoken';
import MESSAGE from '../constants/messages';
import { Response } from 'express';
import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  newpassword?: string;
  confirmpassword?: string;
  role: string;
  cpf: string;
  rg: string;
  birth: string;
  phone: string;
  gender: string;
}

const createUserToken = async (user: IUser, res: Response) => {
  const secret = process.env.JWT_TOKEN_SECRET || 'projetotcc';

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    secret,
  );

  res.status(200).json({
    message: MESSAGE.SUCCESS.USER.LOGGED,
    token: token,
    userId: user.id,
    email: user.email,
    role: user.role
  });
}

export default createUserToken;
