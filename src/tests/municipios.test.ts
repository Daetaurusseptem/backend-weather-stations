import request from 'supertest';
import mongoose from 'mongoose';
import Server from '../models/server';  // Ajusta la ruta según tu estructura

let token: string;
let municipioId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string );

  // Autenticación para obtener el token
  const resLogin = await request(Server.app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123',
    });

  token = resLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();  // Cierra la conexión después de las pruebas
});

describe('Pruebas de Municipio', () => {
  const app = Server.app;

  it('Debe crear un nuevo municipio', async () => {
    const res = await request(app)
      .post('/api/municipio')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Ciudad de Prueba',
        coordenadas: {
          latitud: 19.4326,
          longitud: -99.1332,
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe('Ciudad de Prueba');
    municipioId = res.body._id;
  });

  it('Debe obtener todos los municipios', async () => {
    const res = await request(app)
      .get('/api/municipio')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Debe obtener un municipio por su ID', async () => {
    const res = await request(app)
      .get(`/api/municipio/${municipioId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Ciudad de Prueba');
  });

  it('Debe eliminar el municipio creado', async () => {
    const res = await request(app)
      .delete(`/api/municipio/${municipioId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Municipio eliminado con éxito');
  });
});
