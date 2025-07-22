import bcrypt from 'bcrypt'
const usuarios = [
    {
        nombre: 'Manuel',
        email: 'manutijerino1804@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('manuel1234', 10)
    },
    {
        nombre: 'Brandon',
        email: 'zetassj78@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('brandon1234', 10)
    }
]

export default usuarios;