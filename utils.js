const fetch = require ("node-fetch")

const getField = async() => {
  let response = await fetch("http://localhost:8080/?format=json")
  if (response.status === 200) {
    response = await response.json()
  } else {
    response = await response.status
  }
  return await response
}

const login = async(name, password) => {
  const response = await fetch(`http://localhost:8080/signup?name=${name}&password=${password}`)
  return await response.status
}
const battle = async(x, y, team, password) => {
  let response = await fetch(`http://localhost:8080/fire?x=${x}&y=${y}&team=${team}&password=${password}`)
  if (response.status === 200) {
    response = await response.json()
  } else {
    response = await response.status
  }
  return await response
}
const getScore = async() => {
  let response = await fetch("http://localhost:8080/score")
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
  battle,
  getScore
}

// per fare con delle funzioni asincrone devo dichiare un main asincrono che mi va a gesitre tutte le funzioni asincrone