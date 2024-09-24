import { Request, Response, NextFunction } from 'express';
import SensorData from '../models/models-mongoose/sensor-data-historial';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

// Función auxiliar para calcular el rango de tiempo
const calcularRangoDeTiempo = (lapso: string): Date => {
  const ahora = new Date();
  switch (lapso) {
    case 'hora':
      return new Date(ahora.getTime() - 60 * 60 * 1000); // Última hora
    case 'dia':
      return new Date(ahora.getTime() - 24 * 60 * 60 * 1000); // Último día
    case 'semana':
      return new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000); // Última semana
    case 'mes':
      return new Date(ahora.setMonth(ahora.getMonth() - 1)); // Último mes
    case 'dos-meses':
      return new Date(ahora.setMonth(ahora.getMonth() - 2)); // Últimos dos meses
    default:
      throw new Error('Rango de tiempo no válido');
  }
};

// Controlador para obtener métricas
export const obtenerMetricas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar las validaciones del request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { estacionId, lapso } = req.params;

    // Verificar si el ID de la estación es válido
    if (!mongoose.Types.ObjectId.isValid(estacionId)) {
      return res.status(400).json({ message: 'El ID de la estación no es válido' });
    }

    const fechaInicio = calcularRangoDeTiempo(lapso);

    // Verificar que la estación exista
    const estacionObjectId = new mongoose.Types.ObjectId(estacionId);

    const metrics = await SensorData.aggregate([
      { $match: { estacion: estacionObjectId, timestamp: { $gte: fechaInicio } } },
      {
        $group: {
          _id: null,
          promedioTemp: { $avg: '$temp' },
          promedioO3: { $avg: '$o3' },
          promedioNo: { $avg: '$no' },
          promedioNo2: { $avg: '$no2' },
          promedioNox: { $avg: '$nox' },
          promedioSo2: { $avg: '$so2' },
          promedioCo: { $avg: '$co' },
          promedioPresion: { $avg: '$presion' },
          promedioTempAmbiente: { $avg: '$temp_ambiente' },
          promedioHumedad: { $avg: '$humedad_rel' },
          promedioDirViento: { $avg: '$dir_viento' },
          promedioRadSol: { $avg: '$rad_sol' },
          promedioPm10: { $avg: '$pm10' },
          promedioPm2_5: { $avg: '$pm2_5' },
          promedioCot: { $avg: '$cot' },
          promedioCo2: { $avg: '$co2' },
          promedioO3_2: { $avg: '$o3_2' },
        },
      },
    ]);

    // Si no hay datos
    if (!metrics || metrics.length === 0) {
      return res.status(404).json({ message: 'No se encontraron datos para el rango especificado' });
    }

    res.json({
      ok: true,
      metrics: metrics[0], // Solo devolvemos el primer (y único) grupo de métricas
    });
  } catch (error) {
    next(error);
  }
};
