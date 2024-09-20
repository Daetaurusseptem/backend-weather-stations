import mongoose, { Schema, Document } from 'mongoose';

export interface IMunicipio extends Document {
  nombre: string;
  coordenadas: {
    latitud: number;
    longitud: number;
  };
}

const MunicipioSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  coordenadas: {
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true },
  },
});

export default mongoose.model<IMunicipio>('Municipio', MunicipioSchema);
