import { Router } from 'express';
import { obtenerMetricas } from '../controllers/metricasController';
import { check } from 'express-validator';

const router = Router();

/**
 * @swagger
 * /metricas/{estacionId}/{lapso}:
 *   get:
 *     summary: Obtiene las métricas promedio para una estación en un lapso de tiempo especificado
 *     parameters:
 *       - in: path
 *         name: estacionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la estación
 *       - in: path
 *         name: lapso
 *         schema:
 *           type: string
 *           enum: [hora, dia, semana, mes, dos-meses]
 *         required: true
 *         description: Lapso de tiempo para calcular las métricas
 *     responses:
 *       200:
 *         description: Promedios calculados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 metrics:
 *                   type: object
 *                   properties:
 *                     promedioTemp:
 *                       type: number
 *                     promedioO3:
 *                       type: number
 *                     promedioNo:
 *                       type: number
 *                     promedioNo2:
 *                       type: number
 *                     promedioNox:
 *                       type: number
 *                     promedioSo2:
 *                       type: number
 *                     promedioCo:
 *                       type: number
 *                     promedioPresion:
 *                       type: number
 *                     promedioTempAmbiente:
 *                       type: number
 *                     promedioHumedad:
 *                       type: number
 *                     promedioDirViento:
 *                       type: number
 *                     promedioRadSol:
 *                       type: number
 *                     promedioPm10:
 *                       type: number
 *                     promedioPm2_5:
 *                       type: number
 *                     promedioCot:
 *                       type: number
 *                     promedioCo2:
 *                       type: number
 *                     promedioO3_2:
 *                       type: number
 *       400:
 *         description: ID de estación o lapso no válido
 *       404:
 *         description: No se encontraron datos
 *       500:
 *         description: Error interno del servidor
 */

// Ruta para obtener métricas por estación y lapso de tiempo (hora, día, semana, mes, dos-meses)
router.get('/:estacionId/:lapso',
  [
    // Validación de la estaciónId y el lapso
    check('lapso')
      .isIn(['hora', 'dia', 'semana', 'mes', 'dos-meses'])
      .withMessage('El lapso debe ser uno de los siguientes: hora, dia, semana, mes, dos-meses'),
  ],
  obtenerMetricas
);

export default router;
