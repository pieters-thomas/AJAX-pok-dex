//required variables and constants;
const API_POKEMON = 'https://pokeapi.co/api/v2/pokemon/'
const API_SPECIES = 'https://pokeapi.co/api/v2/pokemon-species/'
const MOVE_SET = 4;
const EVO_SWAP_TIME = 4000;

let pokemonId = '';

//functions to fetch required data;

const displayPokemon = function (source, spriteDestination, nameDestination) {
    document.getElementById(nameDestination).textContent = `#${source['id']} ${source['species']['name']}`;
    document.getElementById(spriteDestination).src = source['sprites']['other']['official-artwork']['front_default'];
}

const randomize = function () {
    return 0.5 - Math.random();
}

const fetchEvolutionData = async function (speciesData) {

    const evoJson = await fetch(speciesData['evolution_chain']['url']);
    const evoData = await evoJson.json();

    let evoChain = [[], [], []];

    evoChain[0].push(await fetchData(evoData['chain']['species']['name'], API_POKEMON))

    if (evoData['chain']['evolves_to'].length === 0) {
        return evoChain;
    }

    for (let i = 0; i < evoData['chain']['evolves_to'].length; i++) {
        let evolution = await fetchData(evoData['chain']['evolves_to'][i]['species']['name'], API_POKEMON);
        evoChain[1].push(evolution)

        if (evoData['chain']['evolves_to'][i]['evolves_to'].length === 0) {
            continue;
        }

        for (let j = 0; j < evoData['chain']['evolves_to'][i]['evolves_to'].length; j++) {
            let evolution = await fetchData(evoData['chain']['evolves_to'][i]['evolves_to'][j]['species']['name'], API_POKEMON);
            evoChain[2].push(evolution);
        }
    }
    return evoChain;
}

const fetchData = async function (input, API) {
    const jsonData = await fetch(API + input.toString());
    return await jsonData.json();
}

const showMoves = function (pokeDataMoves) {

    let moveBlock = document.querySelectorAll('.move')
    let movePool = pokeDataMoves.sort(randomize)
    let moveSet = [];

    let length = pokeDataMoves.length

    for (let i = 0; i < MOVE_SET; i++) {
        moveBlock[i].textContent = '';
    }

    for (let i = 0; i < Math.min(MOVE_SET, length); i++) {
        moveSet.push(movePool.shift()['move']['name']);
    }

    for (let i = 0; i < moveSet.length; i++) {
        moveBlock[i].textContent = moveSet[i]
    }
}

const showEvolution = function (evoData) {

    displayPokemon(evoData[0][0], 'base-evo-sprite', 'base-evo-tag')
    document.getElementById('evoTagSecond').classList.add('invisible')
    document.getElementById('evoTagThird').classList.add('invisible')

    if (evoData[1].length === 0) {
        return;
    }

    let i = 1;
    displayPokemon(evoData[1][0], 'first-evo-sprite', 'first-evo-tag')
    document.getElementById('evoTagSecond').classList.remove('invisible')

    if (evoData[1].length > 1) {
        setInterval(function () {
            displayPokemon(evoData[1][i++], 'first-evo-sprite', 'first-evo-tag')
            if (i > (evoData[1].length - 1)) {
                i = 0;
            }
        }, EVO_SWAP_TIME)
    }

    if (evoData[2].length === 0) {
        return;
    }
    let j = 1;
    displayPokemon(evoData[2][0], 'second-evo-sprite', 'second-evo-tag')
    document.getElementById('evoTagThird').classList.remove('invisible')

    if (evoData[2].length > 1) {
        setInterval(function () {
            displayPokemon(evoData[2][j++], 'second-evo-sprite', 'second-evo-tag')
            if (j > (evoData[2].length - 1)) {
                j = 0;
            }
        }, EVO_SWAP_TIME)
    }
}

const pokeDex = async function (target) {
    //reset previously running intervals;
    let interval_id = window.setInterval("", 9999);
    for (let i = 1; i < interval_id; i++) window.clearInterval(i);

    const pokeData = await fetchData(target, API_POKEMON);
    const speciesData = await fetchData(target, API_SPECIES);
    const evoData = await fetchEvolutionData(speciesData);

    //show searched Pokemon;
    displayPokemon(pokeData, 'showSprite', 'showTag')

    //show evolution line-up;
    showEvolution(evoData);

    //show move-set;
    showMoves(pokeData['moves']);

    pokemonId = pokeData['id'];

}

//setting functions to buttons

document.getElementById('search').addEventListener('click',async function (){
    await pokeDex(document.getElementById(`who'sThatPokemon`).value);
})

document.getElementById('previous').addEventListener('click',async function (){
    await pokeDex(pokemonId -1);
})

document.getElementById('next').addEventListener('click',async function (){
    await pokeDex(pokemonId +1);
})