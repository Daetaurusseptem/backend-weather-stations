import { Request, Response, NextFunction } from 'express';
import Usuario from '../models/models-mongoose/usuario';

// Obtener todos los usuarios
export const obtenerUsuarios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json({ok:true,usuarios});
  } catch (error) {
    next(error);
  }
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const { id } = req.params;
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    return res.status(201).json({ok:true,usuario});
  } catch (error) {
    next(error);
  }
};
  
// Crear un nuevo usuario
export const crearUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, role } = req.body;
    const nuevoUsuario = new Usuario({ name, email, role });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el usuario', error });
  }
};

// Actualizar un usuario por ID
export const actualizarUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    next(error);
  }
};

// Eliminar un usuario por ID
export const eliminarUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    next(error);
  }
};
export const obtenerUsuariosFiltrados = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { termino = '', pagina = 1 } = req.query;
      const limite = 20;
      const skip = (Number(pagina) - 1) * limite;
  
      const query = termino ? { nombre: { $regex: termino, $options: 'i' } } : {};
  
      const totalUsuarios = await Usuario.countDocuments(query);
      const usuarios = await Usuario.find(query).skip(skip).limit(limite);
  
      res.json({
        ok: true,
        pagina: Number(pagina),
        totalPaginas: Math.ceil(totalUsuarios / limite),
        totalUsuarios,
        usuarios
      });
    } catch (error) { 
      next(error);
    }
  };
