import jwt from 'jsonwebtoken'

import { Usuario } from '../models/index.js'

const protegerRuta = async (req, res, next) => {

    // verificar si hay un token
    const { _token } = req.cookies

    if (!_token) {
        return res.redirect('/auth/login')
    }

    // verificar el token
    try {

        const decoded = jwt.verify(_token, process.env.JWT)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)

        // console.clear()
        // console.log(usuario)
        // Almacenar el usuario al req
        if (usuario) {

            req.usuario = usuario

        } else {
            return res.redirect('/auth/login')
        }

        return next()

    } catch (error) {
        // console.log(error)
        return res.clearCookie('_token').redirect('/auth/login')
    }

}

export default protegerRuta;