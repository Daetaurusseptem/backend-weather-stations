import { Request, Response, NextFunction } from 'express';

const jwt  = require('jsonwebtoken');

interface JwtPayload {
  id: string;
  nombre: string;
  email: string;
  iat: number;
  exp: number;
}


export const autenticarJWT = (req : any, resp : Response, next:NextFunction)=>{
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return resp.status(401).json({ message: 'No autorizado' });
  }
  const token = authHeader.split(' ')[1];
  
  
  
  if(!token){
      return resp.status(401).json({
          ok:false,
          msg:`no hay token en la validacion`
      });
  }

  try {
      
      const { uid } = jwt.verify(token, process.env.JWT);
    
      req.uid = uid;


      next();
      
  } catch (error) {
    
      return resp.status(401).json({
          ok:false, 
          msg:`token no valido ${error}`
      });
  }

}

