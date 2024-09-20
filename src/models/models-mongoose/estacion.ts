import mongoose, { Schema, Document } from 'mongoose';
import { IMunicipio } from './municipio';

export interface IEstacion extends Document {
  nombre: string;
  ubicacion: {
    latitud: number;
    longitud: number;
  };
  municipio: IMunicipio['_id'];  // Referencia al municipio
  asignada:Boolean
}

const EstacionSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  ubicacion: {
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true },
  },
  municipio: { type: Schema.Types.ObjectId, ref: 'Municipio', required: true },  // Referencia al municipio
  asignada:Boolean
});

export default mongoose.model<IEstacion>('Estacion', EstacionSchema);
