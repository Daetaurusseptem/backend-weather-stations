import { Router } from 'express';
import { crearMunicipio, obtenerMunicipios, obtenerMunicipioPorId, obtenerMunicipiosFiltrados } from '../controllers/municipioController';
import { autenticarJWT } from '../middleware/authMiddleware';
import { crearMunicipioValidator } from '../middleware/validations';  // Validator para municipio
import { validateRequest } from '../middleware/errorHandler';  // Middleware para manejar errores

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Municipio:
 *       type: object
 *       required:
 *         - nombre
 *         - coordenadas
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del municipio
 *         coordenadas:
 *           type: object
 *           properties:
 *             latitud:
 *               type: number
 *               description: Latitud del municipio
 *             longitud:
 *               type: number
 *               description: Longitud del municipio
 *       example:
 *         nombre: Ciudad de México
 *         coordenadas:
 *           latitud: 19.4326
 *           longitud: -99.1332
 */

/**
 * @swagger
 * /api/municipio:
 *   post:
 *     summary: Crea un nuevo municipio
 *     tags: [Municipio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Municipio'
 *     responses:
 *       201:
 *         description: Municipio creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Municipio'
 *       400:
 *         description: Error al crear el municipio
 */
router.post('/', autenticarJWT, crearMunicipioValidator, validateRequest, crearMunicipio);  // Requiere JWT

/**
 * @swagger
 * /api/municipio:
 *   get:
 *     summary: Obtiene todos los municipios
 *     tags: [Municipio]
 *     responses:
 *       200:
 *         description: Lista de municipios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Municipio'
 *       400:
 *         description: Error al obtener los municipios
 */
router.get('/', obtenerMunicipios);  // No requiere JWT

/**
 * @swagger
 * /api/municipios/filtro-municipios:
 *   get:
 *     summary: Obtener lista de municipios con filtro y paginación
 *     tags:
 *       - Municipios
 *     parameters:
 *       - name: termino
 *         in: query
 *         description: Buscar por nombre del municipio
 *         required: false
 *         schema:
 *           type: string
 *       - name: pagina
 *         in: query
 *         description: Número de página para la paginación
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de municipios paginada
 */
router.get('/filtro-municipios', obtenerMunicipiosFiltrados);

/**
 * @swagger
 * /api/municipio/{id}:
 *   get:
 *     summary: Obtiene un municipio por su ID
 *     tags: [Municipio]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del municipio
 *     responses:
 *       200:
 *         description: Municipio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Municipio'
 *       404:
 *         description: Municipio no encontrado
 */
router.get('/:id', obtenerMunicipioPorId);  // No requiere JWT



export default router;
