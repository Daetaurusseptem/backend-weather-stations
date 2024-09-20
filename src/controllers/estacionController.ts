import { Request, Response, NextFunction } from 'express';
import server from '../models/server';
import Estacion from '../models/models-mongoose/estacion';
import Municipio from '../models/models-mongoose/municipio';


// Crear una nueva estación
export const crearEstacion = async (req: Request, res: Response) => {
  const { nombre, ubicacion, municipioId } = req.body;

  try {
    const nuevaEstacion = new Estacion({
      nombre,
      ubicacion,
      municipio: municipioId,
      asignada: false, // La estación comienza como no asignada
    });

    await nuevaEstacion.save();
    server.emit('nuevaEstacion', nuevaEstacion);

    return res.status(201).json(nuevaEstacion);
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear la estación', error });
  }
};

export const obtenerEstacionesPorMunicipio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { municipioId } = req.params;
    const estaciones = await Estacion.find({ municipio: municipioId }).populate('municipio');
    res.json(estaciones);
  } catch (error) {
    next(error);
  } 
};
// Obtener todas las estaciones con paginación
export const obtenerEstaciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const estaciones = await Estacion.find()
      .skip((page - 1) * limit) // Saltar elementos según la página
      .limit(limit); // Limitar el número de resultados

    const totalEstaciones = await Estacion.countDocuments();

    res.json({
      estaciones,
      totalEstaciones,
      totalPages: Math.ceil(totalEstaciones / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};
// Obtener una estación por su ID
export const obtenerEstacionPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const estacion = await Estacion.findById(id);
    
    if (!estacion) {
      return res.status(404).json({ message: 'Estación no encontrada' });
    }
    
    res.json(estacion);
  } catch (error) {
    next(error);
  }
};
// Obtener una estación sin flag asignar = true
export const obtenerEstacionesDisponibles = async (req: Request, res: Response) => {
  try {
    const estacionesDisponibles = await Estacion.find({ asignada: false });
    return res.status(200).json(estacionesDisponibles);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener las estaciones disponibles', error });
  }
};

// Actualizar una estación por su ID
export const actualizarEstacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const estacionActualizada = await Estacion.findByIdAndUpdate(id, req.body, { new: true });

    if (!estacionActualizada) {
      return res.status(404).json({ message: 'Estación no encontrada' });
    }
    server.emit('actualizacionEstacion', estacionActualizada);

    res.json(estacionActualizada);
  } catch (error) {
    next(error);
  }
};

// Eliminar una estación por su ID
export const eliminarEstacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const estacionEliminada = await Estacion.findByIdAndDelete(id);

    if (!estacionEliminada) {
      return res.status(404).json({ message: 'Estación no encontrada' });
    }

    res.json({ message: 'Estación eliminada con éxito' });
  } catch (error) {
    next(error);
  }
};
export const asignarEstacion = async (req: Request, res: Response) => {
  const { estacion_id } = req.body;

  try {
    const estacion = await Estacion.findById(estacion_id);
    if (!estacion) {
      return res.status(404).json({ message: 'Estación no encontrada' });
    }

    // Verificar si la estación ya está asignada
    if (estacion.asignada) {
      return res.status(400).json({ message: 'Estación ya asignada' });
    }

    // Marcar la estación como asignada
    estacion.asignada = true;
    await estacion.save();

    return res.status(200).json({ message: 'Estación asignada correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al asignar la estación', error });
  }
};
