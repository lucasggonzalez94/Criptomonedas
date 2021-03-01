// 1 - SELECCION DE ELEMENTOS DEL HTML
const criptomonedasSelect = document.querySelector('#criptomonedas')
const monedaSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')

// 5 - OBJETO UTILIZADO PARA GUARDAR LOS DATOS DE BUSQUEDA
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// 2 - SE AGREGA UN EVENTO AL DOCUMENTO PARA QUE SE EJECUTEN LAS FUNCIONES NECESARIAS AL CARGAR LA PAGINA
document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas()

    criptomonedasSelect.addEventListener('change', leerValor)
    monedaSelect.addEventListener('change', leerValor)
    formulario.addEventListener('submit', submitFormulario)
})

// 3 - SE CONSULTA LA API PARA AGREGAR LAS MONEDAS AL SELECT
async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    // CONSUMIENDO LA API SIN ASYNC-AWAIT
    // fetch(url)
    //     .then( respuesta => respuesta.json() )
    //     .then( resultado => selectCriptomonedas(resultado.Data) )

    try {
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        const criptomonedas = await selectCriptomonedas(resultado.Data)
    } catch (e) {
        console.log(e)
    }
}

// 4 - FUNCION QUE AGREGA LAS CRIPTOMONEDAS AL SELECT
function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo

        const option = document.createElement('option')
        option.value = Name
        option.textContent = FullName
        criptomonedasSelect.appendChild(option)
    })
}

// 6 - SE ASIGNAN LOS DATOS DE BUSQUEDA AL OBJETO
function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value
    // console.log(objBusqueda)
}

// 7 - CALLBACK PARA EL EVENTO SUBMIT DEL FORMULARIO
function submitFormulario(e) {
    e.preventDefault()

    const {moneda, criptomoneda} = objBusqueda
    
    // SE VALIDA QUE LOS DATOS NO ESTEN VACIOS
    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios')
        return
    }

    // CONSULTAR LA API CON LOS RESULTADOS
    consultarAPI()
}

// 8 - FUNCION QUE MUESTRA ALERTA DE ERROR SI NO SE VALIDA EL FORMULARIO CORRECTAMENTE
function mostrarAlerta(mensaje) {

    const existeError = document.querySelector('.error')

    if (!existeError) {
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('error')

        // Mensaje de error
        divMensaje.textContent = mensaje

        formulario.appendChild(divMensaje)

        setTimeout(() => {
            divMensaje.remove()
        }, 3000)
    }
}

// 9 - SE HACE UNA NUEVA CONSULTA A LA API QUE DEVUELVE LOS DATOS A MOSTRAR EN EL RESULTADO
async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner()

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(cotizacion => {
    //         mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
    //         console.log(cotizacion.DISPLAY[criptomoneda][moneda])
    //     })

    try {
        const respuesta = await fetch(url)
        const cotizacion = await respuesta.json()
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
        console.log(cotizacion.DISPLAY[criptomoneda][moneda])
    } catch (e) {
        console.log(e)
    }
}

// 10 - FUNCION QUE CREA EL HTML NECESARIO PARA MOSTRAR EL RESULTADO DE LA BUSQUEDA
function mostrarCotizacionHTML(cotizacion) {
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion

    const precio = document.createElement('p')
    precio.classList.add('precio')
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`

    const precioAlto = document.createElement('p')
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span></p>`

    const precioBajo = document.createElement('p')
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span></p>`

    const ultimasHoras = document.createElement('p')
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`

    const ultimaActualizacion = document.createElement('p')
    ultimaActualizacion.innerHTML = `<p>Última actualización: <span>${LASTUPDATE}</span></p>`

    limpiarHTML()

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(ultimaActualizacion)
}

// 11 - AL MOMENTO DE HACER UNA BUSQUEDA SE LIMPIA EL RESULTADO QUE PUEDA HABER ANTERIORMENTE
function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

// 12 - MUESTRA UN SPINNER DE CARGA PARA QUE EL USUARIO TENGA UNA RETROALIMENTACION
function mostrarSpinner() {
    limpiarHTML()

    const spinner = document.createElement('div')
    spinner.classList.add('spinner')
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `

    resultado.appendChild(spinner)
}