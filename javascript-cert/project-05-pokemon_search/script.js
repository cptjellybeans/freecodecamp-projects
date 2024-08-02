async function getPokemon (searchInput) {
  // call api
  const response = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${searchInput.toLowerCase()}`);
  return (response.ok) ? await response.json() : null;
}

function setFields (fields) {
  console.log(`Setting fields`,fields);
  for (const field of Object.keys(fields)) {
    let value = fields[field];
    // upper case if string
    switch (typeof(value)) {
      case "string":
        value = value.toUpperCase();
        break;
      case "object":
        if (Array.isArray(value)) {
          value = value.map(el=>`<span>${el.toUpperCase()}</span>`).join("")
        }
        break;
    }
    document.getElementById(field).innerHTML = value;
  }
}

function setSprite (spriteURL) {
  document.getElementById("sprite-span").innerHTML = `<img src=${spriteURL} id="sprite" />`;
}

function getStat(pokemon,statName) {
  return pokemon.stats.filter(stat=>stat.stat.name==statName).shift().base_stat;
}

async function search (searchInput) {
  console.log(`Searching for ${searchInput}`);
  // call pokemon
  const pokemon = await getPokemon(searchInput);
  if (pokemon==null) {
    return alert("Pokémon not found");
  } else {
    // found pokemon, display it
    setFields({
      "pokemon-name":pokemon.name,
      "pokemon-id":pokemon.id,
      "weight":pokemon.weight,
      "height":pokemon.height,
      "types":pokemon.types.map(type=>type.type.name),
      "hp":getStat(pokemon,"hp"),
      "attack":getStat(pokemon,"attack"),
      "defense":getStat(pokemon,"defense"),
      "special-attack":getStat(pokemon,"special-attack"),
      "special-defense":getStat(pokemon,"special-defense"),
      "speed":getStat(pokemon,"speed")
    })
    setSprite(pokemon.sprites.front_default);
  }
}

// add listeners
document.getElementById("search-button").addEventListener('click', ()=>{
  search(document.getElementById("search-input").value)
})