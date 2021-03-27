const fetch = require ("node-fetch")

const getField = async(link) => {
  let response = await fetch(`${link}?format=json`)
  if (response.status === 200) {
    response = await response.json()
  } else {
    response = await response.status
  }
  return await response
}

const login = async(link, name, password) => {
  const response = await fetch(`${link}signup?name=${name}&password=${password}`)
  return await response.status
}
const fire = async(link, x, y, team, password) => {
  let response = await fetch(`${link}fire?x=${x}&y=${y}&team=${team}&password=${password}`)
  if (response.status === 200) {
    response = await response.json()
  } else {
    response = await response.status
  }
  return await response
}
const getScore = async(link) => {
  let response = await fetch(`${link}score`)
  if (response.status === 200) {
    response = await response.json()
  } else {
    response = await response.status
  }
  return await response
}

module.exports = {
  getField,
  login,
  fire,
  getScore
}

// per fare con delle funzioni asincrone devo dichiare un main asincrono che mi va a gesitre tutte le funzioni asincrone