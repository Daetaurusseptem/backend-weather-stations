import { Request, Response, NextFunction } from 'express';
import Usuario from '../models/models-mongoose/usuario';
import jwt from 'jsonwebtoken';

// Registrar un nuevo usuario
export const registrarUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body);
    const { nombre, email, password } = req.body;
    const usuarioExistente = await Usuario.findOne({ email });
    
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    
    const nuevoUsuario = new Usuario({ nombre, email, password });
    await nuevoUsuario.save();
    
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    next(error);
  }
};

// Iniciar sesión
export const loginUsuario = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const esValido = await usuario.compararPassword(password);
    if (!esValido) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
      process.env.JWT_SECRET || 'secreto',
      
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};
export const validarToken = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Token no proporcionado o inválido.' });
  }

  return res.status(200).json({
    message: 'Token válido.',
    user: req.user  // Información decodificada desde el middleware autenticarJWT
  });
};
