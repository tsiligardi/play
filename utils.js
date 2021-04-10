const fetch = require ("node-fetch")

const getField = async function(link) {
  let response = await fetch(`${link}/?format=json`)
  if (response.status === 200) {
    response = await response.json()
  } else {
    response = await response.status
  }
  // console.log(response)
  return await response
}

const signup = async(link, name, password) => {
  const response = await fetch(`${link}/signup?team=${name}&password=${password}`)
  return await response.status
}
const fire = async(link, x, y, team, password) => {
  let response = await fetch(`${link}/fire?x=${x}&y=${y}&team=${team}&password=${password}`)
  if (response.status === 200) {
    response = await response.json()
  } else {
    response = await response.status
    if (response === 429) {
      console.log("## DEBUG: non è passato un secondo ##")
    }
  }
  console.log(response)
  return await response
}
const getScore = async(link) => {
  let response = await fetch(`${link}/score`)
  if (response.status === 200) {
    response = await response.json()
  } else {
    response = await response.status
  }
  return await response
}

const shuffle = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}


module.exports = {
  getField,
  signup,
  fire,
  getScore, 
  shuffle
}

// per fare con delle funzioni asincrone devo dichiare un main asincrono che mi va a gesitre tutte le funzioni asincrone