import { Request, Response, NextFunction } from 'express';
import Usuario from '../models/models-mongoose/usuario';
import jwt from 'jsonwebtoken';
 import bcryptjs from 'bcryptjs';
 

// Importamos el tipo IUsuario
import usuario from '../models/models-mongoose/usuario';
import { generarJWT } from '../helpers/jwt';

// Registrar un nuevo usuario
export const registrarUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const { nombre, email, password } = req.body;
    const usuarioExistente = await Usuario.findOne({ email });
    
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    
    const nuevoUsuario = new Usuario({ nombre, email, password });
    await nuevoUsuario.save();
    
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    next(error);
  }
};

// Iniciar sesión
export const login = async  (req:Request, resp:Response)=>{
  
  const {email, password} = req.body
  

  
  try {
      
      const usuarioDB = await Usuario.findOne({email}).select('+password')

      if(!usuarioDB){  
          return resp.status(404).json({
              ok:false,
              msg:'Datos no validos'
          })
      }  
      

       const validPassword = bcryptjs.compareSync(password, usuarioDB.password);
       if(!validPassword){
           return resp.status(404).json({
               ok:false,
               msg:'Datos no validos'
           })
       }
       
      
      const token = await generarJWT(usuarioDB._id as string)
       
      
      return resp.status(200).json({
          ok:true,
          usuario:usuarioDB,
          token,  
          
      })
  }
catch (error) {

      return resp.status(500).json({  
          okay:false,
          msg:'Porfavor hable con el administrador: '
      })
  }


}
export const validarToken = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Token no proporcionado o inválido.' });
  }

  return res.status(200).json({
    message: 'Token válido.',
    user: req.user  // Información decodificada desde el middleware autenticarJWT
  });
};

export const renewToken = async (req: any, resp: Response) => {
  try {
      const uid = req.uid;
      

      // Generar nuevo JWT
      const token = await generarJWT(uid);
      

      // Buscar usuario por UID
      const usuario = await Usuario.findById(uid).select('+password');
      if (!usuario) {
          return resp.status(404).json({
              ok: false,
              msg: 'No se encontró el usuario'
          });
      }

      
    
      // Si se encontró la empresa, también devolver la información de la empresa
      return resp.status(200).json({
          ok: true,
          token,
          uid,
          usuario,
          
      });

  } catch (error) {
      console.error('Error en la renovación del token:', error);
      return resp.status(500).json({
          ok: false,
          msg: 'Hubo un error en el servidor',
          error
      });
  }
};
