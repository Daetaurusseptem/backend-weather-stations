import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Municipio from './models/models-mongoose/municipio';
import Estacion from './models/models-mongoose/estacion';
import SensorData from './models/models-mongoose/sensor-data';
import Usuario from './models/models-mongoose/usuario';

// Cargar config
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/deus';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🔌 Conectado a MongoDB local para Seed');

        console.log('🗑️  Limpiando colecciones anteriores...');
        await Municipio.deleteMany({});
        await Estacion.deleteMany({});
        await SensorData.deleteMany({});
        await Usuario.deleteMany({});

        console.log('👤 Creando usuario administrador base...');
        const adminUser = new Usuario({
            nombre: 'Administrador Local',
            email: 'admin@local.com',
            password: 'password123'
        });
        await adminUser.save();

        console.log('🌱 Creando un Municipio (Victoria de Durango)...');
        const municipio1 = new Municipio({
            nombre: 'Victoria de Durango',
            coordenadas: { latitud: 24.0277, longitud: -104.6531 }
        });
        await municipio1.save();

        console.log('📡 Creando cuatro Estaciones de monitoreo base...');
        const est1 = new Estacion({ nombre: 'Centro Histórico (Sede Ambiental)', ubicacion: { latitud: 24.0250, longitud: -104.6600 }, municipio: municipio1._id, asignada: true });
        const est2 = new Estacion({ nombre: 'Parque Guadiana Sur', ubicacion: { latitud: 24.0180, longitud: -104.6800 }, municipio: municipio1._id, asignada: true });
        const est3 = new Estacion({ nombre: 'Zona Industrial Ladrillera', ubicacion: { latitud: 24.0450, longitud: -104.6400 }, municipio: municipio1._id, asignada: true });
        const est4 = new Estacion({ nombre: 'Felipe Pescador Oriente', ubicacion: { latitud: 24.0320, longitud: -104.6450 }, municipio: municipio1._id, asignada: false });

        await Estacion.insertMany([est1, est2, est3, est4]);

        console.log('💨 Inyectando telemetría realista base (SensorData)...');
        const data1 = new SensorData({ estacion: est1._id, temp: 22.5, o3: 45, pm2_5: 35, pm10: 40, co: 5, no2: 12, humedad_rel: 30, rad_sol: 500 });
        const data2 = new SensorData({ estacion: est2._id, temp: 21.0, o3: 20, pm2_5: 15, pm10: 25, co: 2, no2: 8, humedad_rel: 35, rad_sol: 450 });
        const data3 = new SensorData({ estacion: est3._id, temp: 24.0, o3: 60, pm2_5: 80, pm10: 95, co: 8, no2: 20, humedad_rel: 25, rad_sol: 550 });

        await SensorData.insertMany([data1, data2, data3]);

        console.log('✅ ¡Base de datos sembrada con éxito! (Puedes arrancar el backend)');
        process.exit();
    } catch (err) {
        console.error('❌ Error sembrando base de datos:', err);
        process.exit(1);
    }
};

seedDatabase();
