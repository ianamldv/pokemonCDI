const axios = require('axios');
const chalk = require('chalk');
const ImageToAscii = require('image-to-ascii');

const args = process.argv.slice(2);
let input = args[0];

const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};

//explains the logic of the program when no input is provided
if (!input) {
    console.log("Provide a Pokemon name or id!");
    console.log(`Example: 
        node pokemon.js 25/node pokemon.js pikachu -> to get info and drawing of a pokemon by nasme or code
        node pokemon.js random -> for a random pokemon form gen1
        node pokemon.js list 1 5 -> for all the pokemons in that range
        node pokemon.js compare pikachu bulbasaur -> for comparing two pokemons
        `);
    process.exit();
}

//this function fetches all the needed data from API
async function fetchPokemonData(nameOrId) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
        const data =  response.data;

        function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        return {
            name: data.name.toUpperCase(),
            id: data.id,
            height: data.height,
            weight: data.weight,
            types: data.types.map(t => capitalize(t.type.name)),
            stats: {
                hp: data.stats.find(s => s.stat.name === 'hp').base_stat,
                attack: data.stats.find(s => s.stat.name === 'attack').base_stat,
                defense: data.stats.find(s => s.stat.name === 'defense').base_stat,
                speed: data.stats.find(s => s.stat.name === 'speed').base_stat,
            }};

    } catch (error) {
        console.log(`Error found: ${error.message}`);
        return null;
    }
};

//this function prints information about a singlr pokemon + prints an ascii coloured image
async function printPokemon(pokemon) {
    const nameId = `${pokemon.name.toUpperCase()} (#${pokemon.id})`;
    const width = nameId.length + 4;
    const top = '╔' + '═'.repeat(width) + '╗';
    const middle = '║ ' + nameId + '   ║ ';
    const bottom  = '╚' + '═'.repeat(width) + '╝';

    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    ImageToAscii(spriteUrl, { size: { width: 20 }, colored: true }, (err, converted) => {
        if (err) {
            console.error("Error converting image:", err);
            return reject(err);
        }

        console.log(`\n🔍 Searching for: ${pokemon.name}\n`);
        console.log(top);
        console.log(middle);
        console.log(bottom);

        console.log(converted);

        console.log(`\n📏 Height: ${pokemon.height}m`);
        console.log(`⚖️  Weight: ${pokemon.weight}kg`);
        console.log(`⚡ Type: ${printColoredTypes(pokemon.types)}`);

        console.log("\n📊 Base stats: ");
        console.log(`❤️  HP: ${pokemon.stats.hp}`);
        console.log(`🗡️  Attack: ${pokemon.stats.attack}`);
        console.log(`🛡️  Defense: ${pokemon.stats.defense}`);
        console.log(`💨 Speed: ${pokemon.stats.speed}`);
    });
}

//this function compares 2 pokemons and rates which one is stronger
async function compare() {
    const poke1 = await fetchPokemonData(args[1]);
    const poke2 = await fetchPokemonData(args[2]);

    if (!poke1 || !poke2) return;

    console.log("POKEMON COMPARASSION");
    console.log(`\n${poke1.name} vs ${poke2.name}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    function compareStats(statName, stat1, stat2) {
        let winner;
        if (stat1 > stat2) winner = poke1.name;
        else if (stat2 > stat1) winner = poke2.name;
        else winner = "Draw";

        console.log(`${statName}: ${stat1} vs ${stat2} -> ${winner} wins!`);
    }

    compareStats("HP", poke1.stats.hp, poke2.stats.hp);
    compareStats("attack", poke1.stats.attack, poke2.stats.attack);
    compareStats("Defense", poke1.stats.defense, poke2.stats.defense);
    compareStats("Speed", poke1.stats.speed, poke2.stats.speed);
    console.log('\n');

    const total1 = (poke1.stats.attack + poke1.stats.defense + poke1.stats.speed + poke1.stats.hp);
    const total2 = (poke2.stats.attack + poke2.stats.defense + poke2.stats.speed + poke2.stats.hp);

    if (total1 > total2) {
        console.log(`Overall: ${poke1.name} is stronger!`);
    } else if (total2 > total1) {
        console.log(`Overall: ${poke2.name} is stronger!`);
    } else {
        console.log(`It's a draw`);
    }
};

//this prints the colour of the pokemons based on their type
function printColoredTypes(typesArray) {
    return typesArray.map(type => {
        const key = type.toLowerCase();
        const color = typeColors[key] || '#FFFFFF';
        return chalk.hex(color)(type.toUpperCase());
    }).join(' | ');
}

//this is the function that manages the inputs
async function run() {
    if (input === "random") {
    let nameOrId = Math.floor(Math.random() * 151) + 1;
    const pokemon = await fetchPokemonData(nameOrId);
    if (pokemon) printPokemon(pokemon);

} else if (input === "list") {
    const start = Number(args[1]);
    const end = Number(args[2]);

    if (!start || !end) {
        console.log("There should be 2 diffrent arguments");
        return;
    }
    for (let i = start; i <= end; i++) {
        const pokemon = await fetchPokemonData(i);
        if (pokemon) printPokemon(pokemon);
    }

} else if (input === "compare") {
    if (!args[1] || !args[2]) {
        console.log("There should be 2 arguments to compare!");
        return;
    }
    await compare();
} else {
  const pokemon = await fetchPokemonData(input);
  if (pokemon) printPokemon(pokemon);
}};

run();

