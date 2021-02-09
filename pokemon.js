const move_max = 4;
let FetchData = async function (search) {
    let source = await fetch('https://pokeapi.co/api/v2/pokemon/' + search.toString());
    return await source.json();
};
let FetchEvoChain = async function (pokemon) {
    let source = await fetch(pokemon['species']['url']);
    let data = await source.json();
    source = await fetch(data['evolution_chain']['url']);
    data = await source.json();

    let base = await FetchData(data['chain']['species']['name'])

    document.getElementById('base').src = base['sprites']['other']['official-artwork']['front_default']
    document.getElementById('base').classList.remove('invisible')

    if (data['chain']['evolves_to'].length > 0) {
        let evo1 = await FetchData(data['chain']['evolves_to'][0]['species']['name']);
        document.getElementById('evo1').src = evo1['sprites']['other']['official-artwork']['front_default'];
        document.getElementById('evo1').classList.remove('invisible');
        if (data['chain']['evolves_to'][0]['evolves_to'].length > 0) {
            let evo2 = await FetchData(data['chain']['evolves_to'][0]['evolves_to'][0]['species']['name']);
            document.getElementById('evo2').src = evo2['sprites']['other']['official-artwork']['front_default'];
            document.getElementById('evo2').classList.remove('invisible');
        } else document.getElementById('evo2').classList.add('invisible');
    } else {
        document.getElementById('evo1').classList.add('invisible');
        document.getElementById('evo2').classList.add('invisible');
    }
};

document.getElementById('run').addEventListener('click', async function () {
        let input = document.getElementById('find').value
        let source = await fetch('https://pokeapi.co/api/v2/pokemon/' + input.toString());
        let pokemon = await source.json();

        //Get Name And Post !!!Add where to Post!!!
        document.getElementById('name_tag').innerText = '#' + pokemon['id'] + ' ' + pokemon['name']

        //Select Moveset !!!Add where to post!!!
        let FetchMoves = function (pokemon) {
            let move_set = [];
            for (let i = 0; i < move_max; i++) {
                let random = Math.floor(Math.random() * pokemon['moves'].length);
                let random_move = pokemon['moves'][random]['move']['name'];
                move_set.push(random_move);
            }
            if ([...new Set(move_set)].length === 1) {
                document.getElementById('pokemon_move1').innerText = move_set[0];
                document.getElementById('pokemon_move2').innerText = '';
                document.getElementById('pokemon_move3').innerText = '';
                document.getElementById('pokemon_move4').innerText = '';
            } else if ([...new Set(move_set)].length < move_max) FetchMoves(pokemon);
            else {
                document.getElementById('pokemon_move1').innerText = move_set[0];
                document.getElementById('pokemon_move2').innerText = move_set[1];
                document.getElementById('pokemon_move3').innerText = move_set[2];
                document.getElementById('pokemon_move4').innerText = move_set[3];
            }
        }
        FetchMoves(pokemon);

        //Select Image and Post !!!Add where to Post!!!
        document.getElementById("pokemon_picture").src = pokemon['sprites']['other']['official-artwork']['front_default'];

        //Select Evolution Chain
        await FetchEvoChain(pokemon);

    }
)