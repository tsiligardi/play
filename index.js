const { randomInt } = require("mathjs");
const { getField, fire, signup, shuffle } = require("./utils")

let W, H;
const max_ship_size = 6
let near_ship_weight = 0
const cumulative_ship_coef = 1.4 // formula del peso extra total_weight = near_ship_weight * (cumulative_ship_coef) ** ships_number
//const link = "http://93.42.249.207:8080"
const link = "http://127.0.0.1:8080"
const name = "Br2"
const password = "c2aea7bdd7e375ad44127fe"

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// verifica se le coordinate fornite potrebbero contenere una nave
// aggiorna in automatico la mappa delle probabilità e (potenzialmente) restituisce un elenco di celle adiacenti su cui applicare il modificatore near_ship_coef
const compute_position = async function(p_map, field, _x, _y, w, h) {
  try {
    let is_free = true
    let interrupt = false
    let ships_number = 0 // questo numero corrisponde al numero di pezzi di nave con lo stesso id
    let ship_id = "to_be_assigned"

    for (let x = _x; x < _x + w; x++) {
      if (interrupt) {
        break
      }
      for (let y = _y; y < _y + h; y++) {
        const cell = field[y][x]
        if (cell.hit && !cell.ship) { // cella colpita senza nave
          p_map[y][x] = -1
          is_free = false
          interrupt = true
          break
        }
        else if (cell.hit && cell.ship) { // cella colpita con nave
          p_map[y][x] = -1
          if (!cell.ship.alive) { // è considerato come cella colpita senza nave ai fini del calcolo
            is_free = false
            interrupt = true
            break
          } else {
            if (ship_id === "to_be_assigned") {
              ship_id = cell.ship.id
            }
            if (cell.ship.id !== ship_id) { // vuol dire che ci sono più pezzi di navi diverse, quindi non ci può essere la nave
              is_free = false
              interrupt = true
              break
            }
            ships_number += 1
          }
        }
      }
    }
    if (is_free) {
      for (let x = _x; x < _x + w; x++) {
        for (let y = _y; y < _y + h; y++) {
          if (p_map[y][x] < 0) { continue }
          if (ships_number) { // ci passano delle navi, bisogna pesare maggiormente questa posizione
            p_map[y][x] += near_ship_weight * Math.pow(cumulative_ship_coef, ships_number)
          } else {
            p_map[y][x] += 1
          }
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const calculate_partial_p_map = async function(ship_size, field) {
  let partial_p_map = Array(H).fill().map(() => Array(W).fill(0))
  
  // considera i casi delle navi orientate verticalmente
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H - ship_size + 1; y++) {
      compute_position(partial_p_map, field, x, y, 1, ship_size)
    }
  }

  // considera i casi delle navi orientate orizzontalmente
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W - ship_size + 1; x++) {
      compute_position(partial_p_map, field, x, y, ship_size, 1)
    }
  }

  return partial_p_map
}

const get_p_map = async function(field) {
  let probability_maps = []
  for (let i = 1; i <= max_ship_size; i++) {
    let partial_map = await calculate_partial_p_map(i, field)
    probability_maps.push(partial_map)
  }
  let final_map = Array(H).fill().map(() => Array(W).fill(0))
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      final_map[y][x] = probability_maps.reduce((partial_val, e) => {
        if (partial_val < 0 || e[y][x] < 0) {
          partial_val = -1
          return partial_val
        }
        partial_val += e[y][x]
        return partial_val
      }, 0)
    }
  }
  return final_map
}

const get_fire_coords = async function(probability_map) {
  let max = 0
  let fire_coords = []
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      let val = probability_map[y][x]
      if (val > max) {
        max = val
        fire_coords = [[y, x]]
      } else if (val === max) {
        fire_coords.push([y, x])
      }
    }
  }
  return fire_coords
}

const take_turn = async function() {
  const t_0 = Date.now()
  const { field } = await getField(link)
  let probability_map = await get_p_map(field)
  let fire_coords = await get_fire_coords(probability_map)
  shuffle(fire_coords)
  if (fire_coords.length > 15) {
    fire_coords = fire_coords.slice(0, 14)
  }
  for (let i = 0; i < fire_coords.length; i++) {
    const field_compare = await getField(link)
    if (!field_compare.field[fire_coords[i][0]][fire_coords[i][1]].hit) {
      let t_1 = Date.now()
      if (t_1 - t_0 < 1000) {
        await sleep(1000 - (t_1 - t_0) + 1)
      }
      fire(link, fire_coords[i][1], fire_coords[i][0], name, password)
      break
    }
  }
}

const main = async function() {
  for (let i = 1; i <= max_ship_size; i++) {
    near_ship_weight += (i * 2)
  }
  try {
    signup(link, name, password)
    const { field } = await getField(link)
    W = await field[0].length
    H = await field.length
  }  catch (e) {
    console.log(e)
    return null
  }
  console.log("login effettuato")
  while (true) {
    await take_turn()
  }
}


main()