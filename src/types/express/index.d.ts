import { IUsuario } from '../../models/models-mongoose/usuario';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        nombre: string;
        email: string;
      };
    }
  }
}