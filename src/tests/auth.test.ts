import request from 'supertest';
import mongoose from 'mongoose';
import Server from '../models/server';  // Ajusta la ruta según tu estructura

let token: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Pruebas de Autenticación', () => {
  const app = Server.app;

  it('Debe registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/auth/registrar')
      .send({
        nombre: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBeDefined();
  });

  it('Debe iniciar sesión y devolver un token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });
});
