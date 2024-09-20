import { Router } from 'express';
import { registrarUsuario, loginUsuario, validarToken } from '../controllers/authController';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/errorHandler';
import { autenticarJWT } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - password
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *       example:
 *         nombre: Juan Pérez
 *         email: juanperez@example.com
 *         password: password123
 */ 

/**
 * @swagger
 * /api/auth/registrar:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *       400:
 *         description: Error en el registro del usuario
 */
router.post(
  '/registrar',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  validateRequest,
  registrarUsuario
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *           example:
 *             email: juanperez@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: Usuario autenticado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *       400:
 *         description: Error en el inicio de sesión
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  validateRequest,
  loginUsuario
);
/**
 * @swagger
 * /auth/validate-token:
 *   get:
 *     summary: Valida el token JWT
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token válido.
 *                 user:
 *                   type: object
 *                   description: Información del usuario autenticado
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 12345
 *                     nombre:
 *                       type: string
 *                       example: Juan Pérez
 *                     email:
 *                       type: string
 *                       example: juan.perez@example.com
 *       401:
 *         description: Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token no proporcionado o inválido.
 */
router.get('/validate-token', autenticarJWT, validarToken);  // Aplica el middleware antes del controlador


export default router;
