import { exit } from 'node:process'

import categorias from './categorias.js'
import precios from './precios.js'
import usuarios from './usuarios.js'

import db from '../config/db.js'

import { Categoria, Precio, Usuario } from '../models/index.js'

const importarDatos = async () => {
    try {

        // autenticar en la base de datos
        await db.authenticate()

        // generar las columnas
        await db.sync()

        // insertar los datos
        console.clear()

        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])

        console.clear()
        console.log('\nDatos importados correctamente')
        exit()

    } catch (error) {
        console.clear()
        console.log(error)
        exit(1)
    }
}

const eliminarDatos = async () => {
    try {

        // Eliminar absolutamente todo
        await db.sync({ force: true })

        // Eliminar tablas Seleccionadas
        // await Promise.all([
        //     Categoria.destroy({ where: {}, truncate: true }),
        //     Precio.destroy({ where: {}, truncate: true })
        // ])
        console.clear()
        console.log('\nDatos eliminados correctamente')
        exit()

    } catch (error) {
        console.clear()
        console.log(error)
        exit(1)
    }
}

if (process.argv[2] === '-i') {
    importarDatos();
}

if (process.argv[2] === '-e') {
    eliminarDatos();
}