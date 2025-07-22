import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'


import Usuario from '../models/Usuario.js'
import { generarId, generarJWT } from '../helpers/tokens.js'
import { emailRegistro, emailRecuperacion } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {

    await check('email').isEmail().withMessage('Su correo no está correcto').run(req) // retorna un arreglo con errores
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req) // retorna un arreglo con errores

    let resultado = validationResult(req) // resultado de los elementos obtenidos

    // validacion por si el resultado esta vacio
    if (!resultado.isEmpty()) {
        // errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                email: req.body.email
            }
        })
    }

    const { email, password } = req.body

    // validacion que el usuario exista
    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario no existe' }],
            usuario: {
                email: email
            }
        })
    }

    // comprobar que el usuario esta confirmado
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'La cuenta no ha sido confirmada' }],
            usuario: {
                email: email
            }
        })
    }

    // verificar que la contraseña sea correcta
    if (!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El password no es correcto' }],
            usuario: {
                email: email
            }
        })
    }

    // autenticar al usuario
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre, email: usuario.email })

    //almacenar en un cookie
    return res.cookie('_token', token, {

        httpOnly: true, // para no acceder a las cookies en js
        //expires: 9000 // cuanto tiempo en seg va a expirar el cookie
        // secure: true,
        // sameSite: true
    }).redirect('/propiedades')
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {

    // validacion de elementos digitados por el usuario
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req) // retorna un arreglo con errores
    await check('email').isEmail().withMessage('Su correo no está correcto').run(req) // retorna un arreglo con errores
    await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos de 6 caracteres').run(req) // retorna un arreglo con errores
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req) // retorna un arreglo con errores

    let resultado = validationResult(req) // resultado de los elementos obtenidos

    // validacion por si el resultado esta vacio
    if (!resultado.isEmpty()) {
        // errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // obtener datos (destructuring)
    const { nombre, email, password } = req.body

    // buscar el email en la bd
    const existeUsuario = await Usuario.findOne({ where: { email: email } }) // en email : email se puede dejar solo uno por la redundancia

    // verificar que el usuario no este duplicado
    if (existeUsuario) {

        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Su correo ya está registrado' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // almacenar usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    // enviar email de confirmacion
    emailRegistro({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // mostrar mensaje de confirmacion
    res.render('template/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un mensaje de confirmación, presiona en el enlace'
    })
}

// Funcion para comprobar una cuenta
const confirmar = async (req, res) => {

    const { token } = req.params

    // verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token } })

    if (!usuario) {
        return res.render('auth/confirmacion', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }

    // confirmar la cuenta
    usuario.token = null
    usuario.confirmado = true
    await usuario.save()
    res.render('auth/confirmacion', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La Cuenta se Confirmó Correctamente'
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/recuperacion', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {

    // validacion de elementos digitados por el usuario
    await check('email').isEmail().withMessage('Su correo no está correcto').run(req) // retorna un arreglo con errores

    let resultado = validationResult(req) // resultado de los elementos obtenidos

    // validacion por si el resultado esta vacio
    if (!resultado.isEmpty()) {
        // errores
        return res.render('auth/recuperacion', {

            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    // validar que el usuario exista
    const { email } = req.body

    const usuario = await Usuario.findOne({ where: { email } })

    // si el usuario digitado no existe
    if (!usuario) {
        // errores
        return res.render('auth/recuperacion', {

            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El email digitado no existe' }]
        })
    }

    // generar un nuevo token y enviar el email
    usuario.token = generarId()
    await usuario.save()

    // enviar un email
    emailRecuperacion({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // renderizar un mensaje
    res.render('template/mensaje', {
        pagina: 'Reestablece tu Password',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })
}

const comprobarToken = async (req, res) => {

    const { token } = req.params

    const usuario = await Usuario.findOne({ where: { token } })
    if (!usuario) {
        return res.render('auth/confirmacion', {
            pagina: 'Error al reestablecer tu password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        })
    }

    // mostrar form para reestablecer el pass
    res.render('auth/reset-pass', {
        pagina: 'Reestablece Tu Password',
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req, res) => {

    // validacion de los inputs
    await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos de 6 caracteres').run(req) // retorna un arreglo con errores
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req) // retorna un arreglo con errores

    let resultado = validationResult(req) // resultado de los elementos obtenidos
    // validacion por si el resultado esta vacio
    if (!resultado.isEmpty()) {
        // errores
        return res.render('auth/reset-pass', {
            pagina: 'Reestablece Tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { token } = req.params
    const { password } = req.body

    // Identificar quien hace el cambio
    const usuario = await Usuario.findOne({ where: { token } })

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10) // hashear la contraseña 10 veces
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null
    await usuario.save()

    res.render('auth/confirmacion', {
        pagina: 'Password Reestablecido',
        mensaje: 'El password se guardó correctamente'
    })
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}