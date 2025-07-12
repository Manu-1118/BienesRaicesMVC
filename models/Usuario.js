import { DataTypes } from 'sequelize' // tipos de datos de las entidades
import db from '../config/db.js' // base de datos
import bcrypt from 'bcrypt' // dependencia para hashear passwords

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN

}, {
    hooks: {
        beforeCreate: async function (usuario) {
            const salt = await bcrypt.genSalt(10) // hashear la contraseña 10 veces
            usuario.password = await bcrypt.hash( usuario.password, salt)
        }
    }
}) //definir un nuevo modelo(dentro de la '' es el nombre de la tabla)

// metodos personalizados (prototype: para indicar que esa funcion pertenece al objeto)
Usuario.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}
export default Usuario;