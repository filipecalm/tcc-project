import 'dotenv/config';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  id: string;
}

const decodedToken = (token: string): DecodedToken => {
  const result = jwt.verify(token, process.env.JWT_TOKEN_SECRET as string);
  return result as DecodedToken;
};

export default decodedToken;
