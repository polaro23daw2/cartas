const iniciarPartidaButton = document.getElementById('iniciarPartida');
const unirsePartidaButton = document.getElementById('unirsePartida');
const obtenerCartaButton = document.getElementById('obtenerCarta');
const mostrarCartasButton = document.getElementById('mostrarCartas');
const apostarFitxesButton = document.getElementById('apostarFitxes');
const resultadoDiv = document.getElementById('resultado');

// Agrega un contenedor para mostrar la información de los jugadores.
const jugadoresInfoDiv = document.getElementById('jugadores-info');

const serverURL = 'http://localhost:3000'; // Asegúrate de que esta URL coincida con la del servidor backend.

iniciarPartidaButton.addEventListener('click', () => {
    fetch(`${serverURL}/iniciarJoc`, {
        method: 'POST',
    })
        .then(response => response.text())
        .then(data => {
            resultadoDiv.textContent = data;
            // Muestra el código en la consola del navegador.
            console.log('Código de sala:', data);
        })
        .catch(error => {
            resultadoDiv.textContent = 'Error al iniciar la partida.';
            // Muestra una alerta en caso de error.
            alert('Error al iniciar la partida: ' + error.message);
        });
});

unirsePartidaButton.addEventListener('click', () => {
    const codigoSala = prompt('Introduce el código de sala:');
    if (codigoSala) {
        fetch(`${serverURL}/codigosala/unirsePartida/${codigoSala}`, {
            method: 'POST',
        })
            .then(response => response.text())
            .then(data => {
                resultadoDiv.textContent = data;
            });
    }
});

obtenerCartaButton.addEventListener('click', () => {
    const jugadorId = prompt('Introduce tu ID de jugador:');
    if (jugadorId) {
        fetch(`${serverURL}/obtenerCarta/${jugadorId}`)
            .then(response => response.json())
            .then(data => {
                resultadoDiv.textContent = `Carta obtenida: ${data.valor} de ${data.palo}`;
            })
            .catch(error => {
                resultadoDiv.textContent = error.message;
            });
    }
});

mostrarCartasButton.addEventListener('click', () => {
    const jugadorId = prompt('Introduce tu ID de jugador:');
    if (jugadorId) {
        fetch(`${serverURL}/mostrarCartes/${jugadorId}`)
            .then(response => response.text())
            .then(data => {
                resultadoDiv.textContent = data;
            });
    }
});

apostarFitxesButton.addEventListener('click', () => {
    const codigoSala = prompt('Introduce el código de sala:');
    const jugadorId = prompt('Introduce tu ID de jugador:');
    const fitxesJugador = prompt('Introduce la cantidad que quieres apostar:');
    if (codigoSala && jugadorId && fitxesJugador) {
        fetch(`${serverURL}/moureJugador/${codigoSala}/aposta/${fitxesJugador}`, {
            method: 'PUT',
        })
            .then(response => response.text())
            .then(data => {
                resultadoDiv.textContent = data;
            })
            .catch(error => {
                resultadoDiv.textContent = 'Error al hacer la apuesta.';
                console.error('Error al hacer la apuesta:', error);
            });
    }
});

// Función para mostrar la información de los jugadores
function mostrarInformacionJugadores(jugadores) {
    jugadoresInfoDiv.innerHTML = ''; // Limpia el contenido anterior

    for (const jugador of jugadores) {
        const jugadorInfoElement = document.createElement('div');
        jugadorInfoElement.textContent = `Jugador ${jugador.id}: Fichas ${jugador.fitxes}, Cartas [${jugador.cartas.join(', ')}]`;
        jugadoresInfoDiv.appendChild(jugadorInfoElement);
    }
}
