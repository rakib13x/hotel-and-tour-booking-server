import jwt from 'jsonwebtoken';
import env from '../config/env';

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, env.jwtSecret, {
    expiresIn: '7d',
  });
};

export default generateToken;
