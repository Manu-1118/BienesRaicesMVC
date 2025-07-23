import express from 'express'
import { body } from 'express-validator'

import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios } from '../controllers/propiedadController.js'
import protegerRuta from '../middleware/protegerRuta.js'
import upload from '../middleware/subirImagen.js'


const router = express.Router()

router.get('/propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)

router.post('/propiedades/crear',
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción del anuncio es obligatorio')
        .isLength({max: 200}).withMessage('La descripción del anuncio es demasiado largo'),
    body('categoria').isNumeric().withMessage('Selecciona una categoría'),    
    body('precio').isNumeric().withMessage('Selecciona un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona una cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona una cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona una cantidad de baños'),
    body('lat').isNumeric().withMessage('Ubica una propiedad en el mapa'),
    //body('lng').isNumeric().withMessage('Selecciona una cantidad de baños'),
    guardar
)

router.get('/propiedades/agregar-imagen/:id',
    protegerRuta,
    agregarImagen
)

router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
)

router.get('/propiedades/editar/:id',
    protegerRuta,
    editar
)

router.post('/propiedades/editar/:id',
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción del anuncio es obligatorio')
        .isLength({max: 200}).withMessage('La descripción del anuncio es demasiado largo'),
    body('categoria').isNumeric().withMessage('Selecciona una categoría'),    
    body('precio').isNumeric().withMessage('Selecciona un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona una cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona una cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona una cantidad de baños'),
    body('lat').isNumeric().withMessage('Ubica una propiedad en el mapa'),
    //body('lng').isNumeric().withMessage('Selecciona una cantidad de baños'),
    guardarCambios
)

export default router