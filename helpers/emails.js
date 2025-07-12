import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // obtener los datos del usuario
    const { email, nombre, token } = datos

    // enviar email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu Cuenta en BienesRaices.com',
        text: 'Confirma tu Cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>

            <p>Tu cuenta está lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
            `
    })
} // fin emailRegistro

const emailRecuperacion = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // obtener los datos del usuario
    const { email, nombre, token } = datos

    // enviar email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu password en BienesRaices.com',
        text: 'Reestablece tu password en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, haz solicitado reestablecer tu password en BienesRaices.com</p>

            <p>Sigue el siguiente enlace para generar un password nuevo
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recuperacion/${token}">Reestablecer Password</a></p>

            <p>Si tu no solicitaste cambio de password, puedes ignorar el mensaje</p>
            `
    })
} // fin emailRecuperacion

export {
    emailRegistro,
    emailRecuperacion
}