import { validationResult } from 'express-validator'
// import bcrypt from 'bcrypt'

import { Precio, Categoria, Propiedad } from '../models/index.js'

const admin = (req, res) => {

    res.render('propiedades/admin', {

        pagina: 'Mis Propiedades'
    })
}

// Formulario para crear una nueva propiedad
const crear = async (req, res) => {

    // consultar modelo precio y categoria
    // hacer un arreglo de promesas que se ejecuten en paralelo
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {

        pagina: 'Crear Una Propiedad',
        categorias,
        precios,
        csrfToken: req.csrfToken(),
        datos: {}
    })
}

const guardar = async (req, res) => {
    // Validacion
    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {

        // consultar modelo precio y categoria
        // hacer un arreglo de promesas que se ejecuten en paralelo
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/crear', {

            pagina: 'Crear Una Propiedad',
            categorias,
            precios,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            datos: req.body
        })
    }

    // crear un registro

    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, categoria: fk_categoria_id, precio: fk_precio_id } = req.body

    const { id: fk_id_usuario } = req.usuario
    try {

        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            fk_precio_id,
            fk_categoria_id,
            fk_id_usuario,
            imagen: ''
        })

        const { id } = propiedadGuardada
        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error)
    }
}

const agregarImagen = async (req, res) => {

    const { id } = req.params
    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/propiedades')
    }

    // validar que la propiedad no esta publicada
    if (propiedad.publicado) {
        return res.redirect('/propiedades')
    }

    // Validar que la propiedad pertenece a quien visita esta pagina
    if (req.usuario.id.toString() !== propiedad.fk_id_usuario.toString()) {
        return res.redirect('/propiedades')
    }

    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

const almacenarImagen = async (req, res, next) => {
    const { id } = req.params
    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/propiedades')
    }

    // validar que la propiedad no esta publicada
    if (propiedad.publicado) {
        return res.redirect('/propiedades')
    }

    // Validar que la propiedad pertenece a quien visita esta pagina
    if (req.usuario.id.toString() !== propiedad.fk_id_usuario.toString()) {
        return res.redirect('/propiedades')
    }

    try {

        // Almacenar la imagen y publicar la propiedad
        // console.log(req.file)
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1
        await propiedad.save()

        next()

    } catch(error) {
        console.clear()
        console.log(error)
    }
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen
}