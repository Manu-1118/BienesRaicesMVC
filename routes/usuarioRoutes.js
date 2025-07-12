import express from 'express'
import { formularioLogin, autenticar, formularioRegistro, registrar, confirmar, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword} from '../controllers/usuarioController.js'

const router = express.Router()

// routing
router.get('/login', formularioLogin)
router.post('/login', autenticar)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token', confirmar)

router.get('/recuperacion', formularioOlvidePassword)
router.post('/recuperacion', resetPassword)

// Almacenar el nuevo pass
router.get('/recuperacion/:token', comprobarToken)
router.post('/recuperacion/:token', nuevoPassword)

export default router