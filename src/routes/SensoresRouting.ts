import { Router } from 'express';
import {
  crearDatosSensor,
  obtenerDatosSensores,
  obtenerDatoSensorPorId,
  actualizarDatoSensor,
  eliminarDatoSensor,
  obtenerDatoSensorPorEstacionId
} from '../controllers/sensorController';
import { crearDatosSensorValidator } from '../middleware/validations';
import { validateRequest } from '../middleware/errorHandler';
import { autenticarJWT } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SensorData:
 *       type: object
 *       required:
 *         - temp
 *         - o3
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado automáticamente por MongoDB
 *         estacion:
 *           type: string
 *           description: ID de la estación relacionada 
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Fecha de registro del sensor
 *         temp:
 *           type: number
 *           description: Temperatura registrada
 *         o3:
 *           type: number
 *           description: O3 registrado
 *         no:
 *           type: number
 *         no2:
 *           type: number
 *         nox:
 *           type: number
 *         so2:
 *           type: number
 *         co:
 *           type: number
 *         presion:
 *           type: number
 *         temp_ambiente:
 *           type: number
 *         humedad_rel:
 *           type: number
 *         dir_viento:
 *           type: number
 *         rad_sol:
 *           type: number
 *         pm10:
 *           type: number
 *         pm2_5:
 *           type: number
 *         cot:
 *           type: number
 *         co2:
 *           type: number
 *         o3_2:
 *           type: number
 */

/**
 * @swagger
 * /api/sensor/{id}:
 *   post:
 *     summary: Crea datos de sensores para una estación específica
 *     tags: [SensorData]
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
 *             $ref: '#/components/schemas/SensorData'
 *     responses:
 *       201:
 *         description: Datos de sensores creados con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorData'
 *       400:
 *         description: Error al crear los datos de sensores
 */
router.post('/:id', autenticarJWT, validateRequest, crearDatosSensor);  // Requiere JWT

/**
 * @swagger
 * /api/sensor/{id}:
 *   get:
 *     summary: Obtiene todos los datos de sensores para una estación específica
 *     tags: [SensorData]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la estación
 *     responses:
 *       200:
 *         description: Lista de datos de sensores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SensorData'
 *       400:
 *         description: Error al obtener los datos de sensores
 */
router.get('/:id', obtenerDatosSensores);  // No requiere JWT

/**
 * @swagger
 * /api/sensor/dato/{idSensor}:
 *   get:
 *     summary: Obtiene un dato de sensor por su ID
 *     tags: [SensorData]
 *     parameters:
 *       - in: path
 *         name: idSensor
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del dato de sensor
 *     responses:
 *       200:
 *         description: Dato de sensor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorData'
 *       404:
 *         description: Dato de sensor no encontrado
 */
router.get('/dato/:estacionId', obtenerDatoSensorPorEstacionId);  // No requiere JWT

/**
 * @swagger
 * /api/sensor/dato/{idSensor}:
 *   put:
 *     summary: Actualiza un dato de sensor por su ID
 *     tags: [SensorData]
 *     parameters:
 *       - in: path
 *         name: idSensor
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del dato de sensor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorData'
 *     responses:
 *       200:
 *         description: Dato de sensor actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorData'
 *       404:
 *         description: Dato de sensor no encontrado
 */
router.put('/dato/:idSensor', autenticarJWT, crearDatosSensorValidator, validateRequest, actualizarDatoSensor);  // Requiere JWT

/**
 * @swagger
 * /api/sensor/dato/{idSensor}:
 *   delete:
 *     summary: Elimina un dato de sensor por su ID
 *     tags: [SensorData]
 *     parameters:
 *       - in: path
 *         name: idSensor
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del dato de sensor
 *     responses:
 *       200:
 *         description: Dato de sensor eliminado con éxito
 *       404:
 *         description: Dato de sensor no encontrado
 */
router.delete('/dato/:idSensor', autenticarJWT, eliminarDatoSensor);  // Requiere JWT

export default router;
