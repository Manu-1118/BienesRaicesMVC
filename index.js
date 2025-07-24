import express from 'express' // ecmascript
import scrf from 'csurf'
import cookieParser from 'cookie-parser'

import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadRoutes from './routes/propiedaRoute.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js '

// crear la app
const app = express()

// habilitar la lectura de formularios
app.use( express.urlencoded({ extended: true }) )

// habilitar cookie-parser
app.use( cookieParser() )

// habiltar el CSRF
app.use( scrf({ cookie: true }) )

//conexion a la bd
try {
    await db.authenticate()
    db.sync()
    console.log('Conexión correcta a la base de datos')
    
} catch (error) {
    console.log(error)
}

// habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

// carpeta publica
app.use(express.static('public'))

// routing
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadRoutes)
app.use('/api', apiRoutes)

// definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)

})