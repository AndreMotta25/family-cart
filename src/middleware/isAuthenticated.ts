import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

import { AppError } from '../errors/AppError';
import { UserRepository } from '../modules/users/repositories/implementations/UserRepository';

interface IJwt {
  subject: string;
  hashToken: string;
}

const isAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { authorization } = request.headers;
  if (!authorization)
    throw new AppError({ message: 'Falta o token', statusCode: 401 });

  const [, token] = authorization.split(' ');

  try {
    const { subject, hashToken } = jwtDecode(token) as IJwt;
    const userRepository = new UserRepository();
    const user = await userRepository.findById(subject);

    if (!user)
      throw new AppError({ message: 'Usuario não achado', statusCode: 401 });

    verify(token, String(process.env.Secret));

    if (user.hash !== hashToken)
      throw new AppError({ message: 'Token Invalido', statusCode: 401 });

    request.user = {
      id: user.id,
    };

    return next();
  } catch (e) {
    console.log(e);
    throw new AppError({ message: 'Token Invalido', statusCode: 401 });
  }
};
export { isAuthenticated };
