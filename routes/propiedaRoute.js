import express from 'express'

import { admin, crear } from '../controllers/propiedadController.js'

const router = express.Router()

router.get('/propiedades', admin)
router.get('/propiedades/crear', crear)
// router.delete('/propiedades/crear', crear)
export default router