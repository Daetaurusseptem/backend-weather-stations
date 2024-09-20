import request from 'supertest';
import mongoose from 'mongoose';
import Server from '../models/server';  // Ajusta la ruta según tu estructura

let token: string;
let estacionId: string;
let municipioId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);

  const resLogin = await request(Server.app)
    .post('/api/auth/login')
    .send({ 
      email: 'testuser@example.com',
      password: 'password123',
    });

  token = resLogin.body.token;
 
  // Crear un municipio de prueba
  const resMunicipio = await request(Server.app)
    .post('/api/municipio')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nombre: 'Municipio Estación Prueba',
      coordenadas: {
        latitud: 19.4326,
        longitud: -99.1332,
      },
    });

  municipioId = resMunicipio.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();  // Cierra la conexión después de las pruebas
});

describe('Pruebas de Estaciones', () => {
  const app = Server.app;

  it('Debe crear una nueva estación vinculada a un municipio', async () => {
    const res = await request(app)
      .post('/api/estacion')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Estación Central',
        ubicacion: {
          latitud: 19.4326,
          longitud: -99.1332,
        },
        municipioId: municipioId,
      });

    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe('Estación Central');
    estacionId = res.body._id;
  });

  it('Debe obtener todas las estaciones de un municipio', async () => {
    const res = await request(app)
      .get(`/api/estacion/municipio/${municipioId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Debe obtener una estación por su ID', async () => {
    const res = await request(app)
      .get(`/api/estacion/${estacionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Estación Central');
  });

  it('Debe eliminar la estación creada', async () => {
    const res = await request(app)
      .delete(`/api/estacion/${estacionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Estación eliminada con éxito');
  });
});
