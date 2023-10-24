const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Configura CORS para permitir cualquier origen en desarrollo.
app.use(cors());

// Declarar una baraja de cartas (como array de objetos)
const palos = ['Corazones', 'Diamantes', 'Tréboles', 'Picas'];
const valores = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',];

const deck = [];

for (const palo of palos) {
  for (const valor of valores) {
    deck.push({ palo, valor });
  }
}
;

// Estado del juego
const gameState = {
    partidaActiva: false,
    jugadores: [],
};
const jugadores = [
    { id: '1',nom: [],fitxes: '100', cartas: [] },
    { id: '2',nom: [],fitxes: '100', cartas: [] },
    { id: '3',nom: [],fitxes: '100', cartas: [] },
    { id: '4',nom: [],fitxes: '100', cartas: [] },
];
// Iniciar una nueva partida
function iniciarPartida() {
    gameState.partidaActiva = true;
    gameState.jugadores = [];
    // Lógica para repartir cartas a jugadores, gestionar apuestas, etc.
}

// Ruta para unirse a la partida
// Número máximo de jugadores permitidos en la partida
const MAX_JUGADORES = 4;
// Ruta para iniciar una nueva partida
app.post('/iniciarJoc', (req, res) => {
    if (gameState.partidaActiva) {
        return res.status(400).send('Ya hay una partida activa.');
    }

    const codigoSala = Math.floor(10 + Math.random() * 10).toString();

    iniciarPartida();

    res.status(200).send(`Se ha creado tu sesión, tu código de sala es: ${codigoSala}`);
});
// Ruta para unirse a una partida ya iniciada
// Ruta para unirse a una partida ya iniciada con un código de sala
app.post('/codigosala/unirsePartida/:codigoSala', (req, res) => {
    const codigoSala = req.params.codigoSala;

    if (codigoSala === codigoSala) {
        // Verificar si la partida ya tiene el número máximo de jugadores permitidos.
        if (gameState.jugadores.length >= MAX_JUGADORES) {
            return res.status(400).send('La partida está llena, no se pueden unir más jugadores.');
        }

        // Lógica para permitir que un nuevo jugador se una a la partida.
        const jugadorId = gameState.jugadores.length + 1;
        gameState.jugadores.push({ id: jugadorId, cartas: [] });
        res.status(200).send(`Te has unido a la partida como Jugador ${jugadorId}.`);
    } else {
        res.status(400).send('El código de sala es incorrecto o la partida no existe.');
    }
});
app.get('/obtenirCarta/codiPartida', (req, res) => {
    //aqui ira el for con todas las cartas
})
// Ruta para obtener una carta
app.get('/obtenerCarta/:jugadorId', (req, res) => {
    if (!gameState.partidaActiva) {
        return res.status(400).send('No hay partida activa.');
    }

    const jugadorId = parseInt(req.params.jugadorId);
    const jugador = gameState.jugadores.find((j) => j.id === jugadorId);

    if (!jugador) {
        return res.status(404).send('Jugador no encontrado.');
    }

    if (deck.length === 0) {
        return res.status(200).send('No quedan cartas en el mazo.');
    }

    // Obtén una carta del mazo (usando deck.pop()) y agrégala al jugador.
    const carta = deck.pop();
    jugador.cartas.push(carta);

    // Devuelve la carta obtenida como respuesta.
    res.status(200).json(carta);
});
// Ruta para mostrar las cartas de un jugador
app.get('/mostrarCartes/:jugadorId', (req, res) => {
    if (!gameState.partidaActiva) {
        return res.status(400).send('No hay partida activa.');
    }

    const jugadorId = parseInt(req.params.jugadorId);
    const jugador = gameState.jugadores.find((j) => j.id === jugadorId);

    if (!jugador) {
        return res.status(404).send('Jugador no encontrado.');
    }

    // Implementa la lógica para mostrar las cartas del jugador.

    // Por ahora, devolvemos una respuesta de ejemplo.
    res.status(200).send(`Cartas del Jugador ${jugadorId}: ${jugador.cartas.map((c) => `${c.valor} de ${c.palo}`).join(', ')}`);
});
app.get('/obtenirCarta/:codiPartida', (req, res) => {   
    const codiPartida = req.params.codiPartida;
    
    if (codiPartida === codigoSala) {
        if (!gameState.partidaActiva) {
            return res.status(400).send('No hay partida activa.');
        }

        if (gameState.jugadores.length === 0) {
            return res.status(200).send('No hay jugadores en la partida.');
        }

        // Crear un objeto que almacene las cartas de todos los jugadores
        const cartasJugadores = {};

        for (const jugador of gameState.jugadores) {
            cartasJugadores[`Jugador ${jugador.id}`] = jugador.cartas.map((c) => `${c.valor} de ${c.palo}`);
        }

        res.status(200).json(cartasJugadores);
    } else {
        res.status(400).send('El código de sala es incorrecto o la partida no existe.');
    }
});
app.put('/moureJugador/:codiPartida/aposta/:quantitat', (req, res) => {
    const codiPartida = req.params.codiPartida;
    if (codiPartida === codigoSala) {
        if (!gameState.partidaActiva) {
            return res.status(400).send('No hay partida activa.');
        }

        const jugadorId = parseInt(req.params.jugadorId);
        const jugador = gameState.jugadores.find((j) => j.id === jugadorId);

        if (!jugador) {
            return res.status(404).send('Jugador no encontrado.');
        }

        const quantitat = parseInt(req.params.quantitat);

        if (isNaN(quantitat) || quantitat <= 0) {
            return res.status(400).send('La cantidad de la apuesta es inválida.');
        }

        if (jugador.fitxes < quantitat) {
            return res.status(400).send('No tienes suficientes fichas para hacer esa apuesta.');
        }

        jugador.fitxes -= quantitat;

        res.status(200).send(`Has apostado ${quantitat} fichas. Tu saldo restante es ${jugador.fitxes}.`);
    } else {
        res.status(500).send('el servidor no responde');
    }
});

app.listen(port, () => {
    console.log(`Le carpette rapide ce commencé`);
});