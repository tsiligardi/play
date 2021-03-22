const fetch = require ("node-fetch")
const express = require("express")
const bodyParser = require("body-parser")
const app = new express()
app.use(express.json())


fetch("http://localhost:8080/")
  .then(response => {
    if (response.status === 200) {return await response.json}
  })