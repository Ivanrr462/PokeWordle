// Referencias a elementos
const gridEl = document.getElementById('grid');
const mensajeEl = document.getElementById('mensaje');
const btnReiniciar = document.getElementById('reiniciar');

let pokemonSeleccionado = '';
let longitudPalabra = 0;
let intentoActual = 0;
let posicionLetra = 0;
const MAX_INTENTOS = 6;

// Array para almacenar la cuadrícula (6 filas × longitudPalabra columnas)
let gridData = [];

// Inicializa el juego
async function iniciarJuego() {
  // 1) Obtener lista de 151 primeros Pokémon y elegir aleatorio
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  const data = await res.json();
  const lista = data.results.map(p => p.name); // nombres en minúsculas
  pokemonSeleccionado = lista[Math.floor(Math.random() * lista.length)];
  longitudPalabra = pokemonSeleccionado.length;

  // 2) Resetear variables y UI
  intentoActual = 0;
  posicionLetra = 0;
  mensajeEl.textContent = '';
  gridEl.innerHTML = '';
  gridData = [];

  // 3) Crear cuadrícula en DOM y en gridData
  gridEl.style.gridTemplateColumns = `repeat(${longitudPalabra}, 1fr)`;
  for (let i = 0; i < MAX_INTENTOS; i++) {
    gridData[i] = Array(longitudPalabra).fill('');
    for (let j = 0; j < longitudPalabra; j++) {
      const div = document.createElement('div');
      div.classList.add('cell');
      div.setAttribute('id', `cell-${i}-${j}`);
      gridEl.appendChild(div);
    }
  }
}
 
// Detectar pulsaciones de teclado
document.addEventListener('keydown', (e) => {
  if (mensajeEl.textContent) return; // no aceptar input si ya terminó

  // Tecla LETRA (a–z)
  if (e.key.match(/^[a-zñ]$/i)) {
    if (posicionLetra < longitudPalabra) {
      const letra = e.key.toLowerCase();
      gridData[intentoActual][posicionLetra] = letra;
      actualizarCelda(intentoActual, posicionLetra, letra);
      posicionLetra++;
    }
  }

  // Retroceso
  if (e.key === 'Backspace') {
    if (posicionLetra > 0) {
      posicionLetra--;
      gridData[intentoActual][posicionLetra] = '';
      actualizarCelda(intentoActual, posicionLetra, '');
    }
  }

  // Enter: validar intento
  if (e.key === 'Enter') {
    if (posicionLetra === longitudPalabra) {
      validarIntento();
    }
  }
});

// Actualiza el contenido visual de una celda
function actualizarCelda(fila, col, letra) {
  const div = document.getElementById(`cell-${fila}-${col}`);
  div.textContent = letra;
  div.classList.remove('absent','present','correct');
}

// Valida el intento actual y pinta colores
function validarIntento() {
  const intento = gridData[intentoActual].join('');
  const respuesta = pokemonSeleccionado;
  const estadoLetras = Array(longitudPalabra).fill('absent');
  const freq = {}; // frecuencia de letras en respuesta

  // 1) Contar frecuencia de cada letra en respuesta
  for (let ch of respuesta) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  // 2) Etiquetar correct (verde)
  for (let i = 0; i < longitudPalabra; i++) {
    if (intento[i] === respuesta[i]) {
      estadoLetras[i] = 'correct';
      freq[intento[i]]--;
    }
  }

  // 3) Etiquetar present (amarillo) o absent (gris)
  for (let i = 0; i < longitudPalabra; i++) {
    if (estadoLetras[i] === 'correct') continue;
    const letra = intento[i];
    if (freq[letra] > 0) {
      estadoLetras[i] = 'present';
      freq[letra]--;
    }
  }

  // 4) Pintar celdas con clase según estado
  for (let i = 0; i < longitudPalabra; i++) {
    const div = document.getElementById(`cell-${intentoActual}-${i}`);
    div.classList.add(estadoLetras[i]);
  }

  // 5) Comprobar victoria/derrota
  if (intento === respuesta) {
    mensajeEl.textContent = '¡Has ganado!';
    return;
  }

  intentoActual++;
  posicionLetra = 0;

  if (intentoActual === MAX_INTENTOS) {
    mensajeEl.textContent = `Perdiste. El Pokémon era "${respuesta.toUpperCase()}".`;
  }
}

// Reiniciar al pulsar botón
btnReiniciar.addEventListener('click', iniciarJuego);

// Al cargar página
window.addEventListener('DOMContentLoaded', iniciarJuego);
