import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUsuario extends Document {
  nombre: string;
  email: string;
  password: string;
  compararPassword: (password: string) => Promise<boolean>;
}

const UsuarioSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Middleware para encriptar la contraseña antes de guardar
UsuarioSchema.pre<IUsuario>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error:any) {
    next(error);
  }
});

// Método para comparar contraseñas
UsuarioSchema.methods.compararPassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUsuario>('Usuario-Clima', UsuarioSchema);
