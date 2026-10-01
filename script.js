/* =========================================================
   PROYECTO ESCOLAR - POKÉMON ROJO FUEGO
   Este archivo se encarga de:
   1) Abrir y cerrar el menú en celulares.
   2) Mostrar las ciudades de Kanto.
   3) Mostrar los Pokémon iniciales.
   4) Mostrar los 8 Líderes de Gimnasio.
   5) Descargar los 151 Pokémon desde PokeAPI y mostrarlos.
   6) Permitir buscar Pokémon por nombre.
   ========================================================= */

/* ---------- 1) MENÚ RESPONSIVE ---------- */
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("activo");
});

/* ---------- DATOS FIJOS (no necesitan API) ---------- */

// Ciudades más importantes de Kanto
const ciudadesKanto = [
  { nombre: "Pueblo Paleta", descripcion: "Donde comienza la aventura del jugador." },
  { nombre: "Ciudad Plateada", descripcion: "Sede del primer Gimnasio Pokémon, tipo Roca." },
  { nombre: "Ciudad Celeste", descripcion: "Ciudad junto al mar, conocida por su Gimnasio de tipo Agua." },
  { nombre: "Ciudad Fucsia", descripcion: "Hogar de la Casa Safari y un Gimnasio tipo Veneno." },
  { nombre: "Ciudad Azafrán", descripcion: "La ciudad más grande de Kanto, sede de Silph S.A." },
  { nombre: "Ciudad Carmín", descripcion: "Puerto donde el jugador recibe su primer barco." }
];

// Pokémon iniciales
const pokemonIniciales = [
  {
    nombre: "Bulbasaur",
    id: 1,
    tipo: "grass",
    descripcion: "Pokémon planta con un bulbo en el lomo que crece con el tiempo."
  },
  {
    nombre: "Charmander",
    id: 4,
    tipo: "fire",
    descripcion: "Pokémon fuego con una llama en la cola que refleja su estado de ánimo."
  },
  {
    nombre: "Squirtle",
    id: 7,
    tipo: "water",
    descripcion: "Pokémon agua que se protege dentro de su caparazón ante el peligro."
  }
];

// Líderes de Gimnasio de Kanto
const lideresGimnasio = [
  { nombre: "Brock", ciudad: "Ciudad Plateada", tipo: "rock" },
  { nombre: "Misty", ciudad: "Ciudad Celeste", tipo: "water" },
  { nombre: "Lt. Surge", ciudad: "Ciudad Carmín", tipo: "electric" },
  { nombre: "Erika", ciudad: "Ciudad Azafrán", tipo: "grass" },
  { nombre: "Koga", ciudad: "Ciudad Fucsia", tipo: "poison" },
  { nombre: "Sabrina", ciudad: "Ciudad Azafrán", tipo: "psychic" },
  { nombre: "Blaine", ciudad: "Isla Canela", tipo: "fire" },
  { nombre: "Giovanni", ciudad: "Ciudad Verde", tipo: "ground" }
];

/* ---------- 2) MOSTRAR CIUDADES DE KANTO ---------- */
const ciudadesGrid = document.getElementById("ciudadesGrid");

ciudadesKanto.forEach(ciudad => {
  const tarjeta = document.createElement("div");
  tarjeta.className = "card";
  tarjeta.innerHTML = `
    <h3>${ciudad.nombre}</h3>
    <p>${ciudad.descripcion}</p>
  `;
  ciudadesGrid.appendChild(tarjeta);
});

/* ---------- 3) MOSTRAR POKÉMON INICIALES ---------- */
const inicialesGrid = document.getElementById("inicialesGrid");

pokemonIniciales.forEach(pokemon => {
  const tarjeta = document.createElement("div");
  tarjeta.className = "card card-iniciales";
  tarjeta.innerHTML = `
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.nombre}">
    <h3>${pokemon.nombre}</h3>
    <span class="tipo tipo-${pokemon.tipo}">${pokemon.tipo}</span>
    <p>${pokemon.descripcion}</p>
  `;
  inicialesGrid.appendChild(tarjeta);
});

/* ---------- 4) MOSTRAR LÍDERES DE GIMNASIO ---------- */
const lideresGrid = document.getElementById("lideresGrid");

lideresGimnasio.forEach(lider => {
  const tarjeta = document.createElement("div");
  tarjeta.className = "card card-lider";
  tarjeta.innerHTML = `
    <h3>${lider.nombre}</h3>
    <p class="ciudad">${lider.ciudad}</p>
    <span class="tipo tipo-${lider.tipo}">${lider.tipo}</span>
  `;
  lideresGrid.appendChild(tarjeta);
});

/* ---------- 5) CARGAR LOS 151 POKÉMON DESDE POKEAPI ---------- */
const pokedexGrid = document.getElementById("pokedexGrid");
const mensajeCarga = document.getElementById("mensajeCarga");
const inputBuscar = document.getElementById("inputBuscar");

const TOTAL_POKEMON = 151;

// Función que crea una tarjeta HTML para un Pokémon
function crearTarjetaPokemon(pokemon) {
  const numero = pokemon.id.toString().padStart(3, "0");

  // Convertimos la lista de tipos en insignias de colores
  const tiposHTML = pokemon.types
    .map(t => `<span class="tipo tipo-${t.type.name}">${t.type.name}</span>`)
    .join("");

  const tarjeta = document.createElement("div");
  tarjeta.className = "card";
  // Guardamos el nombre en minúscula para poder filtrar el buscador
  tarjeta.dataset.nombre = pokemon.name;

  tarjeta.innerHTML = `
    <p class="numero">#${numero}</p>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h3>${pokemon.name}</h3>
    ${tiposHTML}
  `;

  return tarjeta;
}

// Pedimos la información de un solo Pokémon por su número
async function obtenerPokemon(id) {
  const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return respuesta.json();
}

// Cargamos los 151 Pokémon en paralelo y los mostramos en pantalla
async function cargarPokedex() {
  const pedidos = [];

  for (let id = 1; id <= TOTAL_POKEMON; id++) {
    pedidos.push(obtenerPokemon(id));
  }

  try {
    const listaPokemon = await Promise.all(pedidos);

    // Ordenamos por número de Pokédex, por si llegaran desordenados
    listaPokemon.sort((a, b) => a.id - b.id);

    listaPokemon.forEach(pokemon => {
      pokedexGrid.appendChild(crearTarjetaPokemon(pokemon));
    });

    mensajeCarga.style.display = "none";
  } catch (error) {
    mensajeCarga.textContent = "No se pudo cargar la Pokédex. Verifica tu conexión a internet.";
    console.error("Error cargando Pokémon:", error);
  }
}

cargarPokedex();

/* ---------- 6) BUSCADOR DE POKÉMON POR NOMBRE ---------- */
inputBuscar.addEventListener("input", () => {
  const texto = inputBuscar.value.toLowerCase().trim();
  const tarjetas = pokedexGrid.querySelectorAll(".card");

  tarjetas.forEach(tarjeta => {
    const coincide = tarjeta.dataset.nombre.includes(texto);
    tarjeta.style.display = coincide ? "block" : "none";
  });
});
