import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
    dictDefaultMessage: 'Arrastra y sube tus imagenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false, // auto subir las imagenes
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'No puede subir mas de una imagen',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function () {
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function () {
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function () {
            if (dropzone.getActiveFiles().length == 0) {
                window.location.href = '/propiedades'
            }
        })
    }
}