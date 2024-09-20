import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  nombre: string;
  email: string;
  iat: number;
  exp: number;
}

export const autenticarJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secreto') as JwtPayload;
    req.user = { id: payload.id, nombre: payload.nombre, email: payload.email };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};


