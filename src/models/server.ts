import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
require('dotenv').config()

// Importar rutas
import authRoutes from '../routes/authRoutes';
import municipioRoutes from '../routes/municipioRoutes';
import estacionRoutes from '../routes/estacionRouting';
import sensorRoutes from '../routes/SensoresRouting';

// Middleware de errores
import { errorMiddleware } from '../middleware/errorMiddleware';

class Server {
  public app: Application;
  private server: http.Server;
  private io: SocketServer;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketServer(this.server, {
      cors: {
        origin: "*", // Cambia esto según sea necesario
      },
    });
    
    this.config();
    this.routes();
    this.sockets();
  }

  // Configuración de la aplicación
  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.connectToMongoDB();
    this.setupSwagger();
  }

  // Conexión a MongoDB
  private connectToMongoDB(): void {
    const mongoUri = process.env.MONGO_URI;
    
    mongoose.connect(mongoUri!)
      .then(() => console.log('Conexión a MongoDB establecida'))
      .catch(err => console.error('Error de conexión a MongoDB:', err));
  }

  // Configuración de Swagger
  private setupSwagger(): void {
    const swaggerDefinition = {
      openapi: '3.0.0',
      info: {
        title: 'API de Clima Proyecto',
        version: '1.0.0',
        description: 'API para gestionar estaciones y sensores de clima',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    };

    const options = {
      swaggerDefinition,
      apis: ['src/routes/*.ts'], 
    };

    const swaggerSpec = swaggerJsDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } 
 
  // Definición de rutas
  private routes(): void {
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/municipios', municipioRoutes);
    this.app.use('/api/estaciones', estacionRoutes); 
    this.app.use('/api/sensores', sensorRoutes);
    
    // Middleware de error
    this.app.use(errorMiddleware);

    // Ruta principal
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Bienvenido a la API del Clima Proyecto');
    });
  }

  // Configuración de Sockets
  private sockets(): void {
    this.io.on('connection', (socket) => {
      console.log('Cliente conectado:', socket.id);
  
      // El cliente se une a una sala específica basada en la estación que está monitoreando
      socket.on('join-station', (estacionId) => {
          socket.join(estacionId);
          console.log(`Cliente ${socket.id} se unió a la estación ${estacionId}`);
      });
  
      socket.on('disconnect', () => {
          console.log('Cliente desconectado:', socket.id);
      });
  });
  }

  // Emitir eventos de actualización
  public emit(event: string, data: any): void {
    console.log(event);
    this.io.emit(event, data);
  }

  // Iniciar el servidor
  public start(port?: number ): void {
    this.server.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    }); 
  }
}

// Exportar instancia del servidor
export default new Server();
