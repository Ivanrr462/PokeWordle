const MAX_INTENTOS = 6;

const reinicio = document.getElementById('reiniciar');
const tablero = document.getElementById('tablero');
var mensaje = document.getElementById('mensaje');

let pokemonSeleccionado = '';
var alturaTablero = 6;
var anchoTablero;
let intentos = 0;
let letra = 0;

let tableroDibujo = [];


async function  pokemonAleatorio() {
  const pokemons = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  const data = await pokemons.json();
  const pokemonAleatorio = data.results[
    Math.floor(Math.random() * data.results.length)
  ];

  const letrasPokemon = pokemonAleatorio.name.length;

  return letrasPokemon;
}

async function crearTablero() {
  tableroDibujo = [];
  tablero.innerHTML = '';
  const ancho = await pokemonAleatorio();

  tablero.style.gridTemplateColumns = `repeat(${ancho}, 1fr)`;
  for (let i = 0; i < alturaTablero; i++) {
    tableroDibujo[i] = Array(ancho).fill('');
    for (let j = 0; j < ancho; j++) {
      const div = document.createElement('div');
      div.classList.add('celda');
      div.setAttribute('id', `celda-${i}-${j}`);
      tablero.appendChild(div);
    }
  }
}

async function iniciarJuego() {
  intentos = 0;
  mensaje.textContent = '';
  letra = 0;

  await crearTablero();
}




window.addEventListener('DOMContentLoaded', iniciarJuego);