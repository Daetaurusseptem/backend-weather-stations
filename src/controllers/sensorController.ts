import { Request, Response, NextFunction } from 'express';
import SensorData from '../models/models-mongoose/sensor-data';
import Estacion from '../models/models-mongoose/estacion';
import server from '../models/server'; // Importar la instancia de servidor
import sensorData from '../models/models-mongoose/sensor-data';
import SensorDataHistorial from '../models/models-mongoose/sensor-data-historial';

// Crear datos de sensores para una estación
export const crearDatosSensor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const { id } = req.params;
    const estacion = await Estacion.findById(id);

    if (!estacion) {
      return res.status(404).json({ message: 'Estación no encontrada' });
    }

    const datosSensor = new SensorData({
      estacion: id,
      ...req.body
    });

    const historialData =new SensorDataHistorial({
      estacion: id,
      ...req.body
    });
    await historialData.save();
    await datosSensor.save();

    server.emit('sensor-data-updated', datosSensor); // Emitir evento

    res.status(201).json(datosSensor.populate('estacion'));
  } catch (error) {
    next(error);
  }
};

// Obtener todos los datos de sensores para una estación
export const obtenerDatosSensores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { desde, hasta } = req.query;

    const query: any = { estacion: id };
    if (desde || hasta) {
      query.timestamp = {};
      if (desde) query.timestamp.$gte = new Date(desde as string);
      if (hasta) query.timestamp.$lte = new Date(hasta as string);
    }

    const datos = await sensorData.find(query).sort({ timestamp: -1 }).populate('estacion')
    res.json(datos);
  } catch (error) {
    next(error);
  }
};

// Obtener un dato de sensor específico por su ID
export const obtenerDatoSensorPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idSensor } = req.params;
    const datoSensor = await SensorData.findById(idSensor);

    if (!datoSensor) {
      return res.status(404).json({ message: 'Dato de sensor no encontrado' });
    }
    
    res.json({ok:true,sensor:datoSensor});
  } catch (error) {
    next(error);
  }
};
export const obtenerDatoSensorPorEstacionId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { estacionId } = req.params;
    // Buscar el único dato de sensor asociado con la estación, y poblamos la estación
    const datoSensor = await SensorData.findOne({ estacion: estacionId }).populate('estacion');
    console.log('dato '+datoSensor);

    if (!datoSensor) {
      return res.status(404).json({ message: 'Dato de sensor no encontrado' });
    }

    
    res.json({ ok: true, sensor: datoSensor });
  } catch (error) {
    next(error);
  }
};


// Actualizar un dato de sensor por su ID
export const actualizarDatoSensor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idSensor } = req.params;
    const datoSensorActualizado = await SensorData.findByIdAndUpdate(idSensor, req.body, { new: true });
    server.emit('sensor-data-updated', datoSensorActualizado);

    if (!datoSensorActualizado) {
      return res.status(404).json({ message: 'Dato de sensor no encontrado' });
    }

    res.json(datoSensorActualizado);
  } catch (error) {
    next(error);
  }
};

// Eliminar un dato de sensor por su ID
export const eliminarDatoSensor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idSensor } = req.params;
    const datoSensorEliminado = await SensorData.findByIdAndDelete(idSensor);
    
    if (!datoSensorEliminado) {
      return res.status(404).json({ message: 'Dato de sensor no encontrado' });
    }
    server.emit('sensor-data-updated', idSensor);
    res.json({ message: 'Dato de sensor eliminado con éxito' });
  } catch (error) {
    next(error);
  }
};
