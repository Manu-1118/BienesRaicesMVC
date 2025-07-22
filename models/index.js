import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'

// Precio.hasOne(Propiedad)
// una propiedad tiene precio
Propiedad.belongsTo(Precio, {foreignKey: 'fk_precio_id'})

// una propiedad tiene una categoria
Propiedad.belongsTo(Categoria, {foreignKey: 'fk_categoria_id'})

// una propiedad le pertenece a un usuario
Propiedad.belongsTo(Usuario, { foreignKey: 'fk_id_usuario'})

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}