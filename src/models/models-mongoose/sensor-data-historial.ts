import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para el historial de datos de sensor
export interface SensorDataHistorial extends Document {
  estacion: string;  // ID de la estación
  temp: number;
  o3: number;
  no: number;
  no2: number;
  nox: number;
  so2: number;
  co: number;
  presion: number;
  temp_ambiente: number;
  humedad_rel: number;
  dir_viento: number;
  rad_sol: number;
  pm10: number;
  pm2_5: number;
  cot: number;
  co2: number;
  o3_2: number;
  timestamp: Date;
}

// Esquema del historial
const SensorDataHistorialSchema: Schema = new Schema({
  estacion: { type: String, required: true },
  temp: { type: Number, required: true },
  o3: { type: Number, required: true },
  no: { type: Number, required: true },
  no2: { type: Number, required: true },
  nox: { type: Number, required: true },
  so2: { type: Number, required: true },
  co: { type: Number, required: true },
  presion: { type: Number, required: true },
  temp_ambiente: { type: Number, required: true },
  humedad_rel: { type: Number, required: true },
  dir_viento: { type: Number, required: true },
  rad_sol: { type: Number, required: true },
  pm10: { type: Number, required: true },
  pm2_5: { type: Number, required: true },
  cot: { type: Number, required: true },
  co2: { type: Number, required: true },
  o3_2: { type: Number, required: true },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: '60d'  // TTL: se eliminarán automáticamente después de 60 días
  }
});

// Crear el modelo de historial
const SensorDataHistorial = mongoose.model<SensorDataHistorial>('SensorDataHistorial', SensorDataHistorialSchema);

export default SensorDataHistorial;
