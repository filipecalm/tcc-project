import getToken from '../helpers/get-token'
import decodedToken from '../helpers/token-decoded'
import MESSAGE from '../constants/messages';
import { Request, Response, NextFunction } from 'express';

interface IUser {
  id: string;
}


const checkToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED)
  }

  const token = getToken(req)

  if (!token) {
    return res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED)
  }

  try {
    const verify = decodedToken(token)
    req.body.user = verify

    next()
  } catch (err) {
    return res.status(400).json(MESSAGE.ERROR.ACCESS_DENIED)
  }
}

export default checkToken
