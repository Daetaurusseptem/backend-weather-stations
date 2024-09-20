import request from 'supertest';
import mongoose from 'mongoose';
import Server from '../models/server';  // Ajusta la ruta según tu estructura

let token: string;
let estacionId: string;
let sensorDataId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);

  const resLogin = await request(Server.app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123',
    });

  token = resLogin.body.token;

  // Crear una estación de prueba
  const resEstacion = await request(Server.app)
    .post('/api/estacion')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nombre: 'Estación Sensor Prueba',
      ubicacion: {
        latitud: 19.4326,
        longitud: -99.1332,
      },
      municipioId: '64ff2b6e874c9a45e0e3e5d8',  // ID de municipio de prueba
    });

  estacionId = resEstacion.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();  // Cierra la conexión después de las pruebas
});

describe('Pruebas de Sensores', () => {
  const app = Server.app;

  it('Debe crear un nuevo dato de sensor para una estación', async () => {
    const res = await request(app)
      .post(`/api/sensor/${estacionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        temp: 25.3,
        o3: 0.02,
        no: 0.001,
        no2: 0.005,
        nox: 0.006,
        so2: 0.003,
        co: 0.1,
        presion: 1012.5,
        temp_ambiente: 22.3,
        humedad_rel: 50,
        dir_viento: 180,
        rad_sol: 900,
        pm10: 45,
        pm2_5: 25,
        cot: 0.05,
        co2: 400,
        o3_2: 0.04,
      });

    expect(res.status).toBe(201);
    expect(res.body.temp).toBe(25.3);
    sensorDataId = res.body._id;
  });

  it('Debe obtener todos los datos de sensores para una estación', async () => {
    const res = await request(app)
      .get(`/api/sensor/${estacionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Debe obtener un dato de sensor por su ID', async () => {
    const res = await request(app)
      .get(`/api/sensor/dato/${sensorDataId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.temp).toBe(25.3);
  });

  it('Debe eliminar un dato de sensor por su ID', async () => {
    const res = await request(app)
      .delete(`/api/sensor/dato/${sensorDataId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Dato de sensor eliminado con éxito');
  });
});
