import { Router } from 'express';
import {
  crearEstacion,
  obtenerEstaciones,
  obtenerEstacionPorId,
  actualizarEstacion,
  eliminarEstacion,
  obtenerEstacionesPorMunicipio,
  obtenerEstacionesDisponibles,
  asignarEstacion
} from '../controllers/estacionController';
import { crearEstacionValidator } from '../middleware/validations';
import { validateRequest } from '../middleware/errorHandler';
import { autenticarJWT } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Estacion:
 *       type: object
 *       required:
 *         - nombre
 *         - ubicacion
 *         - municipio
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado automáticamente por MongoDB
 *         nombre:
 *           type: string
 *           description: Nombre de la estación
 *         ubicacion:
 *           type: object
 *           properties:
 *             latitud:
 *               type: number
 *               description: Latitud de la estación
 *             longitud:
 *               type: number
 *               description: Longitud de la estación
 *         municipio:
 *           type: string
 *           description: ID del municipio al que pertenece la estación
 *         asignada:
 *           type: boolean
 *           description: Si la estación ya ha sido asignada a un script o no
 *       example:
 *         nombre: Estación Central
 *         ubicacion:
 *           latitud: 19.4326
 *           longitud: -99.1332
 *         municipio: 64ff2b6e874c9a45e0e3e5d8
 *         asignada: false
 */

/**
 * @swagger
 * /api/estacion:
 *   post:
 *     summary: Crea una nueva estación vinculada a un municipio
 *     tags: [Estacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estacion'
 *     responses:
 *       201:
 *         description: Estación creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estacion'
 *       400:
 *         description: Error al crear la estación
 */
router.post('/', autenticarJWT, crearEstacionValidator, validateRequest, crearEstacion);  // Requiere JWT

/**
 * @swagger
 * /api/estacion:
 *   get:
 *     summary: Obtiene todas las estaciones con paginación
 *     tags: [Estacion]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de la página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de estaciones por página
 *     responses:
 *       200:
 *         description: Lista de estaciones con paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estaciones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Estacion'
 *                 totalEstaciones:
 *                   type: integer
 *                   description: Total de estaciones en la base de datos
 *                 totalPages:
 *                   type: integer
 *                   description: Número total de páginas
 *                 currentPage:
 *                   type: integer
 *                   description: Página actual
 *       400:
 *         description: Error al obtener las estaciones
 */
router.get('/', obtenerEstaciones);  // No requiere JWT

/**
 * @swagger
 * /api/estacion/disponibles:
 *   get:
 *     summary: Obtiene todas las estaciones no asignadas
 *     tags: [Estacion]
 *     responses:
 *       200:
 *         description: Lista de estaciones no asignadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Estacion'
 *       400:
 *         description: Error al obtener las estaciones no asignadas
 */
router.get('/disponibles', obtenerEstacionesDisponibles);  // No requiere JWT

/**
 * @swagger
 * /api/estacion/asignar:
 *   post:
 *     summary: Asigna una estación a un script
 *     tags: [Estacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estacion_id:
 *                 type: string
 *                 description: ID de la estación a asignar
 *     responses:
 *       200:
 *         description: Estación asignada correctamente
 *       400:
 *         description: Error al asignar la estación
 *       404:
 *         description: Estación no encontrada
 */
router.post('/asignar', autenticarJWT, asignarEstacion);  // Requiere JWT

/**
 * @swagger
 * /api/estacion/{id}:
 *   get:
 *     summary: Obtiene una estación por su ID
 *     tags: [Estacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la estación
 *     responses:
 *       200:
 *         description: Estación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estacion'
 *       404:
 *         description: Estación no encontrada
 */
router.get('/:id', obtenerEstacionPorId);  // No requiere JWT

/**
 * @swagger
 * /api/estacion/{id}:
 *   put:
 *     summary: Actualiza una estación por su ID
 *     tags: [Estacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la estación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estacion'
 *     responses:
 *       200:
 *         description: Estación actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estacion'
 *       404:
 *         description: Estación no encontrada
 */
router.put('/:id', autenticarJWT, crearEstacionValidator, validateRequest, actualizarEstacion);  // Requiere JWT

/**
 * @swagger
 * /api/estacion/{id}:
 *   delete:
 *     summary: Elimina una estación por su ID
 *     tags: [Estacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la estación
 *     responses:
 *       200:
 *         description: Estación eliminada con éxito
 *       404:
 *         description: Estación no encontrada
 */
router.delete('/:id', autenticarJWT, eliminarEstacion);  // Requiere JWT

/**
 * @swagger
 * /api/estacion/municipio/{municipioId}:
 *   get:
 *     summary: Obtiene todas las estaciones de un municipio
 *     tags: [Estacion]
 *     parameters:
 *       - in: path
 *         name: municipioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del municipio
 *     responses:
 *       200:
 *         description: Lista de estaciones en el municipio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Estacion'
 *       404:
 *         description: No se encontraron estaciones en el municipio
 */
router.get('/municipio/:municipioId', obtenerEstacionesPorMunicipio);  // No requiere JWT

export default router;
