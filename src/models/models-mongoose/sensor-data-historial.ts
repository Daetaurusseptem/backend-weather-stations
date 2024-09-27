// models/SensorDataHistorial.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IEstacion } from './estacion';
import { cleanInvalidFields } from '../../helpers/sanitizer';

// Interfaz para el historial de datos de sensor
export interface SensorDataHistorial extends Document {
  estacion: IEstacion['_id'];
  temp?: number;
  o3?: number;
  no?: number;
  no2?: number;
  nox?: number;
  so2?: number;
  co?: number;
  presion?: number;
  temp_ambiente?: number;
  humedad_rel?: number;
  dir_viento?: number;
  rad_sol?: number;
  pm10?: number;
  pm2_5?: number;
  cot?: number;
  co2?: number;
  o3_2?: number; 
  timestamp: Date;
}

// Esquema del historial
const SensorDataHistorialSchema: Schema = new Schema({
  estacion: { type: Schema.Types.ObjectId, ref: 'Estacion', required: true },
  temp: { type: Number, required: false },
  o3: { type: Number, required: false },
  no: { type: Number, required: false },
  no2: { type: Number, required: false },
  nox: { type: Number, required: false },
  so2: { type: Number, required: false },
  co: { type: Number, required: false },
  presion: { type: Number, required: false },
  temp_ambiente: { type: Number, required: false },
  humedad_rel: { type: Number, required: false },
  dir_viento: { type: Number, required: false },
  rad_sol: { type: Number, required: false },
  pm10: { type: Number, required: false },
  pm2_5: { type: Number, required: false },
  cot: { type: Number, required: false },
  co2: { type: Number, required: false },
  o3_2: { type: Number, required: false },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: '60d'  // TTL: se eliminarán automáticamente después de 60 días
  }
});

// Lista de campos numéricos a validar (misma que en SensorDataSchema)
const camposNumericosHistorial = [
  'temp',
  'o3',
  'no',
  'no2',
  'nox',
  'so2',
  'co',
  'presion',
  'temp_ambiente',
  'humedad_rel',
  'dir_viento',
  'rad_sol',
  'pm10',
  'pm2_5',
  'cot',
  'co2',
  'o3_2',
];

// Middleware pre-save para limpiar campos inválidos
SensorDataHistorialSchema.pre<SensorDataHistorial>('save', function (next) {
  console.log('Ejecutando middleware pre-save para SensorDataHistorial');
  cleanInvalidFields(this, camposNumericosHistorial);
  next();
});

// Crear el modelo de historial
const SensorDataHistorial = mongoose.model<SensorDataHistorial>('SensorDataHistorial', SensorDataHistorialSchema);

export default SensorDataHistorial;
