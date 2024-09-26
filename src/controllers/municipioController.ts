import { Request, Response, NextFunction } from 'express';
import Municipio from '../models/models-mongoose/municipio';
import estacion from '../models/models-mongoose/estacion';
import sensorData from '../models/models-mongoose/sensor-data';

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

export const getAverageSensorData = async (req:Request, res:Response) => {
  try {
    const municipioId = req.params.municipioId;

    // Obtener todas las estaciones del municipio
    const estaciones = await estacion.find({ municipio: municipioId }).exec();

    if (!estaciones || estaciones.length === 0) {
      return res.status(404).json({ message: 'No se encontraron estaciones en este municipio' });
    }

    const estacionIds = estaciones.map(estacion => estacion._id);

    // Obtener el último SensorData para cada estación
    const latestSensorData = await sensorData.aggregate([
      { $match: { estacion: { $in: estacionIds } } },
      { $sort: { estacion: 1, timestamp: -1 } },
      {
        $group: {
          _id: '$estacion',
          latestData: { $first: '$$ROOT' }
        }
      }
    ]);

    if (!latestSensorData || latestSensorData.length === 0) {
      return res.status(404).json({ message: 'No se encontraron datos de sensores para las estaciones en este municipio' });
    }

    // Calcular los promedios
    const fieldsToAverage = ['temp', 'o3', 'no', 'no2', 'nox', 'so2', 'co', 'presion', 'temp_ambiente', 'humedad_rel', 'dir_viento', 'rad_sol', 'pm10', 'pm2_5', 'cot', 'co2', 'o3_2'];
    const sumData = {};
    let count = latestSensorData.length;

    fieldsToAverage.forEach(field => sumData[field] = 0);

    latestSensorData.forEach(entry => {
      const data = entry.latestData;
      fieldsToAverage.forEach(field => {
        if (data[field] != null) {
          sumData[field] += data[field];
        }
      });
    });

    const avgData = {};
    fieldsToAverage.forEach(field => {
      avgData[field] = sumData[field] / count;
    });

    res.json({
      municipioId,
      avgData,
      count
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};