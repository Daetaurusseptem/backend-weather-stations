import { body, check, param, query } from 'express-validator';

// Validaciones para Estaciones
export const crearEstacionValidator = [
  check('nombre')
    .notEmpty()
    .withMessage('El nombre de la estación es obligatorio')
    .isLength({ min: 3 })
    .withMessage('El nombre debe tener al menos 3 caracteres'),
  
  check('ubicacion.latitud')
    .notEmpty()
    .withMessage('La  latitud es obligatoria')
    .isFloat({ min: -90, max: 90 })
    .withMessage('La latitud debe estar entre -90 y 90'),

  check('ubicacion.longitud')
    .notEmpty()
    .withMessage('La longitud es obligatoria')
    .isFloat({ min: -180, max: 180 })
    .withMessage('La longitud debe estar entre -180 y 180'),

  check('municipio')
    .notEmpty()
    .withMessage('El ID del municipio es obligatorio')
    .isMongoId()
    .withMessage('Debe ser un ID de Mongo válido'),
];


export const crearDatosSensorValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de estación inválido'), // Validación del parámetro id en la ruta (ObjectId de MongoDB)

  body('temp')
    .isFloat()
    .withMessage('La temperatura debe ser un número'),

  body('o3')
    .isFloat()
    .withMessage('El valor de O3 debe ser un número'),

  body('no')
    .isFloat()
    .withMessage('El valor de NO debe ser un número'),

  body('no2')
    .isFloat()
    .withMessage('El valor de NO2 debe ser un número'),

  body('nox')
    .isFloat()
    .withMessage('El valor de NOx debe ser un número'),

  body('so2')
    .isFloat()
    .withMessage('El valor de SO2 debe ser un número'),

  body('co')
    .isFloat()
    .withMessage('El valor de CO debe ser un número'),

  body('presion')
    .isFloat()
    .withMessage('El valor de la presión debe ser un número'),

  body('temp_ambiente')
    .isFloat()
    .withMessage('La temperatura ambiente debe ser un número'),

  body('humedad_rel')
    .isFloat()
    .withMessage('La humedad relativa debe ser un número'),

  body('dir_viento')
    .isFloat()
    .withMessage('La dirección del viento debe ser un número'),

  body('rad_sol')
    .isFloat()
    .withMessage('La radiación solar debe ser un número'),

  body('pm10')
    .isFloat()
    .withMessage('El valor de PM10 debe ser un número'),

  body('pm2_5')
    .isFloat()
    .withMessage('El valor de PM2.5 debe ser un número'),

  body('cot')
    .isFloat()
    .withMessage('El valor de COT debe ser un número'),

  body('co2')
    .isFloat()
    .withMessage('El valor de CO2 debe ser un número'),

  body('o3_2')
    .isFloat()
    .withMessage('El valor de O3_2 debe ser un número'),
];


export const crearMunicipioValidator = [
  check('nombre')
    .notEmpty()
    .withMessage('El nombre del municipio es obligatorio')
    .isLength({ min: 3 })
    .withMessage('El nombre debe tener al menos 3 caracteres'),

  check('coordenadas.latitud')
    .notEmpty()
    .withMessage('La latitud es obligatoria')
    .isFloat({ min: -90, max: 90 })
    .withMessage('La latitud debe estar entre -90 y 90'),

  check('coordenadas.longitud')
    .notEmpty()
    .withMessage('La longitud es obligatoria')
    .isFloat({ min: -180, max: 180 })
    .withMessage('La longitud debe estar entre -180 y 180'),
];