import { Request, Response, NextFunction } from 'express';
import Municipio from '../models/models-mongoose/municipio';

// Crear un nuevo municipio
export const crearMunicipio = async (req: Request, res: Response, next: NextFunction) => {
  try { 
    const { nombre, coordenadas } = req.body;
    const nuevoMunicipio = new Municipio({ nombre, coordenadas });
    await nuevoMunicipio.save();
    res.status(201).json(nuevoMunicipio);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los municipios
export const obtenerMunicipios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const municipios = await Municipio.find();
    res.json(municipios);
  } catch (error) {
    next(error);
  }
};

// Obtener un municipio por ID
export const obtenerMunicipioPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const municipio = await Municipio.findById(id);
    if (!municipio) {
      return res.status(404).json({ message: 'Municipio no encontrado' });
    }
    res.json(municipio);
  } catch (error) {
    next(error);
  }
};
