import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

import { AppError } from '@errors/AppError';
import { UserRepository } from '@modules/users/repositories/implementations/UserRepository';

interface IJwt {
  subject: string;
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
    const { subject } = jwtDecode(token) as IJwt;
    const userRepository = new UserRepository();
    const user = await userRepository.findById(subject);

    if (!user)
      throw new AppError({ message: 'Usuario não achado', statusCode: 401 });

    verify(token, '1234');

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
