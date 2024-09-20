import mongoose, { Schema, Document } from 'mongoose';
import { IEstacion } from './estacion';

export interface ISensorData extends Document {
  estacion: IEstacion['_id'];
  timestamp: Date;
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
}

const SensorDataSchema: Schema = new Schema({
  estacion: { type: Schema.Types.ObjectId, ref: 'Estacion', required: true },
  timestamp: { type: Date, default: Date.now },
  temp: {type:Number||null, required: false},
  o3: {type:Number||null, required: false},
  no: {type:Number||null, required: false},
  no2: {type:Number||null, required: false},
  nox:{type:Number||null, required: false},
  so2:{type:Number||null, required: false},
  co:{type:Number||null, required: false},
  presion:{type:Number||null, required: false},
  temp_ambiente:{type:Number||null, required: false},
  humedad_rel:{type:Number||null, required: false},
  dir_viento:{type:Number||null, required: false},
  rad_sol:{type:Number||null, required: false},
  pm10:{type:Number||null, required: false},
  pm2_5:{type:Number||null, required: false},
  cot:{type:Number||null, required: false},
  co2:{type:Number||null, required: false},
  o3_2:{type:Number||null, required: false},
});

export default mongoose.model<ISensorData>('SensorData', SensorDataSchema);
