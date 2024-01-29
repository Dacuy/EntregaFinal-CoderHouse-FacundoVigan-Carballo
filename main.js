let saldo = 0;
let codigoIngresado = "";
let productos = [];

let pantalla = document.getElementById("pantalla2");
let pantallaCoin = document.getElementById("pantalla");
let darItemBoton = document.getElementById("DarItem");
let CoinButton = document.getElementById("CoinButton");
let resetGanadoresButton = document.getElementById("resetGanadores");
let botones = [
    document.getElementById("Boton0"),
    document.getElementById("Boton1"),
    document.getElementById("Boton2"),
    document.getElementById("Boton3"),
    document.getElementById("Boton4"),
    document.getElementById("Boton5"),
    document.getElementById("Boton6"),
    document.getElementById("Boton7"),
    document.getElementById("Boton8"),
    document.getElementById("Boton9")
];
let botonReset = document.getElementById("resetGanadores")

let coinSound = document.getElementById("coinSound");
let buttonClickSound = document.getElementById("buttonClickSound");
let productClickSound = document.getElementById("productClickSound");

window.addEventListener('load', function () {
    cargarDatos();
    const saldoGuardado = localStorage.getItem('saldo');
    if (saldoGuardado !== null) {
        saldo = parseInt(saldoGuardado);
        actualizarPantalla();
    }
});

botones.forEach((boton) => {
    boton.addEventListener("click", () => {
        codigoIngresado += boton.innerText;
        actualizarPantalla();
        reproducirSonido(buttonClickSound);
    });
});

darItemBoton.addEventListener("click", () => {
    comprarProducto();
});

CoinButton.addEventListener("click", () => {
    saldo += 5;
    actualizarPantalla();
    reproducirSonido(coinSound);
});

resetGanadoresButton.addEventListener("click", () => {
    resetearGanadores();
});

function cargarDatos() {
    fetch('./datos.json')
        .then(response => response.json())
        .then(data => {
            productos = data.productos;
            actualizarPantalla();
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

function mostrarSweetAlert(titulo, mensaje, tipo) {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: tipo,
        confirmButtonText: 'Ok'
    });
}

function actualizarPantalla() {
    pantallaCoin.placeholder = saldo;
    pantalla.placeholder = codigoIngresado;
    localStorage.setItem('saldo', saldo);
}

function comprarProducto() {
    let productoSeleccionado = productos.find((producto) => producto.codigo === codigoIngresado);

    if (productoSeleccionado) {
        if (saldo >= productoSeleccionado.valor) {
            saldo -= productoSeleccionado.valor;
            mostrarProducto(productoSeleccionado.imagenId);
            ocultarImagenProducto(productoSeleccionado.imagenId);
            pantallaCoin.placeholder = `Producto ${productoSeleccionado.nombre} comprado.`;
            mostrarGanador(productoSeleccionado.imagenId);
        } else {
            mostrarSweetAlert("Saldo insuficiente", "Inserta más monedas.", "error");
        }
    } else {
        mostrarSweetAlert("Código inválido", "Introduce un código válido.", "error");
    }

    codigoIngresado = "";
    actualizarPantalla();
}

function mostrarProducto(imagenId) {
    productos.forEach((producto) => {
        document.getElementById(producto.imagenId + "p").style.visibility = "hidden";
    });

    document.getElementById(imagenId + "p").style.visibility = "visible";

    document.querySelector('.push').style.visibility = 'hidden';

    setTimeout(() => {
        document.querySelector('.push').style.visibility = 'visible';
    }, 10000);
}

function ocultarImagenProducto(imagenId) {
    document.getElementById(imagenId).style.visibility = "hidden";
}

function mostrarGanador(imagenId) {
    const horaRetiro = obtenerHoraActual();
    const cambioEntregado = calcularCambioEntregado();

    mostrarSweetAlert("¡Producto Retirado!", `Hora del retiro: ${horaRetiro}\nCambio entregado: ${cambioEntregado}`, "success");

    ocultarGanador(imagenId);
    reproducirSonido(productClickSound);
}

function obtenerHoraActual() {
    const ahora = new Date();
    const hora = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');
    return `${hora}:${minutos}:${segundos}`;
}

function calcularCambioEntregado() {
    const cambio = saldo;
    saldo = 0;
    return cambio;
}

function ocultarGanador(imagenId) {
    document.getElementById(imagenId + "c").style.visibility = "hidden";
}

function reproducirSonido(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play();
}

function resetearGanadores() {
    let ganadores = document.querySelectorAll('.productoSacado');

    ganadores.forEach((ganador) => {
        ganador.style.visibility = "hidden";
    });
}
botonReset.addEventListener("click", () => {
    location.reload()
});