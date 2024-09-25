import { Request, Response, NextFunction } from 'express';
import Municipio from '../models/models-mongoose/municipio';

// Crear un nuevo municipio
export const crearMunicipio = async (req: Request, res: Response, next: NextFunction) => {
  try { 
    const { nombre, coordenadas } = req.body;
    console.log(nombre, coordenadas);
    const nuevoMunicipio = new Municipio({ nombre, coordenadas });
    await nuevoMunicipio.save();
    return res.status(201).json(nuevoMunicipio);
  } catch (error:any) {
    
    return res.status(201).json({ok:false, error:error.message});
    
  }
};

// Obtener todos los municipios
export const obtenerMunicipios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const municipios = await Municipio.find();
    res.json({ok:true, municipios});
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
    res.status(201).json({ok:true,municipio});
  } catch (error) {
    next(error);
  }
};

export const obtenerMunicipiosFiltrados = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { termino = '', pagina = 1 } = req.query;
    const limite = 20;
    const skip = (Number(pagina) - 1) * limite;

    const query = termino ? { nombre: { $regex: termino, $options: 'i' } } : {};

    const totalMunicipios = await Municipio.countDocuments(query);
    const municipios = await Municipio.find(query).skip(skip).limit(limite);

    res.json({
      ok: true,
      pagina: Number(pagina),
      totalPaginas: Math.ceil(totalMunicipios / limite),
      totalMunicipios,
      municipios
    });
  } catch (error) {
    next(error);
  }
};
export const actualizarMunicipio = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { nombre, coordenadas } = req.body;

  try {
    // Buscar y actualizar el municipio
    const municipio = await Municipio.findByIdAndUpdate(
      id,
      { nombre, coordenadas },
      { new: true, runValidators: true }  // new: true devuelve el documento actualizado
    );

    // Si no se encuentra el municipio
    if (!municipio) {
      return res.status(404).json({
        ok: false,
        message: 'Municipio no encontrado'
      });
    }

    res.status(200).json({
      ok: true,
      municipio
    });
  } catch (error) {
    next(error);
  }
};