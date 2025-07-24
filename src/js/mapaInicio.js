(function () {
    const lat = 12.1493183;
    const lng = -86.2468325;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 16);
    
    let markers = new L.FeatureGroup().addTo(mapa)


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async () => {
        try {
            
            const URL = '/api/propiedades'
            const respuesta = await fetch(URL)
            const propiedades = await respuesta.json()

            // console.log(propiedades)
            mostrarPropiedades(propiedades)

        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {
        propiedades.forEach(propiedad => {
            // agregar los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            })
            .addTo(mapa)

            markers.addLayer(marker)
        });
    }

    obtenerPropiedades()
})()