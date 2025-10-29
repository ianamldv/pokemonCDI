const axios = require('axios');

const nameOrId = process.argv[2];

if (!nameOrId) {
    console.log("Provide a Pokemon name or id!");
    console.log(`Example: 
        node pokemon.js 25 
        or
        node pokemon.js pikachu
        `);
}

async function getPokemon(nameOrId) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
        const data =  response.data;

        const nameId = `${data.name.toUpperCase()} (#${data.id})`;
        const width = nameId.length + 4;
        const top = '╔' + '═'.repeat(width) + '╗';
        const middle = '║ ' + nameId + '   ║ ';
        const bottom  = '╚' + '═'.repeat(width) + '╝';


        function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        const hp = data.stats.find(s => s.stat.name === 'hp').base_stat;
        const attack = data.stats.find(s => s.stat.name === 'attack').base_stat;
        const defense = data.stats.find(s => s.stat.name === 'defense').base_stat;
        const speed = data.stats.find(s => s.stat.name === 'speed').base_stat;


        console.log(`\n🔍 Searching for: ${data.name}\n`);

        console.log(top);
        console.log(middle);
        console.log(bottom);

        console.log(`\n📏 Height: ${data.height}m`);
        console.log(`⚖️  Weight: ${data.weight}kg`);
        console.log(`⚡ Type: ${data.types.map(t => capitalize(t.type.name))}`);

        console.log("\n📊 Base stats: ");
        console.log(`❤️  HP: ${hp}`);
        console.log(`🗡️  Attack: ${attack}`);
        console.log(`🛡️  Defense: ${defense}`);
        console.log(`💨 Speed: ${speed}`);


    } catch (error) {
        console.log(`Error catched : ${error.response}`);
    }
};

getPokemon(nameOrId);